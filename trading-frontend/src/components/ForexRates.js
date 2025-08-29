import React, { useEffect, useState } from 'react';
import axios from 'axios';
import currencyToFlag from '../utils/currencyFlags';

const tableStyles = {
  width: '100%',
  maxWidth: '400px',
  margin: '20px auto',
  borderCollapse: 'collapse',
  border: '1px solid #ddd',
  textAlign: 'center',
};

const ForexRates = () => {

  const [rates, setRates] = useState(null);

useEffect(() => {

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];

  axios
    .get(`https://api.frankfurter.app/latest?from=INR&to=${currencies.join(',')}`)
    .then((response) => {
      console.log("API full response:", response);
      if (response.data && response.data.rates) {
        setRates(response.data.rates);
      } else {
        console.error("No rates in response", response);
      }
    })
    .catch(console.error);
}, []);

  if (!rates) {
    return <p>Loading exchange rates...</p>;
  }

return (
  <table style={tableStyles}>
    <thead>
      <tr><th>Currency</th><th>1 INR ≈</th></tr>
    </thead>
    <tbody>
      {Object.entries(rates).map(([currency, value]) => (
        <tr key={currency}>
           <td>{currencyToFlag(currency)} {currency}</td>
           <td>{rates[currency].toFixed(5)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
};

export default ForexRates;