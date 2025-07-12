const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  body: { type: String, required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Answer', answerSchema); 