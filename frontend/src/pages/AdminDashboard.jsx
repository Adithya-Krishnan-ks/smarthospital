import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, BarChart, Users, Stethoscope, LogOut, ChevronDown, ChevronUp, Clock, Activity, Hash } from 'lucide-react';
import Layout from '../components/Layout';
import API_BASE_URL from '../config';
import Toast from '../components/Toast';

function AdminDashboard() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', department: '', avg_consult_time: 15, email: '', password: '' });
    const [stats, setStats] = useState({ doctors: 0, patients: 0 });
    const [liveQueues, setLiveQueues] = useState([]);
    const [selectedDoctorQueue, setSelectedDoctorQueue] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
            navigate('/login/admin');
        } else {
            fetchStats();
            fetchLiveQueues();
            const interval = setInterval(() => {
                fetchStats();
                fetchLiveQueues();
            }, 5000); // Poll every 5s
            return () => clearInterval(interval);
        }
    }, [navigate]);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/stats`);
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const fetchLiveQueues = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/live-queues`);
            setLiveQueues(res.data);
        } catch (err) {
            console.error('Error fetching live queues:', err);
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/addDoctor`, form);
            setToast({ type: 'success', message: 'Doctor Added Successfully' });
            setForm({ name: '', department: '', avg_consult_time: 15, email: '', password: '' });
            fetchStats(); // Refresh stats
            fetchLiveQueues(); // Refresh queue list
        } catch (err) {
            console.error(err);
            setToast({ type: 'error', message: 'Error: ' + (err.response?.data?.error || err.message) });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('role');
        navigate('/login/admin');
    };

    return (
        <Layout actions={
            <button onClick={handleLogout} className="text-red-500 hover:text-red-600 font-semibold text-sm flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                <LogOut size={16} /> Logout
            </button>
        }>
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
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Doctor Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    required
                                    placeholder="doctor@hospital.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Login Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-0.5 mt-2 cursor-pointer">
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
                                <div className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{stats.doctors}</div>
                                <div className="text-xs uppercase tracking-wider font-semibold text-gray-400 text-center">Active Doctors</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-slate-700">
                                <div className="mb-2 p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                                    <Users size={24} />
                                </div>
                                <div className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{stats.patients}</div>
                                <div className="text-xs uppercase tracking-wider font-semibold text-gray-400 text-center">Total Patients</div>
                            </div>
                        </div>
                        
                    </div>
                </div>

                {/* Live Queue Monitoring Section */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 relative overflow-hidden mt-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-600 dark:text-blue-400">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Activity size={24} />
                        </div>
                        Live Clinics & Queues Status
                    </h2>

                    {liveQueues.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                            All clinics are currently clear. No active waiting queues.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="relative">
                                <select 
                                    value={selectedDoctorQueue} 
                                    onChange={(e) => setSelectedDoctorQueue(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer appearance-none pr-10"
                                >
                                    <option value="">-- Select a Clinic to Monitor Live Queue --</option>
                                    {liveQueues.map(item => (
                                        <option key={item.doctor_id} value={item.doctor_id}>
                                             {item.name} ({item.department}) - {item.patients.length} Waiting
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">▼</div>
                            </div>

                            {selectedDoctorQueue && (() => {
                                const item = liveQueues.find(q => q.doctor_id === selectedDoctorQueue);
                                if (!item) return null;
                                return (
                                    <div className="border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden transition-all shadow-md bg-white dark:bg-slate-800 animate-slide-in">
                                        <div className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-slate-900/20 border-b border-gray-100 dark:border-slate-700">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                                                    <Stethoscope size={22} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white"> {item.name}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.department}</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                                {item.patients.length} Waiting
                                            </span>
                                        </div>

                                        <div className="p-5 space-y-3 bg-white dark:bg-slate-800">
                                            {item.patients.map((p) => (
                                                <div 
                                                    key={p.queue_id} 
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-900/30 border border-gray-100 dark:border-slate-700/60 rounded-xl gap-3"
                                                >
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 w-9 h-9 rounded-lg flex items-center justify-center text-sm">
                                                            #{p.token_number}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                                                {p.name}
                                                                <span className="text-xs font-mono text-gray-400 dark:text-gray-500 font-normal">
                                                                    (Code: {p.patient_code})
                                                                </span>
                                                            </h4>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 font-medium mt-0.5">
                                                                <Hash size={10} /> ID: {p.patient_id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 self-end sm:self-center">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <Clock size={12} /> Est: {new Date(p.estimated_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                                            p.priority === 'Emergency' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                                                            p.priority === 'Senior' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400' : 
                                                            'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400'
                                                        }`}>
                                                            {p.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>
            </div>
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </Layout>
    );
}

export default AdminDashboard;
