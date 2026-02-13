"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Loader2, Save } from 'lucide-react';

export default function ManageAboutPage() {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Watch for preview
    const founderImage = watch('founderImage');

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            const res = await axios.get('/api/about');
            if (res.data.success && res.data.data) {
                const data = res.data.data;
                // Set form values
                setValue('founderName', data.founderName || 'Pastor P M Joseph');
                setValue('founderImage', data.founderImage || '');
                setValue('title', data.title || 'Who we are?');
                setValue('content', data.content || '');
            }
        } catch (error) {
            console.error('Failed to fetch about data', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            await axios.post('/api/about', data);
            alert('About page updated successfully!');
        } catch (error) {
            console.error('Update failed', error);
            alert('Failed to update about page');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Manage "Who We Are"</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Founder Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Founder Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Founder Name</label>
                                <input
                                    {...register('founderName', { required: true })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none"
                                    placeholder="e.g. Pastor K. E. Abraham"
                                />
                                {errors.founderName && <span className="text-red-500 text-xs">Required</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Founder Image</label>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        {...register('founderImage', { required: true })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none hidden" // Hidden input for form state
                                    />

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="founderImageUpload"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const formData = new FormData();
                                                formData.append('file', file);

                                                try {
                                                    setSubmitting(true);
                                                    const res = await axios.post('/api/upload', formData, {
                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                    });

                                                    if (res.data.success || res.data.url) {
                                                        const url = res.data.url;
                                                        setValue('founderImage', url);
                                                    }
                                                } catch (error) {
                                                    console.error("Upload failed", error);
                                                    alert("Failed to upload image");
                                                } finally {
                                                    setSubmitting(false);
                                                }
                                            }}
                                        />
                                        <label htmlFor="founderImageUpload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                                            Choose File
                                        </label>
                                        <span className="text-sm text-gray-500">{founderImage ? 'Image Selected' : 'No image selected'}</span>
                                    </div>
                                    {errors.founderImage && <span className="text-red-500 text-xs">Required (Please upload an image)</span>}
                                </div>
                            </div>
                        </div>

                        {/* Image Preview */}
                        {founderImage && (
                            <div className="mt-4">
                                <span className="block text-xs font-bold text-gray-500 mb-2">PREVIEW</span>
                                <div className="w-48 h-64 bg-gray-100 rounded-lg overflow-hidden border">
                                    <img src={founderImage} alt="Founder Preview" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Page Content</h2>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                            <input
                                {...register('title', { required: true })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none"
                                placeholder="e.g. Who we are?"
                            />
                            {errors.title && <span className="text-red-500 text-xs">Required</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Description / Paragraphs</label>
                            <textarea
                                {...register('content', { required: true })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none min-h-[300px]"
                                placeholder="Enter the main content here..."
                            ></textarea>
                            {errors.content && <span className="text-red-500 text-xs">Required</span>}
                            <p className="text-xs text-gray-400 mt-1">HTML is not supported, effectively just text. Use double newlines for paragraphs.</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
