// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  isAdmin: { type: Boolean, default: false }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    
    // Only hash if it's not already hashed
    if (!this.password.startsWith('$2a$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);