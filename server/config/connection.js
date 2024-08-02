const mongoose = require('mongoose');
require('dotenv').config(); // Ensure environment variables are loaded

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern-shopping';

const connectDb = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }
};

module.exports = connectDb;