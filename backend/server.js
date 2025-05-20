require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { checkJwt } = require('./middlewares/auth')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(checkJwt);
app.use(require('./middlewares/userSync'));

// Now all routes will have req.user available
app.get('/api/me', (req, res) => {
  res.json(req.user);
});