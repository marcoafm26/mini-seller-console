import { useState } from 'react';
import {
  Navigate,
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { LeadsPage } from './pages/LeadsPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { getErrorRatePercentage, setErrorRate } from './utils/errorSimulation';

// Navigation Component
const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [errorRate, setErrorRateState] = useState(getErrorRatePercentage());

  const handleErrorRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setErrorRateState(value);
    setErrorRate(value / 100);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900">
                Mini Seller Console
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/leads"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`
                }
              >
                Leads
              </NavLink>
              <NavLink
                to="/opportunities"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`
                }
              >
                Opportunities
              </NavLink>
            </div>
          </div>

          {/* Desktop Error Rate Control */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <label htmlFor="error-rate" className="text-xs text-neutral-600">
                Error Rate:
              </label>
              <input
                id="error-rate"
                type="range"
                min="0"
                max="50"
                value={errorRate}
                onChange={handleErrorRateChange}
                className="w-16 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-neutral-600 min-w-[32px]">
                {errorRate}%
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/leads"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300'
                }`
              }
            >
              Leads
            </NavLink>
            <NavLink
              to="/opportunities"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300'
                }`
              }
            >
              Opportunities
            </NavLink>

            {/* Mobile Error Rate Control */}
            <div className="px-3 py-2 border-l-4 border-transparent">
              <div className="flex items-center justify-between">
                <label className="text-sm text-neutral-600">
                  API Error Rate: {errorRate}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={errorRate}
                  onChange={handleErrorRateChange}
                  className="w-20 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer ml-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
