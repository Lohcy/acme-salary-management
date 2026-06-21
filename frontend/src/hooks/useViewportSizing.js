import { useState, useEffect } from 'react';

/**
 * Calculates the optimal number of grid rows based on the user's browser height.
 * * @param {number} rowHeight - Estimated height of a single table `<tr>` in pixels (e.g., 53px).
 * @param {number} offsetHeight - Pixels taken up by the header, filters, footer, and margins.
 * @returns {number} The optimal page limit, clamped between 5 and 100.
 */
export const useViewportSizing = (rowHeight = 53, offsetHeight = 350) => {
  const [limit, setLimit] = useState(10); // Safe default

  useEffect(() => {
    const calculateLimit = () => {
      // 1. Calculate available vertical space
      const availableHeight = window.innerHeight - offsetHeight;
      
      // 2. Divide by row height to see how many fit perfectly
      let calculatedLimit = Math.floor(availableHeight / rowHeight);
      
      // 3. Clamp the results (Min 5, Max 100 to respect our backend security)
      calculatedLimit = Math.max(5, Math.min(calculatedLimit, 100));
      
      setLimit(calculatedLimit);
    };

    // Calculate immediately on mount
    calculateLimit();

    // Debounce the resize listener to prevent CPU thrashing
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateLimit, 150); // Wait 150ms after dragging stops
    };

    window.addEventListener('resize', handleResize);
    
    // Standard cleanup to prevent memory leaks
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [rowHeight, offsetHeight]);

  return limit;
};