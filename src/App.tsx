import {
  Navigate,
  NavLink,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { LeadsPage } from './pages/LeadsPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';

// Navigation Component
const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-neutral-900">
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
