const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../model/product')
const multer = require('multer')
const fs = require('fs')
const cloudinary = require('cloudinary')
const storage = multer.diskStorage({
  // destination: (req, file, callback) => callback(null, './uploads/'),
  filename: (req, file, callback) =>
    callback(
      null,
      new Date().toISOString().replace(/:/g, '-') + file.originalname
    ),
})
// const storage = multer.memoryStorage()
const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return callback(new Error('Only image files are allowed!'), false)
  }
  callback(null, true)
}

cloudinary.config({
  cloud_name: 'davidpn11',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
})

router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => res.status(200).json(docs))
    .catch(err => res.status(500).json({ err }))
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

router.post('/clear', (req, res) => {
  Product.deleteMany()
    .exec()
    .then(() => res.status(200).json({ status: 'database cleared' }))
    .catch(err => res.status(500).json({ err }))
  // Product.find()
  //   .exec()
  //   .then(docs => {
  //     docs.map(doc => {
  //       if (doc.productImage) {
  //         console.log('image', doc.productImage)
  //         fs.unlink(doc.productImage, err => {
  //           if (err) {
  //             console.log('dont exist')
  //           } else {
  //             console.log('deleted', doc.productImage)
  //           }
  //         })
  //       } else {
  //         console.log('no image')
  //       }
  //     })
  //   })
  //   .then(() => {
  //     console.log('finished')
  //     Product.deleteMany()
  //       .exec()
  //       .then(() => res.status(200).json({ status: 'database cleared' }))
  //   })
  //   .catch(err => res.status(500).json({ err }))
})

router.post('/', upload.single('productImage'), (req, res) => {
  if (req.file) {
    cloudinary.v2.uploader.upload(req.file.path, (err, cloudResult) => {
      if (err) {
        return res.status(500).json({ type: 'image upload', err })
      }
      const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        slogan: req.body.slogan,
        stars: req.body.stars,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
        productImage: cloudResult.secure_url || '',
      })
      product
        .save()
        .then(result => res.status(201).json(cloudResult))
        .catch(err => res.status(500).json(err))
    })
  } else {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      slogan: req.body.slogan,
      stars: req.body.stars,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      productImage: '',
    })
    product
      .save()
      .then(result => res.status(201).json(result))
      .catch(err => res.status(500).json(err))
  }
})

module.exports = router
