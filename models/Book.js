const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  Title:       { type: String, required: true },
  Author:      { type: String, required: true },
  Qty:         { type: Number, required: true },
  Description: { type: String, required: true }
});

module.exports = mongoose.model('Book', BookSchema);
