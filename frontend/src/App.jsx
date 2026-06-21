import AnalyticsDashboard from './components/Dashboard/AnalyticsDashboard';
import EmployeeGrid from './components/Dashboard/EmployeeGrid';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">ACME Salary Management</h1>
          <p className="text-gray-500 mt-2">Organization Payroll Overview</p>
        </header>

        <main>
          <AnalyticsDashboard />
          <EmployeeGrid /> {/* <-- Add the component here */}
        </main>

      </div>
    </div>
  );
}

export default App;