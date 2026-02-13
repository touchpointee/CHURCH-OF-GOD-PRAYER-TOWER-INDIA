"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";


const events = [
    {
        id: 1,
        title: "Worship Night",
        date: "FEB 20",
        location: "Main Sanctuary",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Youth Camp",
        date: "MAR 15",
        location: "Camp Ground",
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2670&auto=format&fit=crop"
    }
];

export default function EventsPreview() {
    return (
        <section className="relative bg-stone-900 py-32 overflow-hidden text-white">
            <div className="container mx-auto px-6 mb-16 flex items-end justify-between">
                <div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Gatherings</h2>
                    <p className="text-stone-400 max-w-md font-light">Join us for worship, community, and deeper connection.</p>
                </div>
                <Link href="/events" className="hidden md:flex items-center text-amber-500 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">
                    View Calendar <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-12 snap-x snap-mandatory scrollbar-hide">
                {events.map((event) => (
                    <div key={event.id} className="relative flex-none w-[90vw] md:w-[400px] snap-center group cursor-pointer">
                        {/* Image Container */}
                        <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-stone-800">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                            />
                            {/* Date Overlay - Editorial Style */}
                            <div className="absolute top-0 right-0 p-6 flex flex-col items-center border-l border-b border-white/10 bg-stone-900/50 backdrop-blur-md">
                                <span className="text-3xl font-serif font-bold italic">20</span>
                                <span className="text-[10px] uppercase tracking-widest mt-1">Feb</span>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="pr-4 border-l border-amber-500 pl-6 transition-all duration-300 group-hover:border-l-4">
                            <span className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-2 block">{event.location}</span>
                            <h3 className="text-3xl font-serif font-bold text-white mb-2 leading-none group-hover:text-amber-500 transition-colors">{event.title}</h3>
                            <div className="flex items-center text-stone-500 text-sm mt-3 group-hover:text-white transition-colors">
                                <span className="mr-2">Learn More</span> <ArrowRight size={12} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Background Texture */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("/grain.png")' }}></div>
        </section>
    );
}
