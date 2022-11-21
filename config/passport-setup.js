const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();
const User = require('../models/userModel');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:200/auth/google/callback',
            passRequestToCallbackURL: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            //console.log(profile);
            const newUser = {
                googleId: profile.id,
                username: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile._json.picture,
            };
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (user) {
                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (err) {
                console.log(err);
            }

            //check if user exists in our database
            // User.findOne({ googleId: profile.id }).then((currentUser) => {
            //     if (currentUser) {
            //         //alreasy exixts
            //         console.log('user is ' + currentUser);
            //         done(null, currentUser);
            //     } else {
            //         //creae user in the db
            //         new User({
            //             username: profile.displayName,
            //             googleId: profile.id,
            //             image: profile._json.picture,
            //         })
            //             .save()
            //             .then((newUser) => {
            //                 console.log('new User created' + newUser);
            //                 done(null, newUser);
            //             });
            //     }
            // });
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});
