
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, Clock, Activity, AlertCircle, Phone, Hash } from 'lucide-react';
import Layout from '../components/Layout';

const API_URL = 'http://localhost:5000/api';

function PatientDashboard() {
    const [patient, setPatient] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);

    // Registration Form
    const [regForm, setRegForm] = useState({ name: '', age: '', phone: '', priority: 'Normal' });

    // Booking Form
    const [selectedDoctor, setSelectedDoctor] = useState('');

    useEffect(() => {
        fetchDoctors();
        // Restore session if exists
        const storedPid = localStorage.getItem('patientId');
        if (storedPid) {
            fetchPatientDetails(storedPid);
        }
    }, []);

    const fetchPatientDetails = async (id) => {
        try {
            const res = await axios.get(`${API_URL}/patients/${id}`);
            setPatient(res.data);
        } catch (err) {
            console.error('Error restoring session', err);
            // Optional: Clear invalid session
            // localStorage.removeItem('patientId');
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${API_URL}/doctors`);
            setDoctors(res.data);
        } catch (err) {
            console.error('Error fetching doctors', err);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/registerPatient`, regForm);
            setPatient(res.data);
        } catch (err) {
            alert('Error registering: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleBook = async () => {
        if (!selectedDoctor) return alert('Select a doctor');
        try {
            const res = await axios.post(`${API_URL}/bookAppointment`, {
                patient_id: patient.patient_id,
                doctor_id: selectedDoctor
            });
            // Add to local list
            const newAppt = {
                ...res.data.appointment,
                estimated_time: res.data.estimated_time,
                doctor_name: doctors.find(d => d.doctor_id === selectedDoctor)?.name
            };
            setAppointments([newAppt, ...appointments]);
        } catch (err) {
            alert('Error booking: ' + (err.response?.data?.error || err.message));
        }
    };

    if (!patient) {
        return (
            <Layout>
                <div className="max-w-md mx-auto mt-10">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <User size={24} />
                            </div>
                            New Registration
                        </h2>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={regForm.name}
                                    onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                                    required
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Age</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={regForm.age}
                                        onChange={e => setRegForm({ ...regForm, age: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all"
                                            value={regForm.priority}
                                            onChange={e => setRegForm({ ...regForm, priority: e.target.value })}
                                        >
                                            <option value="Normal">Normal</option>
                                            <option value="Senior">Senior Citizen</option>
                                            <option value="Emergency">Emergency</option>
                                        </select>
                                        <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">▼</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={regForm.phone}
                                    onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 mt-2">
                                Generate Token ID
                            </button>
                        </form>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Hello, {patient.name}</h2>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${patient.priority === 'Emergency' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                patient.priority === 'Senior' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}>
                                {patient.priority}
                            </span>
                            <span className="text-gray-400 text-sm flex items-center gap-1"><Hash size={12} /> ID: {patient.patient_id.slice(0, 8)}</span>
                        </div>
                    </div>
                    <div className="h-12 w-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300">
                        <User size={24} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Booking Section */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                <Calendar size={20} />
                            </div>
                            Book Appointment
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select Specialist</label>
                                <select
                                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    value={selectedDoctor}
                                    onChange={e => setSelectedDoctor(e.target.value)}
                                >
                                    <option value="">-- Choose a Doctor --</option>
                                    {doctors.map(d => (
                                        <option key={d.doctor_id} value={d.doctor_id}>
                                            {d.name} ({d.department}) - Avg {d.avg_consult_time}m
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleBook}
                                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-0.5"
                                disabled={!selectedDoctor}
                            >
                                Get Token
                            </button>
                        </div>
                    </div>

                    {/* Status Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                            <Activity className="w-5 h-5 text-indigo-500" /> Your Appointments
                        </h3>

                        {appointments.length === 0 && (
                            <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-dashed border-gray-200 dark:border-slate-700 text-center text-gray-400">
                                No active appointments
                            </div>
                        )}

                        {appointments.map((apt, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-md border-l-4 border-indigo-500 dark:border-indigo-400 animate-fade-in">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800 dark:text-white">{apt.doctor_name || 'Doctor'}</h4>
                                        <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">Consultation</span>
                                    </div>
                                    <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">#{apt.token_number}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-gray-100 dark:border-slate-700">
                                    <div>
                                        <div className="text-gray-500 dark:text-gray-400 mb-1">Status</div>
                                        <span className="font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded inline-block">
                                            {apt.status}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-end gap-1"><Clock size={12} /> Est. Time</div>
                                        <div className="font-bold text-gray-800 dark:text-white">
                                            {new Date(apt.estimated_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default PatientDashboard;
