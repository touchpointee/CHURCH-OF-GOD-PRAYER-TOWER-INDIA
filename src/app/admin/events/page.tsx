"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function EventsManager() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/events');
            if (res.data.success) {
                setEvents(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch events', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        // TODO: Implement delete API
        alert('Delete functionality to be implemented in API');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Events</h1>
                    <p className="text-gray-500">Manage your upcoming church events.</p>
                </div>
                <Link
                    href="/admin/events/new"
                    className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 w-full md:w-auto"
                >
                    <Plus size={20} />
                    Add New Event
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700 text-sm">Title</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-sm">Date</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-sm">Category</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-sm">Location</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {events.map((event: any) => (
                                <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={event.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                            <span className="font-bold text-gray-900">{event.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                            {event.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{event.location}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="text-gray-400 hover:text-primary transition-colors p-2">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(event._id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        No events found. Click "Add New Event" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
