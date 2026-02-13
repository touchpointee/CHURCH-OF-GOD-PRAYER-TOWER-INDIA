"use client";

import { ZoomIn, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImagesPage() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<any>(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch('/api/gallery');
                const data = await res.json();
                if (data.success) {
                    setImages(data.data);
                }
            } catch (error) {
                console.error("Failed to load images", error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="container mx-auto px-4 py-12">
                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img: any) => (
                        <div
                            key={img._id}
                            className="group relative rounded-xl overflow-hidden shadow-md bg-gray-100 aspect-[4/5] sm:aspect-square cursor-pointer"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={img.imageUrl}
                                alt={img.title}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white">
                                    <ZoomIn size={24} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && !loading && (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 shadow-sm">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <ZoomIn size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Gallery Images</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">Our gallery is currently empty. We'll be adding beautiful moments from our church life soon.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[101]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                        >
                            <X size={40} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-full max-h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.imageUrl}
                                alt={selectedImage.title}
                                className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
