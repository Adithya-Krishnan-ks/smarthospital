import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserCheck, Users, Clock, LogOut, ChevronRight, AlertTriangle, Activity } from 'lucide-react';
import Layout from '../components/Layout';
import API_BASE_URL from '../config';
import Toast from '../components/Toast';

const API_URL = API_BASE_URL;

function DoctorDashboard() {
    const navigate = useNavigate();
    const [doctorId] = useState(() => localStorage.getItem('doctorId') || '');
    const [doctorName] = useState(() => localStorage.getItem('doctorName') || '');
    const [doctorDept] = useState(() => localStorage.getItem('doctorDept') || '');
    const [doctorAvgTime] = useState(() => parseInt(localStorage.getItem('doctorAvgTime')) || 10);
    const [queue, setQueue] = useState([]);
    const [activeConsultation, setActiveConsultation] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!doctorId) {
            navigate('/login/doctor');
        }
    }, [doctorId, navigate]);

    useEffect(() => {
        if (doctorId) {
            fetchQueue();
            fetchActiveConsultation();
            const interval = setInterval(() => {
                fetchQueue();
                fetchActiveConsultation();
            }, 5000); // Poll every 5s
            return () => clearInterval(interval);
        }
    }, [doctorId]);

    const fetchQueue = async () => {
        try {
            const res = await axios.get(`${API_URL}/queue/${doctorId}`);
            setQueue(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchActiveConsultation = async () => {
        try {
            const res = await axios.get(`${API_URL}/doctor/${doctorId}/active`);
            setActiveConsultation(res.data);
        } catch (err) {
            console.error('Error fetching active consultation:', err);
        }
    };

    const handleNextPatient = async () => {
        try {
            await axios.post(`${API_URL}/nextPatient/${doctorId}`);
            fetchQueue();
            fetchActiveConsultation();
            setToast({ type: 'success', message: 'Called next patient!' });
        } catch (err) {
            setToast({ type: 'error', message: 'Error: ' + (err.response?.data?.error || err.message) });
        }
    };

    const handleCompleteConsultation = async () => {
        if (!activeConsultation) return;
        try {
            await axios.post(`${API_URL}/completeAppointment`, {
                appointment_id: activeConsultation.appointment_id
            });
            fetchQueue();
            fetchActiveConsultation();
            setToast({ type: 'success', message: 'Consultation marked as completed!' });
        } catch (err) {
            setToast({ type: 'error', message: 'Error: ' + (err.response?.data?.error || err.message) });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('doctorId');
        localStorage.removeItem('doctorName');
        localStorage.removeItem('doctorDept');
        localStorage.removeItem('doctorAvgTime');
        navigate('/login/doctor');
    };

    if (!doctorId) {
        return null; // Let useEffect redirect
    }

    return (
        <Layout actions={
            <button onClick={handleLogout} className="text-red-500 hover:text-red-600 font-semibold text-sm flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                <LogOut size={16} /> Logout
            </button>
        }>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white"> {doctorName}</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{doctorDept}</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Control Panel */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Current Consultation Card */}
                    {activeConsultation ? (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-teal-500 dark:border-teal-400 relative overflow-hidden animate-slide-in">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-600"></div>
                            <h3 className="text-xl font-bold mb-4 text-teal-600 dark:text-teal-400 flex items-center gap-2">
                                <Activity className="animate-pulse" /> Active Consultation
                            </h3>
                            <div className="flex justify-between items-center bg-teal-50/50 dark:bg-teal-950/20 p-5 rounded-2xl border border-teal-100 dark:border-teal-900/50 mb-4">
                                <div>
                                    <h4 className="font-extrabold text-2xl text-gray-800 dark:text-white mb-1">
                                        {activeConsultation.patient_name}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                                            activeConsultation.priority === 'Emergency' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                                            activeConsultation.priority === 'Senior' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30' :
                                            'bg-green-100 text-green-700 dark:bg-green-900/30'
                                        }`}>
                                            {activeConsultation.priority}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">Age: {activeConsultation.age}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider block font-semibold">Token Number</span>
                                    <span className="text-4xl font-black text-teal-600 dark:text-teal-400 font-mono">#{activeConsultation.token_number}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCompleteConsultation}
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-teal-500/25 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                            >
                                Complete Consultation
                            </button>
                        </div>
                    ) : (
                        <div className="bg-gray-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 text-center text-gray-400 dark:text-gray-500">
                            No active consultation. Click "Call Next Patient" to start.
                        </div>
                    )}

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
                                disabled={queue.length === 0 || activeConsultation !== null}
                                className="w-full bg-white text-teal-700 py-4 rounded-xl text-xl font-bold shadow-lg hover:bg-gray-50 transition transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
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
                            <span className="font-bold text-gray-800 dark:text-white">~{queue.length * doctorAvgTime} min</span>
                        </div>
                    </div>
                </div>
            </div>
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </Layout>
    );
}

export default DoctorDashboard;
