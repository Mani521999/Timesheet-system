import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import TimesheetEntry from './pages/TimesheetEntry';
import DataViewer from './pages/DataViewer';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, Clock } from 'lucide-react'; // Ensure lucide-react is installed
function App() {
  return (
    <Router>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Clock className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">
                Timesheet<span className="text-indigo-600">Pro</span>
              </span>
            </div>

            <div className="flex gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <LayoutDashboard size={18} />
                <span>Entry Form</span>
              </NavLink>

              <NavLink
                to="/viewer"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Database size={18} />
                <span>Data Viewer</span>
              </NavLink>
            </div>


          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<TimesheetEntry />} />
        <Route path="/viewer" element={<DataViewer />} />
      </Routes>
    </Router>



  );
}
export default App;