"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, ShieldCheck, Heart, Trash2 } from "lucide-react";

export default function AdminPrayerRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('/api/prayer-requests');
            if (res.data.success) {
                setRequests(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this prayer request?")) return;
        setDeletingId(id);
        try {
            const res = await axios.delete(`/api/prayer-requests/${id}`);
            if (res.data.success) {
                setRequests(requests.filter((r) => r._id !== id));
            } else {
                alert(res.data.error || "Failed to delete");
            }
        } catch (error: any) {
            console.error("Failed to delete prayer request", error);
            alert(error.response?.data?.error || "Failed to delete prayer request");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Prayer Requests</h1>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-bold text-gray-600 text-sm">Date</th>
                                <th className="p-4 font-bold text-gray-600 text-sm">Name</th>
                                <th className="p-4 font-bold text-gray-600 text-sm">Contact</th>
                                <th className="p-4 font-bold text-gray-600 text-sm">Request</th>
                                <th className="p-4 font-bold text-gray-600 text-sm">Status</th>
                                <th className="p-4 font-bold text-gray-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" /> Loading requests...</td></tr>
                            ) : requests.map((req) => (
                                <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-500 text-sm whitespace-nowrap">
                                        {new Date(req.createdAt).toLocaleDateString()} <br />
                                        <span className="text-xs">{new Date(req.createdAt).toLocaleTimeString()}</span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">
                                        {req.name || <span className="text-gray-400 italic">Anonymous</span>}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {req.contact || <span className="text-gray-400 italic">--</span>}
                                    </td>
                                    <td className="p-4 text-gray-700 max-w-lg">
                                        {req.message}
                                    </td>
                                    <td className="p-4">
                                        {req.isConfidential ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                                                <ShieldCheck size={12} /> Confidential
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                                                <Heart size={12} /> Standard
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(req._id)}
                                            disabled={deletingId === req._id}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Delete"
                                        >
                                            {deletingId === req._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && requests.length === 0 && (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500 italic">No prayer requests received yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" /> Loading requests...</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {requests.map((req) => (
                                <div key={req._id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-900">{req.name || <span className="text-gray-400 italic">Anonymous</span>}</p>
                                            <p className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()} • {new Date(req.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                        {req.isConfidential ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                                                <ShieldCheck size={12} />
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                                                <Heart size={12} />
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{req.message}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 gap-2">
                                        <span><span className="font-semibold">Contact:</span> {req.contact || <span className="italic">--</span>}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(req._id)}
                                            disabled={deletingId === req._id}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete"
                                        >
                                            {deletingId === req._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {!loading && requests.length === 0 && (
                                <div className="p-8 text-center text-gray-500 italic">No prayer requests received yet.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
