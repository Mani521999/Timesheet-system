import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import toast, { Toaster } from 'react-hot-toast';
import { timesheetApi } from '../services/timesheetService';
import {
    Download, Upload, Edit2, X, Check,
    Trash2, PlusCircle, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';

const TimesheetEntry = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editRowData, setEditRowData] = useState({});

    // 🔹 Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(5);

    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        date: new Date().toISOString().split('T')[0],
        punchIn: '09:00',
        punchOut: '17:00',
        totalHours: 8
    });

    const nameOptions = ["John Doe", "Jane Smith", "Michael Brown", "Emma Wilson"];
    const companyOptions = ["Tech Solutions", "Global Corp", "Innovate LLC", "Soft Systems"];

    // 🔹 Load data whenever the current page changes
    useEffect(() => {
        loadData();
    }, [currentPage]);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await timesheetApi.getTimesheets({ page: currentPage, limit });

            const fetchedData = res.data || [];
            const meta = res.meta || {};

            setEntries(fetchedData);

            setTotalPages(meta.totalPages || 1);

            if (meta.currentPage && meta.currentPage !== currentPage) {
                setCurrentPage(meta.currentPage);
            }

        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error("Failed to load records from server");
            setEntries([]);
        } finally {
            setLoading(false);
        }
    };
    const downloadSampleFile = () => {
        const sampleData = [
            {
                "name": "John Doe",
                "companyName": "Tech Solutions",
                "date": "2026-05-20",
                "punchIn": "09:00",
                "punchOut": "17:00",
                "totalHours": "8"
            },
            {
                "name": "Jane Smith",
                "companyName": "Global Corp",
                "date": "2026-05-21",
                "punchIn": "08:30",
                "punchOut": "15:30",
                "totalHours": "7"
            }
        ];
        const worksheet = XLSX.utils.json_to_sheet(sampleData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
        const wscols = [{ wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 12 }];
        worksheet['!cols'] = wscols;
        XLSX.writeFile(workbook, "Timesheet_Import_Sample.xlsx");
        toast.success("Sample template downloaded!");
    };

    const calculateTotalHours = (inTime, outTime) => {
        if (!inTime || !outTime) return 0;
        const [inH, inM] = inTime.split(':').map(Number);
        const [outH, outM] = outTime.split(':').map(Number);
        const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
        return parseFloat((totalMinutes / 60).toFixed(2));
    };

    const handleAddRecord = async (e) => {
        e.preventDefault();
        const hours = calculateTotalHours(formData.punchIn, formData.punchOut);
        if (hours < 5 || hours > 8) {
            toast.error(`Invalid Hours (${hours}h). Must be between 5-8.`);
            return;
        }
        try {
            const newRec = await timesheetApi.createTimesheet({ ...formData, totalHours: hours });
            // If on first page, show the new record, otherwise refresh to update page counts
            if (currentPage === 1) {
                setEntries(prev => [newRec.data || newRec, ...prev.slice(0, limit - 1)]);
            } else {
                setCurrentPage(1);
            }
            toast.success("Record Added");
        } catch (err) {
            toast.error("Save failed");
        }
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3 p-1">
                <div className="flex items-center gap-2">
                    <div className="bg-red-100 p-2 rounded-full text-red-600"><Trash2 size={18} /></div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">Confirm Delete?</p>
                        <p className="text-xs text-slate-500">This will remove the record from DB.</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded">Cancel</button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const tid = toast.loading("Deleting...");
                            try {
                                await timesheetApi.deleteTimesheet(id);
                                loadData(); // Refresh to maintain correct page limit
                                toast.success("Deleted", { id: tid });
                            } catch { toast.error("Error", { id: tid }); }
                        }}
                        className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded shadow-sm"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        ), { duration: 4000, position: 'top-center' });
    };

    const saveInlineEdit = async () => {
        if (editRowData.totalHours < 5 || editRowData.totalHours > 8) {
            toast.error("Hours must be 5-8");
            return;
        }
        try {
            const updated = await timesheetApi.updateTimesheet(editingId, editRowData);
            setEntries(entries.map(r => r._id === editingId ? (updated.data || updated) : r));
            setEditingId(null);
            toast.success("Updated");
        } catch (err) { toast.error("Update failed"); }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Timesheet Entry</h1>
                    <p className="text-slate-500 text-sm italic">Daily punch logs and bulk imports</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={downloadSampleFile} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium shadow-sm">
                        <Download size={16} /> Sample Template
                    </button>

                    <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium shadow-md shadow-indigo-100 cursor-pointer">
                        <Upload size={16} /> Import Records
                        <input type="file" hidden accept=".xlsx, .xls" onChange={(e) => {
                            toast.promise(timesheetApi.importTimesheets(e.target.files[0]), {
                                loading: 'Uploading...',
                                success: () => { setCurrentPage(1); loadData(); return 'Import Success!'; },
                                error: 'Import Failed'
                            });
                        }} />
                    </label>
                </div>
            </div>

            {/* Form */}
            <div className="card p-6 bg-white border-t-4 border-indigo-600">
                <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Employee</label>
                        <select className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required>
                            <option value="">Select Name</option>
                            {nameOptions.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Company</label>
                        <select className="input-field" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} required>
                            <option value="">Select Company</option>
                            {companyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                        <input type="date" className="input-field" max={new Date().toISOString().split('T')[0]} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Punch In</label>
                        <input type="time" className="input-field" value={formData.punchIn} onChange={e => setFormData({ ...formData, punchIn: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Punch Out</label>
                        <input type="time" className="input-field" value={formData.punchOut} onChange={e => setFormData({ ...formData, punchOut: e.target.value })} />
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center h-[42px]"><PlusCircle size={20} /> Add</button>
                </form>
            </div>

            {/* Grid */}
            <div className="card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-xs font-bold text-slate-500 uppercase">
                            <th className="p-4">Employee</th>
                            <th className="p-4">Company</th>
                            <th className="p-4">In</th>
                            <th className="p-4">Out</th>
                            <th className="p-4">Total Hours</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr><td colSpan="7" className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" /></td></tr>
                        ) : entries.map((row) => (
                            <tr key={row._id} className="hover:bg-slate-50 transition-colors">
                                {editingId === row._id ? (
                                    <>
                                        <td className="p-2"><input className="input-field py-1" value={editRowData.name} onChange={e => setEditRowData({ ...editRowData, name: e.target.value })} /></td>
                                        <td className="p-2"><input className="input-field py-1" value={editRowData.companyName} onChange={e => setEditRowData({ ...editRowData, companyName: e.target.value })} /></td>
                                        <td className="p-2"><input type="time" className="input-field py-1" value={editRowData.punchIn} onChange={e => {
                                            const upd = { ...editRowData, punchIn: e.target.value };
                                            upd.totalHours = calculateTotalHours(upd.punchIn, upd.punchOut);
                                            setEditRowData(upd);
                                        }} /></td>
                                        <td className="p-2"><input type="time" className="input-field py-1" value={editRowData.punchOut} onChange={e => {
                                            const upd = { ...editRowData, punchOut: e.target.value };
                                            upd.totalHours = calculateTotalHours(upd.punchIn, upd.punchOut);
                                            setEditRowData(upd);
                                        }} /></td>
                                        <td className="p-2 font-bold text-indigo-600">{editRowData.totalHours}h</td>
                                        <td className="p-2"><input type="date" className="input-field py-1" value={editRowData.date?.split('T')[0]} onChange={e => setEditRowData({ ...editRowData, date: e.target.value })} /></td>
                                        <td className="p-4 text-center flex justify-center gap-2">
                                            <button onClick={saveInlineEdit} className="text-green-600"><Check size={20} /></button>
                                            <button onClick={() => setEditingId(null)} className="text-slate-400"><X size={20} /></button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-4 font-medium text-slate-700">{row.name}</td>
                                        <td className="p-4 text-slate-600">{row.companyName}</td>
                                        <td className="p-4 font-mono text-slate-500">{row.punchIn}</td>
                                        <td className="p-4 font-mono text-slate-500">{row.punchOut}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${row.totalHours >= 5 && row.totalHours <= 8 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {row.totalHours} hrs
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">{new Date(row.date).toLocaleDateString()}</td>
                                        <td className="p-4 text-center space-x-3">
                                            <button onClick={() => { setEditingId(row._id); setEditRowData(row); }} className="text-indigo-400 hover:text-indigo-600 transition-colors"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(row._id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* 🔹 Pagination Controls */}
                <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
                    <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1 || loading}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-2 border rounded bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            disabled={currentPage === totalPages || loading}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 border rounded bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimesheetEntry;