import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, BarChart, Users, Stethoscope } from 'lucide-react';
import Layout from '../components/Layout';

function AdminDashboard() {
    const [form, setForm] = useState({ name: '', department: '', avg_consult_time: 15 });
    const [stats, setStats] = useState({ doctors: 0, patients: 0 });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/addDoctor', form);
            alert('Doctor Added Successfully');
            setForm({ name: '', department: '', avg_consult_time: 15 });
            fetchStats(); // Refresh stats
        } catch (err) {
            console.error(err);
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">System Overview & Management</p>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Add Doctor Card */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-purple-600 dark:text-purple-400">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <UserPlus size={24} />
                            </div>
                            Onboard Doctor
                        </h2>

                        <form onSubmit={handleAddDoctor} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Doctor Name</label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                    placeholder="e.g. Dr. Sarah Smith"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Department</label>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                        value={form.department}
                                        onChange={e => setForm({ ...form, department: e.target.value })}
                                        required
                                        placeholder="Cardiology"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Avg Time (min)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                        value={form.avg_consult_time}
                                        onChange={e => setForm({ ...form, avg_consult_time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-0.5 mt-2">
                                Add to System
                            </button>
                        </form>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                <BarChart size={24} />
                            </div>
                            System Analytics
                        </h2>

                        <div className="grid grid-cols-2 gap-4 flex-1">
                            <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-slate-700">
                                <div className="mb-2 p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                                    <Stethoscope size={24} />
                                </div>
                                <div className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{stats.patients}</div>
                                <div className="text-xs uppercase tracking-wider font-semibold text-gray-400">Active Doctors</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-slate-700">
                                <div className="mb-2 p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                                    <Users size={24} />
                                </div>
                                <div className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{stats.doctors}</div>
                                <div className="text-xs uppercase tracking-wider font-semibold text-gray-400">Total Patients</div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-400 mt-6 bg-gray-50 dark:bg-slate-900 py-2 rounded-lg">
                            Live data integration coming soon
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default AdminDashboard;
