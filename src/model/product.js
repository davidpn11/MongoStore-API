const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  slogan: { type: String, required: true },
  description: { type: String },
  stars: { type: Number, default: 0 },
  category: { type: String, required: true },
  price: { type: Number, default: 0 },
})

module.exports = mongoose.model('Product', productSchema)
