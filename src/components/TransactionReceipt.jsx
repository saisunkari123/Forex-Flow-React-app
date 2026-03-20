/**
 * @file TransactionReceipt.jsx
 * @description Renders a stylized output module displaying the converted final amount.
 */

import React from 'react';

/**
 * Functional component displaying the final calculation.
 *
 * HOW THIS WORKS:
 * - We receive final computed values via React Props.
 * - Props are read-only (`amount`, `base`, `target`, and `converted`).
 * - We apply standard browser APIs (`Intl.NumberFormat`) to format the numbers
 *   beautifully, separating commas natively. This ensures our app handles numbers securely.
 */
function TransactionReceipt({ amount, baseCurrency, targetCurrency, convertedAmount }) {
  // Edge Case: If no converted amount exists, it means we are loading, or something broke.
  if (convertedAmount === null || convertedAmount === undefined) {
    return <div className="receipt-container placeholder">Enter an amount to calculate.</div>;
  }

  // Format inputs securely into a beautiful user-friendly format (e.g., 1,000.00)
  const formatValue = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="receipt-container">
      <div className="receipt-details">
        {/* Source side */}
        <span className="source-amount">
          {formatValue(amount)} {baseCurrency}
        </span>
        
        {/* Separator / Equal sign */}
        <span className="equals-sign">=</span>
        
        {/* Destination side */}
        <span className="converted-amount">
          {formatValue(convertedAmount)} {targetCurrency}
        </span>
      </div>
      
      {/* Decorative FinTech footer for the receipt */}
      <div className="receipt-footer">
        Based on live mid-market, real-time rates.
      </div>
    </div>
  );
}

export default TransactionReceipt;
