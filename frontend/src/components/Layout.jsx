
import React, { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, Home, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Layout({ children, actions }) {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-inter">
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-lg">
                                H
                            </div>
                            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Smart Hospital
                            </span>
                        </Link>

                        <div className="flex items-center gap-3">
                            {location.pathname !== '/' && (
                                <>
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-all text-gray-500 dark:text-gray-400"
                                        title="Go Back"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <Link
                                        to="/"
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-all text-gray-500 dark:text-gray-400"
                                        title="Go Home"
                                    >
                                        <Home size={20} />
                                    </Link>
                                    <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>
                                </>
                            )}
                            {actions}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all text-gray-600 dark:text-gray-300"
                            >
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {children}
            </main>
        </div>
    );
}
