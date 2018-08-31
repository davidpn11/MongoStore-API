const express = require('express')
const app = express()
const morgan = require('morgan')
const productsRoutes = require('./routes/products')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/products', productsRoutes)

app.get('/', (req, res) => res.sendFile('./index.html', { root: __dirname }))

mongoose.connect(
  `mongodb+srv://davidpn11:ECuQDHbgSpP41596-@cluster0-vvkaz.mongodb.net/test?retryWrites=true`,
  { useNewUrlParser: true }
)

//middleware to handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

/* Middleware to handle errors.
If the requests reaches here, it means that it couldnt be handled by
any route */
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

module.exports = app
