"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
    return (
        <section className="relative w-full py-32 bg-stone-50 overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row items-center relative">

                    {/* Text Content - Floating Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="lg:w-1/2 z-10 lg:pr-20 mb-16 lg:mb-0"
                    >
                        <span className="text-amber-600 font-bold tracking-[0.2em] uppercase text-xs mb-6 block font-sans">Our Mission</span>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif mb-8 text-stone-900 leading-none">
                            LOVING <br />
                            <span className="text-stone-400">GOD,</span> <br />
                            LOVING <br />
                            <span className="text-stone-400">PEOPLE.</span>
                        </h2>
                        <div className="w-20 h-1 bg-amber-500 mb-10" />

                        <p className="text-xl text-stone-600 mb-8 leading-relaxed font-light font-sans max-w-md">
                            We are a family of believers united by grace, driven by love, and committed to making a difference.
                        </p>

                        <a href="/about" className="group inline-flex items-center text-stone-900 font-bold uppercase tracking-widest text-sm hover:text-amber-600 transition-colors">
                            Read Our Story
                            <span className="ml-2 w-8 h-[1px] bg-stone-900 group-hover:bg-amber-600 transition-colors" />
                        </a>
                    </motion.div>

                    {/* Image Composition - Broken Grid Right */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "circOut" }}
                        className="lg:w-3/5 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2"
                    >
                        <div className="relative aspect-[3/4] md:aspect-[16/9] lg:aspect-[4/3] w-full">
                            <img
                                src="https://images.unsplash.com/photo-1544427920-ca14a224c3e3?q=80&w=2574&auto=format&fit=crop"
                                alt="Community gathering"
                                className="w-full h-full object-cover shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
                            />
                            {/* Decorative Block */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-stone-900 -z-10" />
                            <div className="absolute top-10 right-10 w-20 h-20 border border-white/30 z-20" />
                        </div>
                    </motion.div>

                </div>

                {/* Statistics - Brutalist Footer */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-32 pt-16 border-t border-stone-200">
                    {[
                        { label: "Founded", value: "1994" },
                        { label: "Members", value: "5K+" },
                        { label: "Ministries", value: "50+" },
                        { label: "Nations", value: "12" }
                    ].map((stat) => (
                        <div key={stat.label} className="flex flex-col">
                            <span className="text-5xl font-serif font-bold text-stone-300 mb-2">{stat.value}</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-900">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
