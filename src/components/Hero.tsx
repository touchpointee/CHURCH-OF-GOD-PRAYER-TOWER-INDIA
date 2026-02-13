"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center bg-gray-50">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero-final.png"
                    alt="Prayer Tower Sanctuary"
                    className="w-full h-full object-cover animate-slow-zoom"
                />
                {/* Light Gradient Overlay for Text Readability - Kept for image depth but reduced opacity since no text */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
            </div>

            {/* Content Removed as per request */}
        </section>
    );
}
