const mongoose = require('mongoose');

function connectDB(){
    // const DB_URL = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
    const DB_URL = process.env.MONGO_URI;
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    // }).then(() => {
    //     console.log('Connected to MongoDB');
    // }).catch((err) => {
    //     console.error('Error connecting to MongoDB:', err);
    // });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', function() {
        console.log('MongoDB connection established successfully');
    })
}

module.exports = connectDB;