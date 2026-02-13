"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Play } from "lucide-react";

export default function CharitySection() {
    return (
        <section className="relative py-32 bg-stone-900 text-white overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Image Area */}
                    <Link href="/charity" className="block flex-1 relative w-full group cursor-pointer overflow-hidden">
                        <div className="relative aspect-video w-full overflow-hidden bg-stone-800">
                            <img
                                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop"
                                alt="Charity Work"
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                            />
                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Play className="w-8 h-8 fill-white ml-1" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Content Area */}
                    <div className="flex-1 lg:pl-10">
                        <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs mb-6 block">Outreach</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                            Hands and Feet <br /> of Jesus.
                        </h2>
                        <p className="text-stone-400 text-lg mb-10 font-light leading-relaxed">
                            From local food drives to global mission trips, we are committed to serving those in need. See how we are making an impact.
                        </p>

                        <div className="flex gap-8">
                            <div className="flex flex-col">
                                <span className="text-3xl font-serif font-bold text-white mb-1">12K</span>
                                <span className="text-xs text-stone-500 uppercase tracking-widest">Lives Impacted</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-serif font-bold text-white mb-1">$2M</span>
                                <span className="text-xs text-stone-500 uppercase tracking-widest">Given Away</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
