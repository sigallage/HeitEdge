require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { checkJwt } = require('./middlewares/auth')
const connectDB = require('./config/db')

const app = express()

// Connect to MongoDB first
connectDB().then(() => {
  console.log('MongoDB connection successful') // Success message
  
  // Middleware
  app.use(cors())
  app.use(express.json())

  //Main router
   app.use(mainRouter)

  // Public route
  app.get('/', (req, res) => {
    res.send('HeritEdge Backend API')
  })

  // Protected route example
  app.get('/api/protected', checkJwt, (req, res) => {
    res.json({ 
      message: 'This is a protected route',
      user: req.auth.payload 
    })
  })

  // Auth middleware for all routes below
  app.use(checkJwt)
  app.use(require('./middlewares/userSync'))

  // Authenticated route
  app.get('/api/me', (req, res) => {
    res.json(req.user)
  })

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err)
  process.exit(1)
})