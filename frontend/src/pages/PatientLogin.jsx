import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { User, Key, ArrowRight } from 'lucide-react';

export default function PatientLogin() {
    const [patientId, setPatientId] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/login/patient', {
                patient_id: patientId,
                name
            });
            if (res.data.success) {
                localStorage.setItem('role', 'patient');
                localStorage.setItem('patientId', res.data.patient.patient_id);
                localStorage.setItem('patientName', res.data.patient.name);
                navigate('/patient-dashboard');
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
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User size={32} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Patient Access</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">View your appointments & queue status</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Patient ID</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    value={patientId}
                                    onChange={(e) => setPatientId(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    placeholder="e.g. 1001"
                                    type="number"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    placeholder="John Doe"
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
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                        >
                            View Dashboard <ArrowRight size={20} />
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-gray-500">
                        Don't have an ID? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
}
