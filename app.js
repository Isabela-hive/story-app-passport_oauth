const express = require('express');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const auth = require('./routes/ouathRouter');
const stories = require('./routes/stories');
const connectdb = require('./config/db');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('dotenv').config();
require('./config/passport-setup');
const bodyParser = require('body-parser');
const app = express();

port = process.env.PORT;

//bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//ejs
app.use(express.static('public'));
app.use(expressLayouts);
//app.use(morgan('dev'));

app.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: [process.env.cookieKey],
    })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//view- engine
app.set('view engine', 'ejs');
app.set('layout', './layout/main');

//routes
app.use('/', require('./routes/index'));
app.use('/auth', auth);
app.use('/stories', stories);

const start = async () => {
    try {
        await connectdb(process.env.MONGO_URI);
        console.log('Db is connected');

        app.listen(port, () => console.log(`server running on port ${port}`));
    } catch (err) {
        console.log(err);
    }
};
start();
