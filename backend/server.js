// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const mainRouter = require('./routes'); // This imports from routes/index.js

const app = express();

// Connect to MongoDB
connectDB().then(() => {
  console.log('MongoDB connected successfully');
  
  // Middleware
  app.use(cors());
  app.use(express.json());

  // Main API router - all routes will be prefixed with /api
  app.use('/api', mainRouter);

  // Health check route (not part of mainRouter)
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'HeritEdge API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Docs: http://localhost:${PORT}/api-docs`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});