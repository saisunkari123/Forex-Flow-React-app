/**
 * @file App.jsx
 * @description The Main Engine and Application State Container.
 * Orchestrates API calls, state management, and the overall UI composition.
 */

import React, { useState, useEffect } from 'react';
import { fetchExchangeRates } from './api';
import CurrencyDropdown from './components/CurrencyDropdown';
import TransactionReceipt from './components/TransactionReceipt';
import './styles.css';

/**
 * The root component of the Forex-Flow web app.
 *
 * STATE MANAGEMENT:
 * We rely heavily on React's `useState` hook.
 *
 * - `amount`: Keeps track of the numeric value typed by the user.
 * - `baseCurrency`: The currency we are converting FROM. Default 'USD'.
 * - `targetCurrency`: The currency we are converting TO. Default 'INR'.
 * - `exchangeRates`: Acts as our internal "cache". It holds the object of rates fetched for `baseCurrency`.
 * - `isLoading`: Boolean to track if an active API call is happening.
 * - `error`: Stores string messages if our Data Layer (`api.js`) throws an exception.
 */
function App() {
  // 1. Initialize State Variables
  const [amount, setAmount] = useState(1000); // Start with a default nice number
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('INR');
  
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * USE_EFFECT:
   * This hook listens solely to the `baseCurrency` variable. Whenever the `baseCurrency`
   * changes (e.g., user selects 'EUR' instead of 'USD'), this effect automatically runs.
   *
   * It handles calling our API layer safely.
   */
  useEffect(() => {
    // Defines an async block to wrap our fetch logic inside the synchronous useEffect.
    const loadRates = async () => {
      setIsLoading(true); // Signal to the UI that a network request started
      setError(null);     // Reset errors to build trust

      try {
        // Await the custom API function we built in `api.js`
        const data = await fetchExchangeRates(baseCurrency);
        
        // Populate the `exchangeRates` state with the specific rates object returned by Frankfurter
        setExchangeRates(data.rates);
        
      } catch (err) {
        // If the fetch failed, store exactly what the error was so we can render it to the User
        setError(err.message);
      } finally {
        // Regardless of success or failure, turn off the loading indicator
        setIsLoading(false);
      }
    };

    loadRates();
  }, [baseCurrency]); // The Dependency Array: re-runs *only* if `baseCurrency` changes.

  // 2. Computed Values
  // Extract all available currencies dynamically from our rates object
  const currencies = Object.keys(exchangeRates);
  // Ensure the base currency is also in the list if it's missing from its own rates list
  if (!currencies.includes(baseCurrency) && currencies.length > 0) {
    currencies.push(baseCurrency);
    currencies.sort(); // Keep alphabetical order
  }

  // Calculate the converted amount securely based on state updates.
  // If the user hasn't typed an amount yet, or rates aren't initialized, we assign null.
  let convertedAmount = null;
  if (exchangeRates[targetCurrency]) {
    convertedAmount = amount * exchangeRates[targetCurrency];
  } else if (baseCurrency === targetCurrency) {
    // Converting USD to USD should mathematically just equal the amount
    convertedAmount = amount;
  }

  // 3. User Interaction Handlers
  const handleAmountChange = (e) => {
    const val = e.target.value;
    // We strictly use Number casting. If it's invalid, it becomes 0.
    // Also ensuring no negative transaction amounts.
    if (val === '' || val === null) {
      setAmount(''); // Allow clearing the input temporarily
      return;
    }
    const num = Number(val);
    if (!isNaN(num) && num >= 0) {
      setAmount(num);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <main className="dashboard">
        <header className="dashboard-header">
          <h1>Forex-Flow</h1>
          <p>Real-Time Currency Routing Interface</p>
        </header>

        {/* Global Error Boundaries */}
        {error && (
          <div className="error-banner">
            <strong>Connection Failed:</strong> {error}
          </div>
        )}

        <div className="dashboard-grid">
          {/* Input Panel */}
          <section className="input-panel">
            <div className="form-group">
              <label htmlFor="amount-input" className="currency-label">Send Amount</label>
              <input
                id="amount-input"
                type="number"
                min="0"
                value={amount}
                onChange={handleAmountChange}
                className="amount-input"
                placeholder="1,000"
              />
            </div>

            <div className="dropdowns-row">
              <CurrencyDropdown
                label="Source Currency"
                id="base-currency"
                currencies={currencies}
                selectedCurrency={baseCurrency}
                onChange={setBaseCurrency}
              />
              
              <div className="swap-icon-container">
                <span className="swap-icon" title="Swap currencies">&#8644;</span>
              </div>

              <CurrencyDropdown
                label="Destination Currency"
                id="target-currency"
                currencies={currencies}
                selectedCurrency={targetCurrency}
                onChange={setTargetCurrency}
              />
            </div>
          </section>

          {/* Output Panel */}
          <section className="output-panel">
            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <h2>Fetching live rates...</h2>
                <p>Securing end-to-end encryption with the market</p>
              </div>
            ) : (
              <TransactionReceipt
                amount={amount || 0}
                baseCurrency={baseCurrency}
                targetCurrency={targetCurrency}
                convertedAmount={convertedAmount}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
