"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function DonateSection() {
    return (
        <section className="relative py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="max-w-2xl mx-auto"
                >
                    <Heart className="w-12 h-12 text-amber-500 mx-auto mb-8 stroke-1" />

                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-8 leading-tight">
                        Generosity is <br />
                        <span className="italic font-light text-stone-400">Worship.</span>
                    </h2>

                    <p className="text-stone-500 text-lg mb-12 font-light leading-relaxed">
                        Your giving empowers us to serve our city and share the message of hope. Join us in making a tangible difference.
                    </p>

                    <Link
                        href="/give"
                        className="inline-block px-12 py-5 bg-stone-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-amber-600 transition-all duration-300"
                    >
                        Give Online
                    </Link>

                    <div className="mt-12 flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Trust badges placeholders */}
                        <div className="h-8 w-24 bg-stone-200 rounded"></div>
                        <div className="h-8 w-24 bg-stone-200 rounded"></div>
                        <div className="h-8 w-24 bg-stone-200 rounded"></div>
                    </div>
                </motion.div>
            </div>
            {/* Minimalist Background Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-stone-200 to-transparent"></div>
        </section>
    );
}
