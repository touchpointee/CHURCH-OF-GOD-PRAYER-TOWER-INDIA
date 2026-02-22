"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [previewThumbnail, setPreviewThumbnail] = useState('');

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await axios.get(`/api/videos/${id}`);
                if (res.data.success) {
                    const video = res.data.data;
                    reset({
                        title: video.title,
                        titleHi: video.titleHi || '',
                        titleMl: video.titleMl || '',
                        youtubeUrl: video.youtubeUrl,
                        thumbnailUrl: video.thumbnailUrl
                    });
                    setPreviewThumbnail(video.thumbnailUrl);
                }
            } catch (error) {
                console.error("Failed to fetch video", error);
                alert("Failed to load video data");
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id, reset]);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        let videoId = '';

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            videoId = match[2];
        }

        if (videoId) {
            const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            setPreviewThumbnail(thumb);
            setValue('thumbnailUrl', thumb);
        } else {
            setPreviewThumbnail('');
            setValue('thumbnailUrl', '');
        }
    };

    const onSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            await axios.patch(`/api/videos/${id}`, data);
            router.push('/admin/videos');
            router.refresh();
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update video");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/admin/videos" className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Videos
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Edit Video</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">YouTube URL</label>
                        <input
                            {...register('youtubeUrl', { required: true })}
                            onChange={(e) => {
                                register('youtubeUrl').onChange(e);
                                handleUrlChange(e);
                            }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none"
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                        {errors.youtubeUrl && <span className="text-red-500 text-xs">Required</span>}
                    </div>

                    <input type="hidden" {...register('thumbnailUrl')} />

                    {previewThumbnail && (
                        <div className="bg-gray-100 p-4 rounded-xl">
                            <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Thumbnail Preview</p>
                            <img src={previewThumbnail} alt="Preview" className="w-full rounded-lg shadow-sm" />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title (English)</label>
                        <input {...register('title', { required: true })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="Video Title" />
                        {errors.title && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title (Hindi)</label>
                        <input {...register('titleHi')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="हिंदी में शीर्षक" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title (Malayalam)</label>
                        <input {...register('titleMl')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent outline-none" placeholder="മലയാളത്തിൽ ശീർഷകം" />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : 'Update Video'}
                    </button>
                </form>
            </div>
        </div>
    );
}
