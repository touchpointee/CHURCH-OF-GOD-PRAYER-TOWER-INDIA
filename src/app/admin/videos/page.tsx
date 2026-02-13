"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, ExternalLink, Play } from 'lucide-react';
import axios from 'axios';

export default function VideosManager() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await axios.get('/api/videos');
            if (res.data.success) {
                setVideos(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch videos', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this video?')) return;

        try {
            const res = await axios.delete(`/api/videos/${id}`);
            if (res.data.success) {
                // Remove from state
                setVideos(videos.filter((v: any) => v._id !== id));
            } else {
                alert('Failed to delete video');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('Error deleting video');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Videos</h1>
                    <p className="text-gray-500">Manage your video sermons and content.</p>
                </div>
                <Link
                    href="/admin/videos/new"
                    className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 w-full md:w-auto"
                >
                    <Plus size={20} />
                    Add New Video
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video: any) => (
                    <div key={video._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                        <div className="relative aspect-video bg-gray-100">
                            {/* Thumbnail placeholder if not present */}
                            {video.thumbnailUrl ? (
                                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Play size={40} />
                                </div>
                            )}
                            <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-primary transition-colors">
                                <ExternalLink size={16} />
                            </a>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">

                                <button onClick={() => handleDelete(video._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{video.title}</h3>
                            <p className="text-gray-500 text-xs">{new Date(video.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
                {videos.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No videos found.
                    </div>
                )}
            </div>
        </div>
    );
}
