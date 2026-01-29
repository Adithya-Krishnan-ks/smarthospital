
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, Users, Clock, LogOut, ChevronRight, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout';

const API_URL = 'http://localhost:5000/api';

function DoctorDashboard() {
    const [doctorId, setDoctorId] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [queue, setQueue] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Fetch doctors for "Login"
        axios.get(`${API_URL}/doctors`).then(res => setDoctors(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (isLoggedIn && doctorId) {
            fetchQueue();
            const interval = setInterval(fetchQueue, 5000); // Poll every 5s
            return () => clearInterval(interval);
        }
    }, [isLoggedIn, doctorId]);

    const fetchQueue = async () => {
        try {
            const res = await axios.get(`${API_URL}/queue/${doctorId}`);
            setQueue(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleNextPatient = async () => {
        try {
            await axios.post(`${API_URL}/nextPatient/${doctorId}`);
            fetchQueue();
            alert('Called next patient!');
        } catch (err) {
            alert('Error: ' + err.response?.data?.message || err.message);
        }
    };

    if (!isLoggedIn) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
                        <h2 className="text-3xl font-bold mb-8 text-teal-600 dark:text-teal-400 text-center">Doctor Access</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Profile</label>
                                <select
                                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl p-3 text-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
                                    value={doctorId}
                                    onChange={e => setDoctorId(e.target.value)}
                                >
                                    <option value="">-- Choose Profile --</option>
                                    {doctors.map(d => <option key={d.doctor_id} value={d.doctor_id}>{d.name} ({d.department})</option>)}
                                </select>
                            </div>
                            <button
                                onClick={() => doctorId && setIsLoggedIn(true)}
                                className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-500/30 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!doctorId}
                            >
                                Open Clinic
                            </button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    const currentDoctor = doctors.find(d => d.doctor_id === doctorId);

    return (
        <Layout actions={
            <button onClick={() => setIsLoggedIn(false)} className="text-red-500 hover:text-red-600 font-semibold text-sm flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors">
                <LogOut size={16} /> Logout
            </button>
        }>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dr. {currentDoctor?.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{currentDoctor?.department}</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Control Panel */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Action Card */}
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-teal-500/20 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                            <h2 className="text-2xl font-bold opacity-90">Queue Control</h2>

                            <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-sm opacity-80 mb-2 uppercase tracking-wider font-semibold">Up Next</div>
                                {queue.length > 0 ? (
                                    <div className="flex items-center justify-between text-left">
                                        <div>
                                            <div className="text-3xl font-bold">#{queue[0].token_number}</div>
                                            <div className="font-medium opacity-90">{queue[0].patient_name}</div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-white/20 backdrop-blur-md`}>
                                            {queue[0].priority}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xl font-medium opacity-70 italic">No patients waiting</div>
                                )}
                            </div>

                            <button
                                onClick={handleNextPatient}
                                disabled={queue.length === 0}
                                className="w-full bg-white text-teal-700 py-4 rounded-xl text-xl font-bold shadow-lg hover:bg-gray-50 transition transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                <UserCheck size={24} /> Call Next Patient
                            </button>

                            <p className="text-white/60 text-xs flex items-center gap-1">
                                <AlertTriangle size={12} /> Auto-prioritizes Emergency cases
                            </p>
                        </div>
                    </div>

                    {/* Queue List */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-700">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                            <Users className="text-teal-500" /> Waiting List
                            <span className="text-sm text-gray-400 font-normal ml-2">({queue.length})</span>
                        </h3>

                        {queue.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                                All caught up! No patients in queue.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {queue.map((q, idx) => (
                                    <div key={q.queue_id} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${idx === 0 ? 'bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50' : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 border border-transparent'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="font-bold text-lg text-teal-700 dark:text-teal-400 w-12">#{q.token_number}</div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-white">{q.patient_name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <Clock size={10} /> Est: {new Date(q.estimated_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${q.priority === 'Emergency' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                                                q.priority === 'Senior' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400'
                                            }`}>
                                            {q.priority}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats / Side Panel */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Quick Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl text-center">
                                <div className="text-2xl font-black text-teal-600 dark:text-teal-400">{queue.length}</div>
                                <div className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase opacity-70">Waiting</div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl text-center">
                                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                                    {queue.reduce((acc, curr) => curr.priority === 'Emergency' ? acc + 1 : acc, 0)}
                                </div>
                                <div className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase opacity-70">Emergency</div>
                            </div>
                        </div>
                        <div className="mt-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Est. Total Wait</span>
                            <span className="font-bold text-gray-800 dark:text-white">~{queue.length * (currentDoctor?.avg_consult_time || 10)} min</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default DoctorDashboard;
