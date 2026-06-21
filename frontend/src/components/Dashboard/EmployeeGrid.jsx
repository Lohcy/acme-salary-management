import { useState, useEffect } from 'react';
import { fetchEmployees } from '../../services/api';
import { useViewportSizing } from '../../hooks/useViewportSizing';

const EmployeeGrid = () => {
  // 1. Let the viewport dictate the limit
  const dynamicLimit = useViewportSizing(53, 380);

 // 2. NEW: Let the user override the limit. Defaults to 'auto'.
  const [userLimit, setUserLimit] = useState('auto');

  // 3. Determine the actual limit to send to the API
  const activeLimit = userLimit === 'auto' ? dynamicLimit : userLimit;

  // Data State
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });

  // Filter State (Local UI state vs Active Query state)
  const [filterInput, setFilterInput] = useState({ country: '', department: '' });
  const [activeFilters, setActiveFilters] = useState({ country: '', department: '' });

  useEffect(() => {
    let isMounted = true;

    const loadEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Pass page, limit, and active filters to our API service
        const response = await fetchEmployees({
          page: meta.page,
          limit: activeLimit,
          ...activeFilters
        });

        if (response?.data && response?.meta) {
          if (isMounted) {
            setEmployees(response.data);
            setMeta(response.meta);
          }
        } else {
          throw new Error('Malformed pagination payload received.');
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load employee data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadEmployees();

    return () => {
      isMounted = false;
    };
  }, [meta.page, activeLimit, activeFilters]); // Re-fetch only when these exact values change

  // Handlers
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Reset to page 1 when applying new filters to avoid empty data states
    setMeta((prev) => ({ ...prev, page: 1 }));
    setActiveFilters(filterInput);
  };

  const clearFilters = () => {
    setFilterInput({ country: '', department: '' });
    setActiveFilters({ country: '', department: '' });
    setMeta((prev) => ({ ...prev, page: 1 }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-8">
      {/* Filter Header */}
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              placeholder="e.g. Engineering"
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
              value={filterInput.department}
              onChange={(e) => setFilterInput({ ...filterInput, department: e.target.value })}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              placeholder="e.g. USA"
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
              value={filterInput.country}
              onChange={(e) => setFilterInput({ ...filterInput, country: e.target.value })}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full md:w-auto font-medium">
              Filter
            </button>
            <button type="button" onClick={clearFilters} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition w-full md:w-auto font-medium">
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 animate-pulse">
                  Loading directory...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No employees found matching those filters.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.first_name} {emp.last_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.job_title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">{formatCurrency(emp.salary)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{meta.page}</span> of <span className="font-medium">{meta.totalPages}</span> 
              {' '}(Total Records: {meta.total})
            </p>
          </div>
          <div className="flex items-center gap-4">
            
            {/* THE HYBRID DYNAMIC DROPDOWN */}
            <select
              value={userLimit}
              onChange={(e) => {
                const val = e.target.value;
                setUserLimit(val === 'auto' ? 'auto' : Number(val));
                setMeta((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on resize
              }}
              className="border border-gray-300 text-gray-700 rounded-md text-sm py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm font-medium cursor-pointer"
            >
              <option value="auto">Auto-Fit ({dynamicLimit})</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>

            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setMeta((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={meta.page === 1 || loading}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setMeta((prev) => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                disabled={meta.page === meta.totalPages || loading || meta.totalPages === 0}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeGrid;