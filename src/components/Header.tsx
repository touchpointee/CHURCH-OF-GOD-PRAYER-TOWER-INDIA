"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Facebook, Youtube, Instagram, Menu, X, ArrowRight
} from "lucide-react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
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

    return (
        <div className="w-full font-sans">


            {/* Main Navbar */}
            <nav className="bg-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center space-x-4 group">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-accent/20">
                            <img
                                src="/logo.jpg"
                                alt="Church of God Prayer Tower India Logo"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="block ml-3">
                            <h1 className="font-display font-bold text-lg md:text-xl leading-none text-gray-900 group-hover:text-accent transition-colors duration-300">CHURCH OF GOD</h1>
                            <p className="text-[9px] md:text-[10px] tracking-[0.2em] text-accent uppercase font-medium mt-1">Prayer Tower India</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex space-x-8 text-sm font-medium tracking-wide">
                        {['Home', 'About Us', 'History', 'Events', 'Videos', 'Gallery', 'Contact', 'Prayer Request'].map((item) => {
                            if (item === 'About Us') {
                                const isAboutActive = ['/about-us', '/history', '/statement-of-faith'].includes(pathname);
                                return (
                                    <div key={item} className="relative group h-full flex items-center">
                                        <button className={`flex items-center gap-1 transition-colors duration-300 py-2 focus:outline-none ${isAboutActive ? 'text-accent' : 'text-gray-600 hover:text-accent'}`}>
                                            {item}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-4 h-4 transition-transform duration-300 group-hover:rotate-180"><path d="m6 9 6 6 6-6" /></svg>
                                        </button>
                                        {/* Dropdown Menu */}
                                        <div className="absolute left-0 top-full pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[100]">
                                            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2">
                                                {[
                                                    { name: 'Who We Are', href: '/about-us' },
                                                    { name: 'Our History', href: '/history' },
                                                    { name: 'Statement of Faith', href: '/statement-of-faith' }
                                                ].map((subItem) => {
                                                    const isSubActive = pathname === subItem.href;
                                                    return (
                                                        <Link
                                                            key={subItem.name}
                                                            href={subItem.href}
                                                            className={`block px-6 py-3 text-sm transition-colors duration-200 ${isSubActive ? 'text-accent bg-gray-50 font-bold' : 'text-gray-600 hover:text-accent hover:bg-gray-50'}`}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            if (item === 'History') return null;

                            const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`;
                            const isActive = pathname === path;

                            return (
                                <Link
                                    key={item}
                                    href={path}
                                    className={`relative transition-colors duration-300 py-2 group ${isActive ? 'text-accent' : 'text-gray-600 hover:text-accent'}`}
                                >
                                    {item}
                                    <span className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-gray-900 hover:text-accent transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`lg:hidden fixed inset-0 z-[60] bg-white/95 backdrop-blur-md transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
                    <div className="flex flex-col min-h-full p-6">
                        <div className="flex justify-between items-center mb-10">
                            <span className="font-display font-bold text-xl text-gray-900">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-accent transition-colors">
                                <X size={28} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6 items-center justify-center flex-grow">
                            {['Home', 'About Us', 'History', 'Events', 'Videos', 'Gallery', 'Contact', 'Prayer Request'].map((item, idx) => {
                                if (item === 'History') return null; // Remove duplicate History from top level

                                if (item === 'About Us') {
                                    return (
                                        <div key={item} className="flex flex-col items-center w-full">
                                            <div className={`text-2xl font-display font-medium mb-2 ${['/about-us', '/history', '/statement-of-faith'].includes(pathname) ? 'text-accent' : 'text-gray-800'}`}>
                                                About Us
                                            </div>
                                            <div className="flex flex-col items-center gap-3 bg-gray-50/50 w-full py-4 rounded-xl">
                                                {[
                                                    { name: 'Who We Are', href: '/about-us' },
                                                    { name: 'Our History', href: '/history' },
                                                    { name: 'Statement of Faith', href: '/statement-of-faith' }
                                                ].map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={`text-lg font-medium hover:text-accent ${pathname === subItem.href ? 'text-accent' : 'text-gray-600'}`}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item}
                                        href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-2xl font-display font-medium transition-colors duration-300 ${pathname === (item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`) ? 'text-accent' : 'text-gray-800 hover:text-accent'}`}
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        {item}
                                    </Link>
                                )
                            })}
                            <Link
                                href="/donate"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="mt-4 bg-accent text-white font-bold px-8 py-3 rounded-full hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 w-full max-w-xs text-center"
                            >
                                Donate Now
                            </Link>
                        </div>

                        <div className="flex justify-center gap-6 mt-8 text-gray-400">
                            {socialUrls.facebookUrl && <a href={socialUrls.facebookUrl} target="_blank" className="hover:text-accent"><Facebook size={20} /></a>}
                            {socialUrls.youtubeUrl && <a href={socialUrls.youtubeUrl} target="_blank" className="hover:text-accent"><Youtube size={20} /></a>}
                            {socialUrls.instagramUrl && <a href={socialUrls.instagramUrl} target="_blank" className="hover:text-accent"><Instagram size={20} /></a>}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
