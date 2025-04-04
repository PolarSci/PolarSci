require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { Connection, PublicKey } = require('@solana/web3.js');
const { create } = require('ipfs-http-client');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/polarsci')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Connect to Solana
const solanaConnection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
);

// Connect to IPFS
const ipfs = create({
  host: process.env.IPFS_HOST || 'ipfs.infura.io',
  port: process.env.IPFS_PORT || 5001,
  protocol: process.env.IPFS_PROTOCOL || 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      `${process.env.IPFS_PROJECT_ID}:${process.env.IPFS_PROJECT_SECRET}`
    ).toString('base64')}`
  }
});

// Routes
app.use('/api/data', require('./routes/data'));
app.use('/api/experiments', require('./routes/experiments'));
app.use('/api/ai', require('./routes/ai'));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // Handle real-time data updates
  socket.on('dataUpdate', (data) => {
    io.emit('dataUpdate', data);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 