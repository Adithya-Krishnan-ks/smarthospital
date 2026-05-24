import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { KeyRound, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import API_BASE_URL from '../config';
import Toast from '../components/Toast';

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [role, setRole] = useState('doctor');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [debugOtp, setDebugOtp] = useState(null); // For demo convenience
    const [toast, setToast] = useState(null);

    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await axios.post(`${API_BASE_URL}/forgot-password`, { email, role });
            if (res.data.success) {
                setMessage(res.data.message);
                if (res.data.debug_otp) setDebugOtp(res.data.debug_otp);
                setStep(2);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP');
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await axios.post(`${API_BASE_URL}/reset-password`, {
                email,
                otp,
                newPassword,
                role
            });
            if (res.data.success) {
                setToast({ type: 'success', message: 'Password Reset Successful! Redirecting...' });
                setTimeout(() => {
                    navigate(role === 'admin' ? '/login/admin' : '/login/doctor');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Reset Failed');
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <KeyRound size={32} className="text-orange-600 dark:text-orange-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Reset Password</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Recover access to your account</p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">I am a</label>
                                <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setRole('doctor')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === 'doctor'
                                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                                : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                    >
                                        Doctor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole('admin')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === 'admin'
                                                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm'
                                                : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                    >
                                        Admin
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
                                        placeholder="user@hospital.com"
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
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                            >
                                Send OTP <ArrowRight size={20} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-6">
                            {message && (
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm text-center font-medium mb-4">
                                    {message}
                                    {debugOtp && <div className="font-bold mt-1">Mock OTP: {debugOtp}</div>}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Enter OTP</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
                                        placeholder="1234"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
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
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                            >
                                Reset Password <CheckCircle size={20} />
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-gray-500 text-sm hover:text-gray-700"
                            >
                                Back to Email
                            </button>
                        </form>
                    )}
                </div>
            </div>
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </Layout>
    );
}
