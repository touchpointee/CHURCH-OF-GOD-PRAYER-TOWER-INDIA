"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ArrowLeft, Loader2, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';

export default function NewEventPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    // Image Upload Logic
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
            setImageUrl(res.data.url);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image. Please check console.");
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

        setSubmitting(true);
        try {
            await axios.post('/api/events', { ...data, imageUrl });
            router.push('/admin/events');
            router.refresh();
        } catch (error) {
            console.error("Create failed", error);
            alert("Failed to create event");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/admin/events" className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Events
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Create New Event</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Image Upload */}
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
                                    <p className="text-xs text-green-600 mt-2 font-bold">Image uploaded successfully (Click to replace)</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                            <input {...register('title', { required: true })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="Event Title" />
                            {errors.title && <span className="text-red-500 text-xs">Required</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select {...register('category', { required: true })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none bg-white">
                                <option value="">Select Category</option>
                                <option value="Special Service">Special Service</option>
                                <option value="Youth">Youth</option>
                                <option value="Study">Study</option>
                                <option value="Outreach">Outreach</option>
                            </select>
                            {errors.category && <span className="text-red-500 text-xs">Required</span>}
                        </div>
                    </div>

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

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                        <input {...register('location', { required: true })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="e.g. Main Sanctuary" />
                        {errors.location && <span className="text-red-500 text-xs">Required</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea {...register('description', { required: true })} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="Event details..." />
                        {errors.description && <span className="text-red-500 text-xs">Required</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : 'Create Event'}
                    </button>
                </form>
            </div>
        </div>
    );
}
