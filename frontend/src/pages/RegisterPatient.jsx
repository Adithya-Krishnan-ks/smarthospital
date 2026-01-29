import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { UserPlus, User, Phone, Activity, ArrowRight } from 'lucide-react';

export default function RegisterPatient() {
    const [form, setForm] = useState({ name: '', age: '', phone: '', priority: 'Normal' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/registerPatient', form);
            if (res.status === 201) {
                // Return 4-digit ID
                const { patient_code } = res.data;
                const displayId = patient_code || 'Error: Run Schema Update';
                alert(`Registration Successful!\nYour Patient ID is: ${displayId}\nPlease save this 4-digit ID to login.`);

                // Optional: Pre-fill login or just go to login
                navigate('/login/patient');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration Failed');
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="w-full max-w-lg bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserPlus size={32} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">New Patient</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Create your profile to get started</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        placeholder="Jane Doe"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Age</label>
                                <div className="relative">
                                    <Activity className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        value={form.age}
                                        onChange={e => setForm({ ...form, age: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        placeholder="25"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    placeholder="(555) 123-4567"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Priority (Self-Select)</label>
                            <select
                                value={form.priority}
                                onChange={e => setForm({ ...form, priority: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                            >
                                <option value="Normal">Normal (Routine Checkup)</option>
                                <option value="Senior">Senior Citizen</option>
                                <option value="Emergency">Emergency / Urgent</option>
                            </select>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                        >
                            Register & Get ID <ArrowRight size={20} />
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-gray-500">
                        Already registered? <Link to="/login/patient" className="text-blue-600 hover:underline">Login here</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
}
