const mongoose = require('mongoose');

const connectDB = async (uri) => {
  if (!uri) {
    throw new Error('MONGO_URI is required');
  }

  try {
    await mongoose.connect(uri, {
      // Mongoose v7 doesn't require these but harmless to include for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Fail fast during development so you can see the error
    process.exit(1);
  }
};

module.exports = connectDB;
