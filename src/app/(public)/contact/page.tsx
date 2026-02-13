"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";

export default function ContactPage() {
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axios.get('/api/contact/locations');
                if (res.data.success) {
                    setLocations(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch locations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);

    const onSubmit = async (data: any) => {
        setSubmitStatus('submitting');
        try {
            await axios.post('/api/contact/messages', data);
            setSubmitStatus('success');
            reset();
        } catch (error) {
            console.error("Failed to send message", error);
            setSubmitStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Content Grid */}
            <div className="container mx-auto px-4 py-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 shadow-2xl rounded-3xl overflow-hidden bg-white">

                    {/* Contact Info & Map */}
                    <div className="bg-gray-50 text-gray-900 p-10 md:p-14 flex flex-col justify-between border-r border-gray-100">
                        <div>
                            <h2 className="text-3xl font-display font-bold mb-6 text-gray-900">Contact Information</h2>
                            <p className="text-gray-500 mb-10">Fill up the form and our team will get back to you within 24 hours.</p>

                            <div className="space-y-8">
                                {locations.map((location) => (
                                    <div key={location._id} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-gray-900 uppercase tracking-widest mb-2 border-b border-gray-100 pb-2">{location.name}</h4>
                                        <p className="text-gray-600 mb-1 font-medium">{location.address}</p>
                                        {location.details && (
                                            <div className="text-sm text-gray-500 space-y-1 mt-3 whitespace-pre-wrap">
                                                {location.details}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {locations.length === 0 && !loading && (
                                    <p className="text-gray-500 italic">No location details available.</p>
                                )}

                                <div className="flex items-start gap-4 pt-4">
                                    <div className="bg-white p-3 rounded-lg border border-gray-200"><Mail size={20} className="text-gray-700" /></div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-1">Email</h4>
                                        <p className="font-medium text-lg text-accent">prayer@cogindia.org</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
                            {/* Social Icons */}
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer text-gray-500">
                                <MessageCircle size={20} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer text-gray-500">
                                <Phone size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-10 md:p-14 bg-white">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2 font-display">Send a Message</h2>
                        <p className="text-gray-500 mb-8">We are here to answer any question you may have.</p>

                        {submitStatus === 'success' ? (
                            <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-100 text-center">
                                <h3 className="font-bold text-xl mb-2">Message Sent!</h3>
                                <p>Thank you for getting in touch. We will respond shortly.</p>
                                <button onClick={() => setSubmitStatus('idle')} className="mt-4 text-sm font-bold underline hover:text-green-800">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">First Name</label>
                                        <input
                                            {...register("firstName", { required: true })}
                                            type="text"
                                            className="w-full border-b-2 border-gray-200 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors"
                                            placeholder="John"
                                        />
                                        {errors.firstName && <span className="text-red-500 text-xs">Required</span>}
                                    </div>
                                    <div className="relative">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Last Name</label>
                                        <input
                                            {...register("lastName")}
                                            type="text"
                                            className="w-full border-b-2 border-gray-200 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
                                        <input
                                            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                                            type="email"
                                            className="w-full border-b-2 border-gray-200 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors"
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <span className="text-red-500 text-xs">Valid email required</span>}
                                    </div>
                                    <div className="relative">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Phone</label>
                                        <input
                                            {...register("phone")}
                                            type="tel"
                                            className="w-full border-b-2 border-gray-200 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors"
                                            placeholder="+91 ..."
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Message or Prayer Request</label>
                                    <textarea
                                        {...register("message", { required: true })}
                                        rows={4}
                                        className="w-full border-b-2 border-gray-200 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors resize-none"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                    {errors.message && <span className="text-red-500 text-xs">Required</span>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitStatus === 'submitting'}
                                    className="bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary-dark transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitStatus === 'submitting' ? 'Sending...' : 'Send Message'} <Send size={18} className="ml-2" />
                                </button>
                                {submitStatus === 'error' && <p className="text-red-500 text-sm mt-2">Failed to send message. Please try again.</p>}
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
