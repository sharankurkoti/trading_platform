import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TradeExchangeService.css';

const TradeExchangeService = () => {
  const [step, setStep] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(null);
  const [converted, setConverted] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [tradeResult, setTradeResult] = useState(null);

  // Fetch exchange rate
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      axios.get('https://api.exchangerate.host/latest', {
        params: { base: fromCurrency, symbols: toCurrency }
      })
      .then(res => setRate(res.data.rates[toCurrency]))
      .catch(err => console.error(err));
    }
  }, [fromCurrency, toCurrency]);

  // Convert amount
  const handleConversion = () => {
    const result = (parseFloat(amount) * rate).toFixed(2);
    setConverted(result);
  };

  // Execute trade
  const handleTradeExecution = async () => {
    try {
      const res = await axios.post('/api/trades', {
        fromCurrency,
        toCurrency,
        amount: parseFloat(amount)
      });
      setTradeResult(res.data);
    } catch (err) {
      console.error('Trade execution failed:', err);
    }
  };

  // Final delivery confirmation
  const handleConfirmDelivery = () => {
    if (!tradeResult) {
      // Fallback trade result for demo (if no backend)
      const timestamp = new Date().toISOString();
      setTradeResult({
        tradeId: `TRD-${Math.floor(Math.random() * 10000)}`,
        rate,
        convertedAmount: converted,
        timestamp
      });
    }
    setConfirmed(true);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="modal-window">
      <button className="close-button" onClick={() => window.history.back()}>X</button>

      <div className="manual-trade-container">
        <h1>🔁 Welcome to International Trading</h1>

        {step === 1 && (
          <div className="trade-step">
            <h2>1️⃣ Buyer Initiates Trade</h2>
            <p>Enter trade details to begin.</p>
            <label>From Currency:</label>
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
              <option>USD</option><option>EUR</option><option>INR</option><option>GBP</option>
            </select>

            <label>To Currency:</label>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
              <option>EUR</option><option>USD</option><option>INR</option><option>GBP</option>
            </select>

            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button onClick={() => { handleConversion(); nextStep(); }}>Submit Trade</button>
          </div>
        )}

        {step === 2 && (
          <div className="trade-step">
            <h2>2️⃣ Seller Accepts & Offers Terms</h2>
            <p>Seller responds with current exchange rate: <strong>{rate}</strong></p>
            <p>Proposed Conversion: {amount} {fromCurrency} → {converted} {toCurrency}</p>
            <button onClick={nextStep}>Accept Offer</button>
            <button onClick={prevStep}>Back</button>
          </div>
        )}

        {step === 3 && (
          <div className="trade-step">
            <h2>3️⃣ Negotiation</h2>
            <p>Both parties agree on price and terms. (Simulated)</p>
            <button onClick={nextStep}>Finalize Agreement</button>
            <button onClick={prevStep}>Back</button>
          </div>
        )}

        {step === 4 && (
          <div className="trade-step">
            <h2>4️⃣ Payment</h2>
            <p>Use latest exchange rate to calculate and execute payment.</p>
            <p>Rate: {rate}</p>
            <p>Converted Amount: {converted} {toCurrency}</p>
            <button onClick={() => { handleTradeExecution(); nextStep(); }}>Pay & Proceed</button>
            <button onClick={prevStep}>Back</button>
          </div>
        )}

        {step === 5 && (
          <div className="trade-step">
            <h2>5️⃣ Logistics & Shipment</h2>
            <p>Shipment initiated (simulated)...</p>
            <button onClick={nextStep}>Confirm Shipment</button>
          </div>
        )}

        {step === 6 && (
          <div className="trade-step">
            <h2>6️⃣ Delivery & Settlement</h2>
            <p>Buyer confirms delivery of goods.</p>
            <button onClick={handleConfirmDelivery}>Confirm Delivery</button>
          </div>
        )}

        {confirmed && tradeResult && (
          <div className="trade-step trade-complete">
            <h2>✅ Trade Complete</h2>
            <p><strong>Trade ID:</strong> {tradeResult.tradeId}</p>
            <p><strong>Rate Used:</strong> {tradeResult.rate}</p>
            <p><strong>Converted Amount:</strong> {tradeResult.convertedAmount} {toCurrency}</p>
            <p><strong>Time:</strong> {tradeResult.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeExchangeService;