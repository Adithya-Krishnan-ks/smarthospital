import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Stethoscope, User, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';

export default function LoginSelection() {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12">
                <div className="space-y-4 animate-fade-in-up">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 dark:from-blue-400 dark:via-blue-300 dark:to-blue-500 bg-clip-text text-transparent">
                         Welcome to Smart Hospital
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Please select your role to access the dashboard.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl px-4 animate-fade-in-up delay-100">

                    {/* Patient Card */}
                    <Link to="/login/patient" className="group bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-2">
                        <div className="mb-6 mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <User size={40} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Patient</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Book appointments and check your queue status.</p>
                        <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">
                            Login <ArrowRight size={18} />
                        </div>
                    </Link>

                    {/* Doctor Card */}
                    <Link to="/login/doctor" className="group bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl hover:border-green-500/30 transition-all duration-300 transform hover:-translate-y-2">
                        <div className="mb-6 mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Stethoscope size={40} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Doctor</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Manage patients, consultations, and schedule.</p>
                        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-semibold group-hover:gap-3 transition-all">
                            Login <ArrowRight size={18} />
                        </div>
                    </Link>

                    {/* Admin Card */}
                    <Link to="/login/admin" className="group bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 transform hover:-translate-y-2">
                        <div className="mb-6 mx-auto w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Shield size={40} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Admin</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">System settings, doctor onboarding, and analytics.</p>
                        <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-3 transition-all">
                            Login <ArrowRight size={18} />
                        </div>
                    </Link>

                </div>
            </div>
        </Layout>
    );
}
