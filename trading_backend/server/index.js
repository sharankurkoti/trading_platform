import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.js';
import tradeRoutes from './routes/trades.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Built-in JSON parser

// ✅ Routes
app.use('/api/chat', chatRoutes);   // e.g. POST /api/chat/message
app.use('/api/trades', tradeRoutes); // e.g. POST /api/trades

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

  app.get('/', (req, res) => {
  res.send('Welcome to the Trade Backend API');
});
});