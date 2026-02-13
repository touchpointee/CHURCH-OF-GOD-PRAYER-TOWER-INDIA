"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, Award } from "lucide-react";

export default function HistoryPage() {
    const [milestones, setMilestones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('/api/history');
            if (res.data.success) {
                setMilestones(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* Hero Section */}
            <section className="bg-white text-gray-900 pt-12 pb-6 px-4 text-center border-b border-gray-100">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our Journey of Faith</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">From humble beginnings to a global ministry, witness how God has led us every step of the way.</p>
            </section>

            {/* Timeline */}
            <div className="container mx-auto px-4 pb-12 pt-6 relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 top-6 bottom-12 w-1 bg-gray-200 hidden md:block"></div>

                <div className="space-y-24">
                    {milestones.map((item, idx) => (
                        <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            {/* Content */}
                            <div className={`flex-1 text-center ${idx % 2 === 1 ? 'md:text-left' : 'md:text-right'}`}>
                                <span className="text-6xl font-display font-bold text-gray-100 absolute -z-10 transform -translate-y-10 scale-150 opacity-50 select-none hidden md:block">{item.year}</span>
                                <div className="relative z-10">
                                    <h3 className="text-3xl font-bold text-primary mb-4">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                </div>
                            </div>

                            {/* Marker */}
                            <div className="w-8 h-8 rounded-full bg-primary border-4 border-white shadow-lg relative z-20 hidden md:block"></div>

                            {/* Image */}
                            <div className="flex-1">
                                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-w-4 aspect-h-3 group">
                                    <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img src={item.image} alt={item.title} className="object-cover w-full h-64 md:h-80 transform group-hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



        </div>
    );
}
