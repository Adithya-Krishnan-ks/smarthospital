import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { Stethoscope, Lock, User, ArrowRight } from 'lucide-react';

export default function DoctorLogin() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch doctors list for dropdown convenience
        axios.get('http://localhost:5000/api/doctors')
            .then(res => setDoctors(res.data))
            .catch(console.error);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/login/doctor', {
                doctor_id: selectedDoc,
                password
            });
            if (res.data.success) {
                localStorage.setItem('role', 'doctor');
                localStorage.setItem('doctorId', res.data.doctor.doctor_id);
                localStorage.setItem('doctorName', res.data.doctor.name);
                navigate('/doctor-dashboard');
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
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Stethoscope size={32} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Doctor Portal</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Secure access for medical staff</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Profile</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all dark:text-white appearance-none"
                                    value={selectedDoc}
                                    onChange={(e) => setSelectedDoc(e.target.value)}
                                    required
                                >
                                    <option value="">Choose your name...</option>
                                    {doctors.map(doc => (
                                        <option key={doc.doctor_id} value={doc.doctor_id}>
                                            {doc.name} - {doc.department}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all dark:text-white"
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
                            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                        >
                            Sign In <ArrowRight size={20} />
                        </button>

                        <div className="text-center mt-4">
                            <a href="/forgot-password" className="text-sm text-green-600 hover:underline">
                                Forgot Password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
