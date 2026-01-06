import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '../services/api'; 
import { 
  FileSpreadsheet, FileText, ChevronLeft, 
  ChevronRight, Loader2, Calendar, User, Building2, FilterX 
} from 'lucide-react';

const DataViewer = () => {
  const nameOptions = ["John Doe", "Jane Smith", "Michael Brown", "Emma Wilson"];
  const companyOptions = ["Tech Solutions", "Global Corp", "Innovate LLC", "Soft Systems"];
  const today = new Date().toISOString().split('T')[0];

  // --- STATE ---
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Task 2: Filter States
  const [filters, setFilters] = useState({
    name: '',
    companyName: '',
    startDate: '', 
    endDate: '', 
  });

  // Task 2: Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0); // Added for accuracy
  const itemsPerPage = 10;

  // --- FETCH DATA (Integrated with your meta response) ---
  const loadFilteredRecords = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        name: filters.name,
        companyName: filters.companyName,
        startDate: filters.startDate,
        endDate: filters.endDate
      };

      const result = await api.getTimesheets(params);
      
      // 🔹 Analyzing the response based on your meta structure
      // Expected structure: { data: [], meta: { totalRecords, totalPages, currentPage } }
      const dataArray = result.data || (Array.isArray(result) ? result : []);
      const meta = result.meta || {};

      setRecords(dataArray);

      // 🔹 Use backend meta if available, otherwise calculate manually
      const total = meta.totalRecords || result.totalCount || result.total || dataArray.length;
      const pages = meta.totalPages || Math.ceil(total / itemsPerPage) || 1;

      setTotalPages(pages);
      setTotalRecords(total);

      // Sync page if backend returns a different current page
      if (meta.currentPage && meta.currentPage !== currentPage) {
        setCurrentPage(meta.currentPage);
      }
    } catch (err) {
      toast.error("Error fetching filtered data");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    loadFilteredRecords();
  }, [loadFilteredRecords]);

  // --- EXPORT FUNCTIONALITY ---
  const handleExport = (format) => {
    if (records.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const dataToExport = records.map((r, index) => ({
      "No": index + 1,
      "Employee": r.name,
      "Company": r.companyName,
      "Punch In": r.punchIn,
      "Punch Out": r.punchOut,
      "Total Hours": r.totalHours,
      "Date": new Date(r.date).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet");

    if (format === 'excel') {
      XLSX.writeFile(workbook, `Timesheet_Report_${today}.xlsx`);
    } else {
      XLSX.writeFile(workbook, `Timesheet_Report_${today}.csv`, { bookType: 'csv' });
    }
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  const onFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setCurrentPage(1); 
  };

  const clearFilters = () => {
    setFilters({ name: '', companyName: '', startDate: '', endDate: '' });
    setCurrentPage(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-right" />

      {/* 🔹 FILTERS SECTION */}
      <div className="card p-6 bg-white shadow-sm border-t-4 border-indigo-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-800 text-lg">Data Filters</h2>
          <button 
            onClick={clearFilters}
            className="text-xs text-indigo-600 flex items-center gap-1 hover:underline"
          >
            <FilterX size={14} /> Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
            <select name="name" className="input-field" value={filters.name} onChange={onFilterChange}>
              <option value="">All Employees</option>
              {nameOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Company</label>
            <select name="companyName" className="input-field" value={filters.companyName} onChange={onFilterChange}>
              <option value="">All Companies</option>
              {companyOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
            <input 
              type="date" name="startDate" max={today} 
              className="input-field" value={filters.startDate} onChange={onFilterChange} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">End Date</label>
            <input 
              type="date" name="endDate" max={today} 
              className="input-field" value={filters.endDate} onChange={onFilterChange} 
            />
          </div>
        </div>
      </div>

      {/* 🔹 EXPORT BUTTONS */}
      <div className="flex justify-end gap-3">
        <button onClick={() => handleExport('csv')} className="btn-secondary text-sm">
          <FileText size={16} /> Export CSV
        </button>
        <button onClick={() => handleExport('excel')} className="btn-primary text-sm">
          <FileSpreadsheet size={16} /> Export Excel
        </button>
      </div>

      {/* 🔹 DATA GRID */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b">
              <tr className="text-xs font-bold text-slate-500 uppercase">
                <th className="p-4">Employee</th>
                <th className="p-4">Company</th>
                <th className="p-4">In</th>
                <th className="p-4">Out</th>
                <th className="p-4">Total Hours</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-indigo-500 mb-2" />
                    <span className="text-slate-400">Loading Data...</span>
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-700 flex items-center gap-2">
                      <User size={14} className="text-slate-300"/> {row.name}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-slate-300"/> {row.companyName}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-xs">{row.punchIn}</td>
                    <td className="p-4 text-slate-600 font-mono text-xs">{row.punchOut}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.totalHours >= 5 && row.totalHours <= 8 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {row.totalHours} hrs
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-300"/> {new Date(row.date).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center text-slate-400">No records match the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 IMPROVED PAGINATION FOOTER */}
        <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
          <div className="text-xs text-slate-500">
            Showing <span className="font-bold">{records.length}</span> of <span className="font-bold">{totalRecords}</span> records 
            <span className="ml-2 px-2 py-0.5 bg-slate-200 rounded text-[10px] uppercase font-bold">Page {currentPage} of {totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 border rounded bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 border rounded bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataViewer;