const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../model/product')

router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => res.status(200).json(docs))
    .catch(err => res.status(500).json({ err }))
  // res.status(200).json({
  //   message: 'Orders were fetched',
  // })
})

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .exec()
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(500).json({ err }))
})

router.put('/:productId', (req, res, next) => {
  const _id = req.params.productId
  const { value = '' } = req.body

  Product.updateOne({ _id }, { $set: { value } })
    .exec()
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(500).json({ err }))
})

router.delete('/:productId', (req, res, next) => {
  const _id = req.params.productId
  Product.remove({ _id })
    .exec()
    .then(doc => res.status(200).json(doc))
    .catch(err => res.status(500).json({ err }))
})

router.post('/', (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    value: req.body.value,
  })
  product
    .save()
    .then(result => res.status(201).json(result))
    .catch(err => res.status(500).json(err))
})

module.exports = router
