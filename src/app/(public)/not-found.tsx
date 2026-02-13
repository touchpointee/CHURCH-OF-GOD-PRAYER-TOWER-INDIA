"use client";

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto">
                <h1 className="text-9xl font-display font-bold text-primary opacity-20">404</h1>
                <div className="relative -mt-16">
                    <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Page Not Found</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Oops! The page you represent looking for seems to have gone on a pilgrimage. It might have been moved or doesn't exist.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-primary/20"
                        >
                            <Home size={20} /> Go Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 bg-white text-gray-700 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-all border border-gray-200"
                        >
                            <ArrowLeft size={20} /> Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
