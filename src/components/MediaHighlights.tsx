"use client";

import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import Link from "next/link";

const videos = [
    { title: "Sunday Service", thumbnail: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=2670&auto=format&fit=crop" },
    { title: "Worship Highlights", thumbnail: "https://images.unsplash.com/photo-1507692049790-de58294a4752?q=80&w=2670&auto=format&fit=crop" },
    { title: "Sermon Series", thumbnail: "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=2670&auto=format&fit=crop" },
    { title: "Guest Speaker", thumbnail: "https://images.unsplash.com/photo-1544427920-ca14a224c3e3?q=80&w=2670&auto=format&fit=crop" }
];

export default function MediaHighlights() {
    return (
        <section className="bg-black py-20 overflow-hidden">
            <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
                <div>
                    <span className="text-red-500 font-bold tracking-widest uppercase text-sm mb-2 block">Watch Online</span>
                    <h2 className="text-4xl text-white font-serif font-bold">Latest Sermons</h2>
                </div>
                <Link href="/videos" className="hidden md:flex items-center text-white/70 hover:text-white transition-colors">
                    View All Videos <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
            </div>

            <div className="flex gap-1 px-6">
                {videos.map((video, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative flex-1 aspect-video min-w-[300px] group cursor-pointer overflow-hidden rounded-lg bg-gray-900"
                    >
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                <Play size={20} fill="currentColor" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black to-transparent">
                            <h3 className="text-white font-bold truncate">{video.title}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
