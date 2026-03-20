/**
 * @file CurrencyDropdown.jsx
 * @description Modular UI Component for rendering a semantic currency selector.
 */

import React from 'react';

/**
 * Reusable dropdown component.
 * 
 * HOW THIS WORKS:
 * - We receive an array of `currencies` to populate our `<option>` elements dynamically.
 * - This acts as a "Controlled Component", meaning its value (`selectedCurrency`) is
 *   driven entirely by the parent state (`App.jsx`).
 * - When a user selects a new currency, it triggers the callback `onChange`,
 *   which tells the parent to update its state.
 */
function CurrencyDropdown({ currencies, selectedCurrency, onChange, label, id }) {
  return (
    <div className="currency-dropdown-group">
      {/* Providing semantic association between label and input for accessibility */}
      <label htmlFor={id} className="currency-label">{label}</label>
      
      <div className="select-wrapper">
        <select
          id={id}
          className="currency-select"
          value={selectedCurrency}
          onChange={(e) => onChange(e.target.value)}
        >
          {currencies.map((currencyCode) => (
            <option key={currencyCode} value={currencyCode}>
              {currencyCode}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow for a modern UI feel */}
        <span className="select-arrow">&#9662;</span>
      </div>
    </div>
  );
}

export default CurrencyDropdown;
