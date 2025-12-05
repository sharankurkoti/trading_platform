import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/trades', async (req, res) => {
  const { fromCurrency, toCurrency, amount } = req.body;

  if (!fromCurrency || !toCurrency || !amount) {
    return res.status(400).json({ error: 'Invalid trade request' });
  }

  try {
    // Fetch live exchange rate
    const response = await axios.get('https://api.exchangerate.host/latest', {
      params: {
        base: fromCurrency,
        symbols: toCurrency
      }
    });

    const rate = response.data.rates[toCurrency];
    const convertedAmount = (amount * rate).toFixed(2);

    // Simulate storing the trade in DB
    const trade = {
      tradeId: uuidv4(),
      fromCurrency,
      toCurrency,
      originalAmount: amount,
      convertedAmount,
      rate,
      timestamp: new Date().toISOString(),
    };

    // In real app: Save to DB here

    res.json(trade);
  } catch (err) {
    console.error('Error processing trade:', err);
    res.status(500).json({ error: 'Trade processing failed' });
  }
});

export default router;