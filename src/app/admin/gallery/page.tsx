"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2, UploadCloud, Trash2, Pencil } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function GalleryManager() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [renamingImage, setRenamingImage] = useState<{ _id: string; title: string; titleHi?: string; titleMl?: string } | null>(null);
    const [renameForm, setRenameForm] = useState({ title: '', titleHi: '', titleMl: '' });
    const [savingRename, setSavingRename] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await axios.get('/api/gallery');
            if (res.data.success) {
                setImages(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch images', error);
        } finally {
            setLoading(false);
        }
    };

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setUploading(true);
        setUploadProgress({ current: 0, total: acceptedFiles.length });

        // Create FormData with all files
        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append('file', file);
        });

        try {
            // Upload all files in one request
            const uploadRes = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (uploadRes.data.success && uploadRes.data.uploads) {
                // Save all images to MongoDB in parallel
                const savePromises = uploadRes.data.uploads.map(async (upload: any, index: number) => {
                    try {
                        await axios.post('/api/gallery', {
                            title: upload.filename,
                            imageUrl: upload.url,
                            category: 'General'
                        });
                        setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }));
                    } catch (error) {
                        console.error(`Failed to save ${upload.filename}`, error);
                    }
                });

                await Promise.all(savePromises);
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Some files failed to upload. Please check console for details.');
        } finally {
            setUploading(false);
            setUploadProgress({ current: 0, total: 0 });
            fetchImages(); // Refresh list
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: true // Enable multiple file selection
    });

    const openRename = (img: any) => {
        setRenamingImage({ _id: img._id, title: img.title ?? '', titleHi: img.titleHi ?? '', titleMl: img.titleMl ?? '' });
        setRenameForm({ title: img.title ?? '', titleHi: img.titleHi ?? '', titleMl: img.titleMl ?? '' });
    };

    const handleRenameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!renamingImage) return;
        setSavingRename(true);
        try {
            await axios.put(`/api/gallery/${renamingImage._id}`, {
                title: renameForm.title,
                titleHi: renameForm.titleHi || undefined,
                titleMl: renameForm.titleMl || undefined,
            });
            setImages(images.map((img: any) =>
                img._id === renamingImage._id
                    ? { ...img, title: renameForm.title, titleHi: renameForm.titleHi || undefined, titleMl: renameForm.titleMl || undefined }
                    : img
            ) as any);
            setRenamingImage(null);
        } catch (error) {
            console.error('Failed to rename image', error);
            alert('Failed to rename image');
        } finally {
            setSavingRename(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await axios.delete(`/api/gallery/${id}`);
            setImages(images.filter((img: any) => img._id !== id));
        } catch (error) {
            console.error('Failed to delete image', error);
            alert('Failed to delete image');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {/* Rename modal – Title (EN/HI/ML) */}
            {renamingImage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRenamingImage(null)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-gray-900">Edit image title</h3>
                        <form onSubmit={handleRenameSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title (English)</label>
                                <input value={renameForm.title} onChange={e => setRenameForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="Image title" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title (Hindi)</label>
                                <input value={renameForm.titleHi} onChange={e => setRenameForm(f => ({ ...f, titleHi: e.target.value }))} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="हिंदी में शीर्षक" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title (Malayalam)</label>
                                <input value={renameForm.titleMl} onChange={e => setRenameForm(f => ({ ...f, titleMl: e.target.value }))} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="മലയാളത്തിൽ ശീർഷകം" />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="submit" disabled={savingRename} className="flex-1 bg-primary text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                    {savingRename ? <Loader2 className="animate-spin inline" size={18} /> : 'Save'}
                                </button>
                                <button type="button" onClick={() => setRenamingImage(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Gallery</h1>
                <p className="text-gray-500">Upload and manage photos.</p>
            </div>

            {/* Upload Zone */}
            <div {...getRootProps()} className={`mb-12 border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}`}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center">
                    {uploading ? (
                        <>
                            <Loader2 size={48} className="text-primary animate-spin mb-4" />
                            <p className="text-lg font-bold text-gray-700">Uploading photos...</p>
                            {uploadProgress.total > 0 && (
                                <p className="text-sm text-gray-500 mt-2">
                                    {uploadProgress.current} of {uploadProgress.total} completed
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                                <UploadCloud size={32} />
                            </div>
                            <p className="text-xl font-bold text-gray-900">Drag & Drop photos here</p>
                            <p className="text-gray-500 mt-2">or click to browse from your computer</p>
                            <p className="text-sm text-gray-400 mt-1">✨ You can select multiple images at once</p>
                        </>
                    )}
                </div>
            </div>

            {/* Grid */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Uploaded Photos ({images.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img: any) => (
                    <div key={img._id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                        <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                            <span className="text-white text-xs font-bold truncate pr-2 flex-1">{img.title}</span>
                            <div className="flex gap-2">
                                <button onClick={() => openRename(img)} className="bg-white p-1.5 rounded-full text-blue-500 hover:bg-blue-50 transition-colors shadow-sm" title="Rename">
                                    <Pencil size={14} />
                                </button>
                                <button onClick={() => handleDelete(img._id)} className="bg-white p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm" title="Delete">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {images.length === 0 && (
                    <p className="col-span-full text-gray-400 text-center py-8">No images uploaded yet.</p>
                )}
            </div>
        </div>
        </div>
    );
}
