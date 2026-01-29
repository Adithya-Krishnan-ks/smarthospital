import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { Shield, Lock, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/login/admin', { password });
            if (res.data.success) {
                // In a real app, use Context or Redux. For simplicity:
                localStorage.setItem('role', 'admin');
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login Failed');
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Access</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                        >
                            Sign In <ArrowRight size={20} />
                        </button>

                        <div className="text-center mt-4">
                            <a href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                                Forgot Password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
