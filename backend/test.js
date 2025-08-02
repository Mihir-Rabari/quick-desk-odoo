const mongoose = require('mongoose');

// Replace with your MongoDB connection string
const mongoUri = 'mongodb://localhost:27017/quickdesk';

async function promoteToAdmin(email) {
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    const User = mongoose.model('User', new mongoose.Schema({ role: String, email: String }), 'users');

    const result = await User.updateOne({ email }, { $set: { role: 'agent' } });

    if (result.modifiedCount > 0) {
      console.log(`Successfully updated the role for ${email} to admin`);
    } else {
      console.log(`User with email ${email} not found or already an admin`);
    }
  } catch (error) {
    console.error('Error promoting to admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Call the function with the email of the user you want to promote
promoteToAdmin('drakshushi@luck.com');