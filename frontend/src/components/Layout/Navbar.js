import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, Database, FileJson } from 'lucide-react';

export const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? "bg-blue-700 shadow-inner" : "";

    return (
        <nav className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 text-white flex justify-between items-center shadow-lg sticky top-0 z-50">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                <div className="bg-white p-1 rounded text-blue-900"><Clock size={20} /></div>
                <span>TMS Portal</span>
            </div>
            <div className="flex gap-2">
                <Link to="/" className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all hover:bg-blue-700 ${isActive('/')}`}>
                    <Clock size={18} /> Entry Form
                </Link>
                <Link to="/viewer" className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all hover:bg-blue-700 ${isActive('/viewer')}`}>
                    <Database size={18} /> Data Viewer
                </Link>
                <Link to="/transform" className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all hover:bg-blue-700 ${isActive('/transform')}`}>
                    <FileJson size={18} /> JSON Tasks
                </Link>
            </div>
        </nav>
    );
};