const mongoose = require('mongoose');

const connectDB = async (url) => {
    await mongoose.connect(url, { useNewUrlParser: true });
    const db = mongoose.connection;
    db.once('error', console.error.bind(console, 'MongoDb error connection'));
};

module.exports = connectDB;
