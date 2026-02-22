"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ArrowLeft, Loader2, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    type EventForm = { dateType: 'single' | 'range'; title?: string; titleHi?: string; titleMl?: string; category?: string; date?: string; dateEnd?: string; time?: string; location?: string; locationHi?: string; locationMl?: string; description?: string; descriptionHi?: string; descriptionMl?: string };
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<EventForm>({ defaultValues: { dateType: 'single' } });
    const dateType = watch('dateType');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                const res = await axios.get(`/api/events/${id}?raw=1`);
                if (res.data.success && res.data.data) {
                    const event = res.data.data;
                    setImageUrl(event.imageUrl || '');
                    const dateStr = event.date ? new Date(event.date).toISOString().slice(0, 10) : '';
                    const dateEndStr = event.dateEnd ? new Date(event.dateEnd).toISOString().slice(0, 10) : '';
                    reset({
                        title: event.title ?? '',
                        titleHi: event.titleHi ?? '',
                        titleMl: event.titleMl ?? '',
                        category: event.category ?? '',
                        dateType: event.dateType ?? 'single',
                        date: dateStr,
                        dateEnd: dateEndStr,
                        time: event.time ?? '',
                        location: event.location ?? '',
                        locationHi: event.locationHi ?? '',
                        locationMl: event.locationMl ?? '',
                        description: event.description ?? '',
                        descriptionHi: event.descriptionHi ?? '',
                        descriptionMl: event.descriptionMl ?? '',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch event', error);
                alert('Failed to load event');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, reset]);

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = res.data.url ?? res.data.uploads?.[0]?.url;
            if (url) setImageUrl(url);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

    const onSubmit = async (data: any) => {
        if (!imageUrl) {
            alert("Please upload an image first.");
            return;
        }
        const payload: any = { ...data, imageUrl };
        if (data.dateType === 'range') {
            payload.time = '';
            if (!payload.dateEnd || payload.date > payload.dateEnd) {
                alert("End date must be on or after start date.");
                return;
            }
        } else {
            payload.dateEnd = undefined;
        }
        setSubmitting(true);
        try {
            await axios.put(`/api/events/${id}`, payload);
            router.push('/admin/events');
            router.refresh();
        } catch (error: any) {
            console.error("Update failed", error);
            alert(error.response?.data?.error || "Failed to update event");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Loading event...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/admin/events" className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Events
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Edit Event</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Event Image</label>
                        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}>
                            <input {...getInputProps()} />
                            {uploading ? (
                                <div className="flex flex-col items-center text-gray-500">
                                    <Loader2 className="animate-spin mb-2" />
                                    <p className="text-sm">Uploading...</p>
                                </div>
                            ) : imageUrl ? (
                                <div className="relative">
                                    <img src={imageUrl} alt="Uploaded" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                                    <p className="text-xs text-green-600 mt-2 font-bold">Image uploaded (Click to replace)</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-gray-500">
                                    <UploadCloud size={40} className="mb-4 text-gray-300" />
                                    <p className="font-medium text-gray-700">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title (English)</label>
                        <input {...register('title', { required: true })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="Event Title" />
                        {errors.title && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title (Hindi)</label>
                        <input {...register('titleHi')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="हिंदी में शीर्षक" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title (Malayalam)</label>
                        <input {...register('titleMl')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="മലയാളത്തിൽ ശീർഷകം" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select {...register('category')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none bg-white">
                                <option value="">Select Category (Optional)</option>
                                <option value="Special Service">Special Service</option>
                                <option value="Youth">Youth</option>
                                <option value="Study">Study</option>
                                <option value="Outreach">Outreach</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Event date type</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" value="single" {...register('dateType')} className="rounded border-gray-300 text-primary focus:ring-primary" />
                                <span className="text-gray-700">Single date & time</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" value="range" {...register('dateType')} className="rounded border-gray-300 text-primary focus:ring-primary" />
                                <span className="text-gray-700">Date range (e.g. 10–18 February)</span>
                            </label>
                        </div>
                    </div>
                    {dateType === 'single' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                                <input type="date" {...register('date', { required: true })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" />
                                {errors.date && <span className="text-red-500 text-xs">Required</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Time</label>
                                <input type="time" {...register('time', { required: true })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" />
                                {errors.time && <span className="text-red-500 text-xs">Required</span>}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Start date</label>
                                <input type="date" {...register('date', { required: true })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" />
                                {errors.date && <span className="text-red-500 text-xs">Required</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">End date</label>
                                <input type="date" {...register('dateEnd', { required: true })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" />
                                {errors.dateEnd && <span className="text-red-500 text-xs">Required</span>}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Location (English)</label>
                        <input {...register('location', { required: true })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="e.g. Main Sanctuary" />
                        {errors.location && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Location (Hindi)</label>
                        <input {...register('locationHi')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="हिंदी में स्थान" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Location (Malayalam)</label>
                        <input {...register('locationMl')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="മലയാളത്തിൽ സ്ഥലം" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description (English)</label>
                        <textarea {...register('description', { required: true })} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="Event details..." />
                        {errors.description && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description (Hindi)</label>
                        <textarea {...register('descriptionHi')} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="हिंदी में विवरण" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description (Malayalam)</label>
                        <textarea {...register('descriptionMl')} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="മലയാളത്തിൽ വിവരണം" />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : 'Update Event'}
                    </button>
                </form>
            </div>
        </div>
    );
}
