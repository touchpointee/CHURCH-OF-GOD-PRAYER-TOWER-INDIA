"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";

interface Belief extends Record<string, any> {
    _id: string;
    content: string;
    order: number;
}

export default function AdminStatementOfFaithPage() {
    const [beliefs, setBeliefs] = useState<Belief[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const { register, handleSubmit, reset, setValue } = useForm();

    const [verseText, setVerseText] = useState("");
    const [verseRef, setVerseRef] = useState("");
    const [updatingVerse, setUpdatingVerse] = useState(false);

    useEffect(() => {
        fetchBeliefs();
        fetchVerse();
    }, []);

    const fetchVerse = async () => {
        try {
            const res = await axios.get('/api/scriptures?key=statement-of-faith');
            if (res.data.success && res.data.data) {
                setVerseText(res.data.data.text);
                setVerseRef(res.data.data.reference);
            }
        } catch (error) {
            console.error("Failed to fetch verse", error);
        }
    };

    const handleVerseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdatingVerse(true);
        try {
            await axios.post('/api/scriptures', {
                key: 'statement-of-faith',
                text: verseText,
                reference: verseRef
            });
            alert("Verse updated successfully!");
        } catch (error) {
            console.error("Failed to update verse", error);
        } finally {
            setUpdatingVerse(false);
        }
    };

    const fetchBeliefs = async () => {
        try {
            const res = await axios.get('/api/statement-of-faith');
            if (res.data.success) {
                setBeliefs(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch beliefs", error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            if (editingId) {
                await axios.put(`/api/statement-of-faith/${editingId}`, data);
            } else {
                await axios.post('/api/statement-of-faith', data);
            }
            fetchBeliefs();
            reset();
            setEditingId(null);
            setIsAdding(false);
        } catch (error) {
            console.error("Failed to save belief", error);
        }
    };

    const handleEdit = (belief: Belief) => {
        setEditingId(belief._id);
        setValue('content', belief.content);
        setValue('order', belief.order);
        setIsAdding(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this belief?')) return;
        try {
            await axios.delete(`/api/statement-of-faith/${id}`);
            fetchBeliefs();
        } catch (error) {
            console.error("Failed to delete belief", error);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Statement of Faith</h1>

            {/* Verse Management */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-12">
                <h2 className="text-xl font-bold mb-4">Highlighted Scripture</h2>
                <form onSubmit={handleVerseSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Verse Text</label>
                            <input
                                type="text"
                                value={verseText}
                                onChange={(e) => setVerseText(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black/5 outline-none"
                                placeholder="For God so loved the world..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Reference</label>
                            <input
                                type="text"
                                value={verseRef}
                                onChange={(e) => setVerseRef(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black/5 outline-none"
                                placeholder="John 3:16"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={updatingVerse}
                            className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {updatingVerse ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Update Verse
                        </button>
                    </div>
                </form>
            </div>

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Points of Faith</h2>
                <button
                    onClick={() => {
                        reset();
                        setEditingId(null);
                        setIsAdding(!isAdding);
                    }}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    {isAdding ? <X size={18} /> : <Plus size={18} />}
                    {isAdding ? 'Cancel' : 'Add Point'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
                    <h3 className="font-bold text-lg mb-4">{editingId ? 'Edit Point' : 'Add New Point'}</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
                            <textarea
                                {...register("content", { required: true })}
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black/5 outline-none"
                                placeholder="Enter belief description..."
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-accent text-white px-6 py-2 rounded-lg font-bold hover:bg-accent-hover transition-colors flex items-center gap-2"
                            >
                                <Save size={18} /> Save Point
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-bold text-gray-600 text-sm w-16">#</th>
                                <th className="p-4 font-bold text-gray-600 text-sm">Belief</th>
                                <th className="p-4 font-bold text-gray-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={3} className="p-8 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" /> Loading...</td></tr>
                            ) : beliefs.map((belief, idx) => (
                                <tr key={belief._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4 text-gray-400 font-mono text-sm">{idx + 1}</td>
                                    <td className="p-4 text-gray-800 leading-relaxed max-w-4xl">
                                        {belief.content}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(belief)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(belief._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && beliefs.length === 0 && (
                                <tr><td colSpan={3} className="p-8 text-center text-gray-500 italic">No beliefs found. Add one to get started.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
