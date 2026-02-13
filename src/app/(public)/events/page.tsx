"use client";

import { Clock, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const res = await fetch('/api/events');
                const data = await res.json();
                if (data.success) {
                    setEvents(data.data);
                }
            } catch (error) {
                console.error("Failed to load events", error);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    const getMonthDay = (dateString: string) => {
        const date = new Date(dateString);
        return {
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
            day: date.getDate(),
            year: date.getFullYear()
        };
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;


    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header Removed as per request */}

            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-6">
                    {events.length > 0 ? (
                        events.map((event: any) => {
                            const dateInfo = getMonthDay(event.date);
                            return (
                                <Link href={`/events/${event._id}`} key={event._id} className="block">
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-all group">
                                        {/* Date Badge */}
                                        <div className="md:w-32 bg-secondary/10 flex flex-col items-center justify-center p-4 border-r border-gray-100 flex-shrink-0 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                            <span className="text-black font-bold text-xl">{dateInfo.month}</span>
                                            <span className="text-4xl font-bold text-gray-800">{dateInfo.day}</span>
                                            <span className="text-gray-600 font-medium text-sm mt-1">{dateInfo.year}</span>
                                        </div>

                                        {/* Image (Mobile only or small thumb) */}
                                        <div className="h-48 md:h-56 md:w-72 flex-shrink-0">
                                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Details */}
                                        <div className="p-6 flex-grow flex flex-col justify-center">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{event.category}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1"><Clock size={16} /> {event.time}</span>
                                                <span className="flex items-center gap-1"><MapPin size={16} /> {event.location}</span>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="p-6 flex items-center justify-center border-l border-gray-100">
                                            <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-primary group-hover:border-primary transition-all">
                                                <ChevronRight size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MapPin size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Upcoming Events</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">We're currently planning new events. Please check back later or visit our social media for updates.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
