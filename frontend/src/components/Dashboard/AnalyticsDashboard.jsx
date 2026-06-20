import { useState, useEffect } from 'react';
import { fetchAnalytics } from '../../services/api';

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Standard Protocol: Mount tracking to prevent memory leaks
    let isMounted = true;

    const loadMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchAnalytics();
        
        // 2. Defensive Validation: Ensure the payload structure is exactly as expected
        if (response?.success && response?.data) {
          if (isMounted) setData(response.data);
        } else {
          throw new Error('Malformed data payload received from server.');
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load dashboard metrics.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMetrics();

    // Cleanup function runs if the component unmounts before the fetch resolves
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Standard Protocol: Native Localization for robust currency/number formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  // 4. State Rendering: Explicit handling of loading, error, and empty states
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gray-50 rounded-lg animate-pulse">
        <p className="text-gray-500 font-medium">Loading organization metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-semibold">Dashboard Error</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
      {/* Metric Card 1: Total Employees */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Headcount</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {formatNumber(data.totalEmployees)}
        </p>
      </div>

      {/* Metric Card 2: Total Payroll */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Annual Payroll</h3>
        <p className="mt-2 text-3xl font-bold text-green-600">
          {formatCurrency(data.totalPayroll)}
        </p>
      </div>

      {/* Metric Card 3: Average Salary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Average Salary</h3>
        <p className="mt-2 text-3xl font-bold text-blue-600">
          {formatCurrency(data.averageSalary)}
        </p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;