"use client";

import { ZoomIn, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CharityPage() {
    const { t } = useLanguage();
    const [images, setImages] = useState<{ _id: string; imageUrl: string; title?: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<{ _id: string; imageUrl: string; title?: string } | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch("/api/charity");
                const data = await res.json();
                if (data.success) setImages(data.data);
            } catch (error) {
                console.error("Failed to load charity images", error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">{t("charity.loading")}</div>;

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">{t("charity.title")}</h1>
                    <p className="text-gray-500">{t("charity.subtitle")}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <div
                            key={img._id}
                            className="group relative rounded-xl overflow-hidden shadow-md bg-gray-100 aspect-[4/5] sm:aspect-square cursor-pointer"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={img.imageUrl}
                                alt={img.title || t("charity.imageAlt")}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white">
                                    <ZoomIn size={24} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && !loading && (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("charity.noImages")}</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">{t("charity.empty")}</p>
                        </div>
                    )}
                </div>
            </div>

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
                            className="absolute top-6 right-6 text-white hover:text-gray-300 z-[101]"
                            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
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
                                alt={selectedImage.title || t("charity.imageAlt")}
                                className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
