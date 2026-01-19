
const mongoose = require('mongoose');

const CustomPosterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true },
  customText: { type: String },
  status: { 
    type: String, 
    enum: ['Submitted', 'In Progress', 'Completed'],
    default: 'Submitted'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomPoster', CustomPosterSchema);
