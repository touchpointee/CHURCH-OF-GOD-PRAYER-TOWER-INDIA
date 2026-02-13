"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, MapPin, MessageSquare, Loader2 } from "lucide-react";

export default function AdminContactPage() {
    const [activeTab, setActiveTab] = useState<'locations' | 'messages'>('locations');
    const [locations, setLocations] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Location Form
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        if (activeTab === 'locations') fetchLocations();
        if (activeTab === 'messages') fetchMessages();
    }, [activeTab]);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/contact/locations');
            if (res.data.success) setLocations(res.data.data);
        } catch (error) {
            console.error("Failed to fetch locations", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/contact/messages');
            if (res.data.success) setMessages(res.data.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmitLocation = async (data: any) => {
        try {
            if (isEditing && editingId) {
                await axios.put(`/api/contact/locations/${editingId}`, data);
            } else {
                await axios.post('/api/contact/locations', data);
            }
            fetchLocations();
            resetForm();
        } catch (error) {
            console.error("Failed to save location", error);
            alert("Failed to save location");
        }
    };

    const handleEdit = (location: any) => {
        setIsEditing(true);
        setEditingId(location._id);
        setValue('name', location.name);
        setValue('address', location.address);
        setValue('details', location.details);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this location?")) return;
        try {
            await axios.delete(`/api/contact/locations/${id}`);
            fetchLocations();
        } catch (error) {
            console.error("Failed to delete location", error);
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingId(null);
        reset({ name: '', address: '', details: '' });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Contact Management</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('locations')}
                    className={`pb-4 px-4 font-bold flex items-center gap-2 transition-colors ${activeTab === 'locations' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <MapPin size={18} /> Locations
                </button>
                <button
                    onClick={() => setActiveTab('messages')}
                    className={`pb-4 px-4 font-bold flex items-center gap-2 transition-colors ${activeTab === 'messages' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <MessageSquare size={18} /> Messages
                </button>
            </div>

            {/* Content */}
            {activeTab === 'locations' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="lg:col-span-2 space-y-4">
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gray-400" /></div>
                        ) : locations.map((loc) => (
                            <div key={loc._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start group">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{loc.name}</h3>
                                    <p className="text-gray-600 mb-2">{loc.address}</p>
                                    <div className="text-sm text-gray-500 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{loc.details}</div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(loc)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(loc._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                        {!loading && locations.length === 0 && <p className="text-gray-500 italic">No locations added yet.</p>}
                    </div>

                    {/* Form */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg h-fit">
                        <h3 className="font-bold text-xl mb-6">{isEditing ? 'Edit Location' : 'Add New Location'}</h3>
                        <form onSubmit={handleSubmit(onSubmitLocation)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Location Name</label>
                                <input {...register('name', { required: true })} className="w-full border rounded-lg p-2" placeholder="e.g. City Center Branch" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                                <textarea {...register('address', { required: true })} rows={2} className="w-full border rounded-lg p-2" placeholder="Full address..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Details (Service Times, etc.)</label>
                                <textarea {...register('details')} rows={4} className="w-full border rounded-lg p-2" placeholder="Sunday Service: 9:00 AM..." />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="submit" className="flex-1 bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary-dark transition-colors">
                                    {isEditing ? 'Update' : 'Add Location'}
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'messages' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-bold text-gray-600 text-sm">Date</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm">From</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm">Email / Phone</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm">Message</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading messages...</td></tr>
                                ) : messages.map((msg) => (
                                    <tr key={msg._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-500 text-sm whitespace-nowrap">
                                            {new Date(msg.createdAt).toLocaleDateString()} <br />
                                            <span className="text-xs">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">
                                            {msg.firstName} {msg.lastName}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            <div className="font-medium text-gray-900">{msg.email}</div>
                                            <div className="text-sm">{msg.phone}</div>
                                        </td>
                                        <td className="p-4 text-gray-700 max-w-md">
                                            {msg.message}
                                        </td>
                                    </tr>
                                ))}
                                {!loading && messages.length === 0 && (
                                    <tr><td colSpan={4} className="p-8 text-center text-gray-500 italic">No messages received yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
