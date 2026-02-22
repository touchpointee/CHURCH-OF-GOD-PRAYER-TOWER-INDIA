"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DonateSection() {
    const { t } = useLanguage();
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
                        {t("donateSection.generosityIsWorship")}
                    </h2>

                    <p className="text-stone-500 text-lg mb-12 font-light leading-relaxed">
                        {t("donateSection.paragraph")}
                    </p>

                    <Link
                        href="/donate"
                        className="inline-block px-12 py-5 bg-stone-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-amber-600 transition-all duration-300"
                    >
                        {t("donateSection.giveOnline")}
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
