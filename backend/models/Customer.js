const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  enquiries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enquiry'
  }],
  tags: [{
    type: String,
    enum: ['Potential Lead', 'High Priority', 'Regular Customer', 'VIP']
  }],
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  followUpDate: {
    type: Date
  },
  lastContact: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema); 