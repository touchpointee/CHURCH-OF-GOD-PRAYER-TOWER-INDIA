"use client";

import {
    Facebook, Instagram, Youtube, Mail, Phone, MapPin,
    ArrowRight, ChevronRight, Camera, AtSign
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
    const [socialUrls, setSocialUrls] = useState({ facebookUrl: '', youtubeUrl: '', instagramUrl: '' });

    useEffect(() => {
        const fetchSocials = async () => {
            try {
                const res = await fetch('/api/settings/social');
                const data = await res.json();
                if (data.success && data.data) {
                    setSocialUrls(data.data);
                }
            } catch (error) {
                console.error("Failed to load social settings", error);
            }
        };
        fetchSocials();
    }, []);

    const socialLinks = [
        { icon: Facebook, url: socialUrls.facebookUrl },
        { icon: Youtube, url: socialUrls.youtubeUrl },
        { icon: Instagram, url: socialUrls.instagramUrl },
    ].filter(s => s.url);

    return (
        <footer className="bg-primary text-white pt-16 pb-8 border-t border-accent/20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="h-16 w-16 bg-white flex items-center justify-center p-1 rounded-full border border-accent/30 shadow-lg shadow-black/20 overflow-hidden">
                                <img
                                    src="/logo.jpg"
                                    alt="Footer Logo"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-white text-xl leading-none">CHURCH OF GOD</h4>
                                <span className="text-[10px] text-accent uppercase tracking-[0.2em] font-medium block mt-1">Prayer Tower India</span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed font-sans max-w-xs">
                            A place where prayers are lifted up for your needs. We are dedicated to serving the community and spreading the message of love and hope.
                        </p>
                        <div className="flex space-x-3 pt-2">
                            {socialLinks.map((item, i) => (
                                <a key={i} href={item.url} target="_blank" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all duration-300 text-gray-400 group">
                                    <item.icon size={16} className="group-hover:scale-110 transition-transform duration-300" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h5 className="text-white font-display font-bold text-lg mb-8 relative inline-block">
                            Explore
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
                        </h5>
                        <ul className="space-y-4 text-sm text-gray-400 font-sans">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About Us', path: '/about-us' },
                                { name: 'Our History', path: '/history' },
                                { name: 'Statement of Faith', path: '/statement-of-faith' },
                                { name: 'Events', path: '/events' },
                                { name: 'Contact Us', path: '/contact' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.path} className="hover:text-accent flex items-center transition-all duration-300 group">
                                        <ChevronRight size={14} className="mr-2 text-accent/50 group-hover:text-accent transition-colors" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h5 className="text-white font-display font-bold text-lg mb-8 relative inline-block">
                            Connect
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
                        </h5>
                        <ul className="space-y-4 text-sm text-gray-400 font-sans">
                            {[
                                { name: 'Gallery', path: '/gallery' },
                                { name: 'Videos', path: '/videos' },
                                { name: 'Prayer Request', path: '/prayer-request' },
                                { name: 'Donate', path: '/donate' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.path} className="hover:text-accent flex items-center transition-all duration-300 group">
                                        <ChevronRight size={14} className="mr-2 text-accent/50 group-hover:text-accent transition-colors" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Stay Informed */}
                    <div>
                        <h5 className="text-white font-display font-bold text-lg mb-8 relative inline-block">
                            Stay Informed
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
                        </h5>
                        <p className="text-gray-400 text-sm mb-6 font-sans">Sign up for our newsletter and receive the latest updates.</p>
                        <form className="flex mb-8 relative">
                            <input
                                className="bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg w-full focus:ring-1 focus:ring-accent focus:border-accent text-sm py-3 px-4 outline-none transition-all"
                                placeholder="Enter your email"
                                type="email"
                            />
                            <button className="absolute right-1 top-1 bottom-1 bg-accent text-white rounded-md px-3 hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20">
                                <ArrowRight size={16} />
                            </button>
                        </form>
                        <div className="space-y-4 text-sm text-gray-400 font-sans">
                            <div className="flex items-start group">
                                <div className="p-2 bg-white/5 rounded-full mr-3 group-hover:bg-accent/10 transition-colors">
                                    <Phone size={16} className="text-accent" />
                                </div>
                                <span className="mt-1">+91 9747555678</span>
                            </div>
                            <div className="flex items-start group">
                                <div className="p-2 bg-white/5 rounded-full mr-3 group-hover:bg-accent/10 transition-colors">
                                    <Mail size={16} className="text-accent" />
                                </div>
                                <span className="mt-1">prayer@cogindia.org</span>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-sans">
                    <p>© 2026 Church of God Prayer Tower India. All Rights Reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-accent transition-colors">Terms & Conditions</a>
                        <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-accent transition-colors">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
