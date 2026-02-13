"use client";

import { Clock, MapPin, Calendar, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EventDetailClient({ id }: { id: string }) {
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const addToCalendar = (type: 'google' | 'outlook' | 'yahoo' | 'ics') => {
        if (!event) return;

        const startDate = new Date(event.date);

        // Parse time if available
        if (event.time) {
            const [hours, minutes] = event.time.split(':');
            if (hours && minutes) {
                startDate.setHours(parseInt(hours));
                startDate.setMinutes(parseInt(minutes));
            }
        }

        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 2); // Default 2 hours duration

        const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');

        const start = formatDate(startDate);
        const end = formatDate(endDate);
        const title = encodeURIComponent(event.title);
        const details = encodeURIComponent(event.description || '');
        const location = encodeURIComponent(event.location || '');

        let url = '';

        switch (type) {
            case 'google':
                url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
                window.open(url, '_blank');
                break;
            case 'outlook':
                url = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=${start}&enddt=${end}&subject=${title}&body=${details}&location=${location}`;
                window.open(url, '_blank');
                break;
            case 'yahoo':
                // Yahoo format is a bit different, YYYYMMDDTHHMMSS
                // Yahoo might need Z omitted or plain legacy format. Let's try standard V2
                url = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=${start}&et=${end}&desc=${details}&in_loc=${location}`;
                window.open(url, '_blank');
                break;
            case 'ics':
                const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
                const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                break;
        }
        setShowModal(false);
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/events/${id}`);
                const data = await res.json();
                if (data.success) {
                    setEvent(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch event", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
                    <Link href="/events" className="text-primary hover:underline">Back to Events</Link>
                </div>
            </div>
        );
    }

    const date = new Date(event.date);
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    const year = date.getFullYear();

    return (
        <div className="min-h-screen bg-white font-sans pb-20">
            {/* Hero Image */}
            <div className="h-[60vh] md:h-[70vh] relative w-full overflow-hidden">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute top-0 left-0 p-6 z-10">
                    <Link href="/events" className="flex items-center text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
                        <ArrowLeft size={20} className="mr-2" /> Back to Events
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
                    <div className="container mx-auto">
                        <span className="bg-primary text-white font-bold px-4 py-1.5 rounded-full uppercase tracking-wider text-xs mb-4 inline-block">{event.category}</span>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight max-w-4xl">{event.title}</h1>

                        <div className="flex flex-wrap gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <Calendar className="text-accent" />
                                <span className="text-lg font-medium">{month} {day}, {year}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="text-accent" />
                                <span className="text-lg font-medium">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="text-accent" />
                                <span className="text-lg font-medium">{event.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">About the Event</h2>
                    <div className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
                        {event.description}
                    </div>

                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex items-center justify-between mt-12">
                        <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-1">Share this Event</h3>
                            <p className="text-gray-500 text-sm">Spread the word to your friends and family.</p>
                        </div>
                        <button className="flex items-center gap-2 bg-white border border-gray-200 hover:border-primary hover:text-primary text-gray-700 font-bold px-6 py-3 rounded-full transition-all shadow-sm">
                            <Share2 size={18} /> Share
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-24">
                        <h3 className="text-xl font-bold font-display text-gray-900 mb-6">Event Details</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">When</label>
                                <p className="text-gray-900 font-medium text-lg">{month} {day}, {year}</p>
                                <p className="text-gray-500">{event.time}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Where</label>
                                <p className="text-gray-900 font-medium text-lg">{event.location}</p>
                                <p className="text-gray-500">123 Church Avenue, City, Country</p>
                            </div>
                        </div>

                        <div className="relative mt-8">
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                            >
                                <Calendar size={20} /> Add to Calendar
                            </button>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-4">Don't miss out on this event!</p>
                    </div>
                </div>
            </div>

            {/* Calendar Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-gray-900">Add to Calendar</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <span className="sr-only">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-2">
                            <button onClick={() => addToCalendar('google')} className="w-full px-6 py-4 hover:bg-gray-50 text-left text-gray-700 font-medium flex items-center gap-3 transition-colors rounded-xl">
                                <Calendar className="w-6 h-6 text-blue-500" />
                                Google Calendar
                            </button>
                            <button onClick={() => addToCalendar('outlook')} className="w-full px-6 py-4 hover:bg-gray-50 text-left text-gray-700 font-medium flex items-center gap-3 transition-colors rounded-xl">
                                <Calendar className="w-6 h-6 text-blue-600" />
                                Outlook.com
                            </button>
                            <button onClick={() => addToCalendar('yahoo')} className="w-full px-6 py-4 hover:bg-gray-50 text-left text-gray-700 font-medium flex items-center gap-3 transition-colors rounded-xl">
                                <Calendar className="w-6 h-6 text-purple-600" />
                                Yahoo Calendar
                            </button>
                            <button onClick={() => addToCalendar('ics')} className="w-full px-6 py-4 hover:bg-gray-50 text-left text-gray-700 font-medium flex items-center gap-3 transition-colors rounded-xl">
                                <Calendar className="w-6 h-6 text-gray-600" />
                                Apple Calendar / ICS
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
