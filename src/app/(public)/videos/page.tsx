"use client";

import { Play, Clock, Share2, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function VideosPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [featuredVideo, setFeaturedVideo] = useState<any>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch('/api/videos');
                const data = await res.json();
                if (data.success) {
                    setVideos(data.data);
                    if (data.data.length > 0) {
                        setFeaturedVideo(data.data[0]); // Feature the latest video
                    }
                }
            } catch (error) {
                console.error("Failed to load videos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);



    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const featured = featuredVideo || {
        title: "No Videos Available",
        description: "Please check back later.",
        thumbnailUrl: "https://via.placeholder.com/1920x1080"
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            {/* HEADER HERO */}
            <header className="relative bg-black h-[60vh] overflow-hidden">
                <div className="absolute inset-0 opacity-60">
                    <img
                        alt="Background"
                        className="w-full h-full object-cover"
                        src={featured.thumbnailUrl || featured.thumbnail}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="container mx-auto px-4 h-full flex items-end pb-16 relative z-10">
                    <div className="max-w-3xl">
                        <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-sm mb-4 inline-block uppercase tracking-wider">Featured Video</span>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-tight">{featured.title}</h1>
                        <p className="text-gray-200 text-lg mb-8 line-clamp-2 max-w-2xl">{featured.description}</p>
                        <div className="flex gap-4">
                            <a href={featured.youtubeUrl} target="_blank" className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition flex items-center gap-2">
                                <Play size={20} fill="currentColor" /> Watch Now
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="container mx-auto px-4 py-12">


                {/* Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.length > 0 ? (
                        videos.map((video: any) => (
                            <div key={video._id} className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
                                {/* Thumbnail */}
                                <a href={video.youtubeUrl} target="_blank" className="relative aspect-video block">
                                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-110 transition-all duration-300 shadow-xl">
                                            <Play size={24} className="text-accent ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                </a>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">

                                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {new Date(video.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">{video.title}</h3>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Play size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Videos Available</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">We haven't uploaded any videos yet. Check back soon for new sermons and content.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
