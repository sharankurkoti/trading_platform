// src/utils/currencyFlags.js

const currencyToFlag = (currencyCode) => {
  const flags = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    INR: '🇮🇳',
    GBP: '🇬🇧',
    JPY: '🇯🇵',
    AUD: '🇦🇺',
    CAD: '🇨🇦',
    CHF: '🇨🇭',
    CNY: '🇨🇳',
    // add more as needed
  };

  return flags[currencyCode.toUpperCase()] || '🏳️';
};

export default currencyToFlag;
