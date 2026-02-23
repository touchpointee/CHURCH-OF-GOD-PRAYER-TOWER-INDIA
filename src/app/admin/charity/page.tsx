"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, UploadCloud, Trash2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function CharityManager() {
    const [images, setImages] = useState<{ _id: string; imageUrl: string; title?: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await axios.get("/api/charity");
            if (res.data.success) setImages(res.data.data);
        } catch (error) {
            console.error("Failed to fetch charity images", error);
        } finally {
            setLoading(false);
        }
    };

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        setUploading(true);
        setUploadProgress({ current: 0, total: acceptedFiles.length });
        const formData = new FormData();
        acceptedFiles.forEach((f) => formData.append("file", f));
        try {
            const uploadRes = await axios.post("/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (uploadRes.data.success && uploadRes.data.uploads) {
                const savePromises = uploadRes.data.uploads.map(async (upload: any, index: number) => {
                    await axios.post("/api/charity", {
                        imageUrl: upload.url,
                        title: upload.filename,
                    });
                    setUploadProgress((prev) => ({ ...prev, current: prev.current + 1 }));
                });
                await Promise.all(savePromises);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Some files failed to upload.");
        } finally {
            setUploading(false);
            setUploadProgress({ current: 0, total: 0 });
            fetchImages();
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true,
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this image?")) return;
        try {
            await axios.delete(`/api/charity/${id}`);
            setImages((prev) => prev.filter((img) => img._id !== id));
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete image.");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900">Charity</h1>
                <p className="text-gray-500">Upload and manage charity images. They appear on the public Charity page.</p>
            </div>

            <div
                {...getRootProps()}
                className={`mb-12 border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                    isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-gray-300 hover:border-primary hover:bg-gray-50"
                }`}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <>
                        <Loader2 size={48} className="text-primary animate-spin mx-auto mb-4" />
                        <p className="text-lg font-bold text-gray-700">Uploading... {uploadProgress.current} of {uploadProgress.total}</p>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <UploadCloud size={32} />
                        </div>
                        <p className="text-xl font-bold text-gray-900">Drag & drop images here or click to browse</p>
                        <p className="text-gray-500 mt-2">Multiple images supported</p>
                    </>
                )}
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-4">Uploaded images ({images.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img) => (
                    <div key={img._id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                        <img src={img.imageUrl} alt={img.title || "Charity"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-end p-3 opacity-0 group-hover:opacity-100">
                            <button
                                onClick={() => handleDelete(img._id)}
                                className="bg-white p-1.5 rounded-full text-red-500 hover:bg-red-50 shadow-sm"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
                {images.length === 0 && <p className="col-span-full text-gray-400 text-center py-8">No images yet.</p>}
            </div>
        </div>
    );
}
