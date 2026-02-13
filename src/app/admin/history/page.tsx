"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Plus, Trash2, Edit2, Save, X, Crop as CropIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';

export default function ManageHistoryPage() {
    const [milestones, setMilestones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
    const [submitting, setSubmitting] = useState(false);

    // Watch for image preview
    const imagePreview = watch('image');

    // Cropper State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [cropLoading, setCropLoading] = useState(false);

    useEffect(() => {
        fetchMilestones();
    }, []);

    const fetchMilestones = async () => {
        try {
            const res = await axios.get('/api/history');
            if (res.data.success) {
                setMilestones(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch milestones', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            if (isEditing && editingId) {
                await axios.put(`/api/history/${editingId}`, data);
            } else {
                await axios.post('/api/history', data);
            }
            fetchMilestones();
            resetForm();
            alert(isEditing ? 'Milestone updated!' : 'Milestone created!');
        } catch (error) {
            console.error('Operation failed', error);
            alert('Failed to save milestone');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this milestone?')) return;
        try {
            await axios.delete(`/api/history/${id}`);
            fetchMilestones();
        } catch (error) {
            console.error('Delete failed', error);
            alert('Failed to delete milestone');
        }
    };

    const handleEdit = (milestone: any) => {
        setIsEditing(true);
        setEditingId(milestone._id);
        setValue('year', milestone.year);
        setValue('title', milestone.title);
        setValue('description', milestone.description);
        setValue('image', milestone.image);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingId(null);
        reset();
        setImageSrc(null);
        setShowCropper(false);
    };

    const onFileChange = async (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result?.toString() || null);
                setShowCropper(true);
            });
            reader.readAsDataURL(file);
            // Reset input value so same file can be selected again
            e.target.value = '';
        }
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            setCropLoading(true);
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            if (!croppedImageBlob) {
                throw new Error("Failed to crop image");
            }

            // Create a File object from the Blob
            const file = new File([croppedImageBlob], "cropped-image.jpg", { type: "image/jpeg" });

            // Upload the file
            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success || res.data.url) {
                setValue('image', res.data.url);
                setShowCropper(false);
                setImageSrc(null);
            }
        } catch (error) {
            console.error("Crop/Upload failed", error);
            alert("Failed to save cropped image");
        } finally {
            setCropLoading(false);
        }
    }

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto relative">
            {/* Cropper Modal */}
            {showCropper && imageSrc && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh]">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg">Crop Image</h3>
                            <button onClick={() => setShowCropper(false)} className="text-gray-500 hover:text-gray-800">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="relative flex-1 bg-gray-900">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 3}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="p-4 border-t flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowCropper(false)}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCropSave}
                                    disabled={cropLoading}
                                    className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    {cropLoading ? <Loader2 className="animate-spin" size={20} /> : <><CropIcon size={18} /> Crop & Save</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Manage History</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Milestone' : 'Add New Milestone'}</h2>
                            {isEditing && (
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Year</label>
                                <input
                                    {...register('year', { required: true })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none"
                                    placeholder="e.g. 2010"
                                />
                                {errors.year && <span className="text-red-500 text-xs">Required</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input
                                    {...register('title', { required: true })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none"
                                    placeholder="e.g. The Beginning"
                                />
                                {errors.title && <span className="text-red-500 text-xs">Required</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    {...register('description', { required: true })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none min-h-[100px]"
                                    placeholder="Brief description..."
                                ></textarea>
                                {errors.description && <span className="text-red-500 text-xs">Required</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Image</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        {...register('image', { required: true })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none hidden"
                                    />
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="historyImageUpload"
                                            accept="image/*"
                                            onChange={onFileChange}
                                        />
                                        <label htmlFor="historyImageUpload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 w-full justify-center">
                                            Choose Image
                                        </label>
                                    </div>
                                    {imagePreview && (
                                        <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border mt-2">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    {errors.image && <span className="text-red-500 text-xs">Image is required</span>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : isEditing ? <><Save size={20} /> Update</> : <><Plus size={20} /> Add Milestone</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Existing Milestones</h2>
                        </div>
                        {milestones.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No milestones found. Add one to get started!
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {milestones.map((milestone) => (
                                    <div key={milestone._id} className="p-6 flex gap-6 items-start hover:bg-gray-50 transition-colors group">
                                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={milestone.image} alt={milestone.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-accent font-bold text-sm">{milestone.year}</span>
                                                    <h3 className="text-lg font-bold text-gray-900">{milestone.title}</h3>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(milestone)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(milestone._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{milestone.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
