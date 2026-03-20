/**
 * @file api.js
 * @description The Data Layer for Forex-Flow.
 * Handles all external API communications to fetch real-time exchange rates.
 */

/**
 * Fetches the latest exchange rates for a given base currency.
 * We are using the free 'https://api.frankfurter.app/latest' endpoint.
 *
 * HOW THIS WORKS:
 * 1. An asynchronous function is used so we can `await` the network request.
 * 2. We use native Vanilla JS `fetch()`—no external libraries needed!
 * 3. A robust `try/catch` block prevents the app from crashing if the network fails.
 * 4. We throw custom errors depending on the response status, which the UI can catch and display.
 *
 * @param {string} baseCurrency - The 3-letter currency code (e.g., 'USD', 'EUR').
 * @returns {Promise<Object>} A mapped object of exchange rates.
 */
export async function fetchExchangeRates(baseCurrency = 'USD') {
  try {
    // 1. Construct the URL dynamically based on the requested currency.
    const url = `https://api.frankfurter.app/latest?from=${baseCurrency}`;
    
    // 2. Perform the network request.
    const response = await fetch(url);
    
    // 3. Handle HTTP errors directly. `fetch` doesn't throw on HTTP error (like 404 or 500),
    //    so we must check `response.ok` manually to ensure a successful request.
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates. Status: ${response.status} ${response.statusText}`);
    }
    
    // 4. Parse the generated JSON payload.
    const data = await response.json();
    
    // 5. Return the rates payload directly for easy usage in our App component.
    // The API returns an object format: { amount, base, date, rates: { INR: 83.5, ... } }
    return data;
  } catch (error) {
    // 6. Catch any network or parsing errors here (e.g., user is offline, CORS issues).
    // We log it to console for developers, and throw a user-friendly error to handle in the UI.
    console.error("API Error in fetchExchangeRates:", error);
    throw new Error(error.message || "Failed to establish a secure connection to the currency exchange network.");
  }
}
