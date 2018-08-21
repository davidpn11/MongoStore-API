const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Orders were fetched',
  })
})

router.post('/', (req, res) => {
  const product = {
    name: req.body.name,
  }
  res.status(201).json({
    message: 'ok',
    product,
  })
})

module.exports = router
