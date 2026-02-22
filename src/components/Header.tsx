"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Facebook, Youtube, Instagram, Menu, X, ArrowRight, Globe
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Locale } from "@/contexts/LanguageContext";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ml", label: "മലയാളം" },
];

export default function Header() {
    const { lang, setLang, t } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
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
            <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
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
                            <h1 className="font-display font-bold text-base md:text-lg leading-tight text-gray-900 group-hover:text-accent transition-colors duration-300 uppercase tracking-tight">
                                CHURCH OF GOD<br />PRAYER TOWER INDIA
                            </h1>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex space-x-8 text-sm font-medium tracking-wide items-center">
                        {[
                            { key: 'nav.home', path: '/' },
                            { key: 'nav.aboutUs', path: null, isAbout: true },
                            { key: 'nav.history', path: '/history', hide: true },
                            { key: 'nav.events', path: '/events' },
                            { key: 'nav.videos', path: '/videos' },
                            { key: 'nav.gallery', path: '/gallery' },
                            { key: 'nav.contact', path: '/contact' },
                            { key: 'nav.prayerRequest', path: '/prayer-request' },
                        ].map((item) => {
                            if (item.isAbout) {
                                const isAboutActive = ['/about-us', '/history', '/statement-of-faith'].includes(pathname);
                                return (
                                    <div key={item.key} className="relative group h-full flex items-center">
                                        <button className={`flex items-center gap-1 transition-colors duration-300 py-2 focus:outline-none ${isAboutActive ? 'text-accent' : 'text-gray-600 hover:text-accent'}`}>
                                            {t(item.key)}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-4 h-4 transition-transform duration-300 group-hover:rotate-180"><path d="m6 9 6 6 6-6" /></svg>
                                        </button>
                                        <div className="absolute left-0 top-full pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[100]">
                                            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2">
                                                {[
                                                    { nameKey: 'nav.whoWeAre', href: '/about-us' },
                                                    { nameKey: 'nav.ourHistory', href: '/history' },
                                                    { nameKey: 'nav.statementOfFaith', href: '/statement-of-faith' }
                                                ].map((subItem) => {
                                                    const isSubActive = pathname === subItem.href;
                                                    return (
                                                        <Link
                                                            key={subItem.nameKey}
                                                            href={subItem.href}
                                                            className={`block px-6 py-3 text-sm transition-colors duration-200 ${isSubActive ? 'text-accent bg-gray-50 font-bold' : 'text-gray-600 hover:text-accent hover:bg-gray-50'}`}
                                                        >
                                                            {t(subItem.nameKey)}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            if (item.hide) return null;
                            const path = item.path!;
                            const isActive = pathname === path;
                            return (
                                <Link
                                    key={item.key}
                                    href={path}
                                    className={`relative transition-colors duration-300 py-2 group ${isActive ? 'text-accent' : 'text-gray-600 hover:text-accent'}`}
                                >
                                    {t(item.key)}
                                    <span className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                </Link>
                            );
                        })}
                        {/* Language Switcher - Church name stays English, only UI is translated */}
                        <div className="relative ml-2">
                            <button onClick={() => setIsLangOpen((v) => !v)} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors" aria-label="Language">
                                <Globe size={16} />
                                <span>{LOCALES.find((l) => l.code === lang)?.label ?? "English"}</span>
                            </button>
                            {isLangOpen && (
                                <>
                                    <div className="fixed inset-0 z-[99]" aria-hidden onClick={() => setIsLangOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-[100]">
                                        {LOCALES.map((l) => (
                                            <button key={l.code} onClick={() => { setLang(l.code); setIsLangOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${lang === l.code ? "text-accent font-medium bg-gray-50" : "text-gray-600"}`}>
                                                {l.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
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
                            <span className="font-display font-bold text-xl text-gray-900">{t("nav.menu")}</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-accent transition-colors">
                                <X size={28} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6 items-center justify-center flex-grow">
                            {[
                                { key: "nav.home", path: "/" },
                                { key: "nav.aboutUs", path: null, isAbout: true },
                                { key: "nav.history", path: "/history", hide: true },
                                { key: "nav.events", path: "/events" },
                                { key: "nav.videos", path: "/videos" },
                                { key: "nav.gallery", path: "/gallery" },
                                { key: "nav.contact", path: "/contact" },
                                { key: "nav.prayerRequest", path: "/prayer-request" },
                            ].map((item, idx) => {
                                if (item.hide) return null;
                                if (item.isAbout) {
                                    return (
                                        <div key={item.key} className="flex flex-col items-center w-full">
                                            <div className={`text-2xl font-display font-medium mb-2 ${["/about-us", "/history", "/statement-of-faith"].includes(pathname) ? "text-accent" : "text-gray-800"}`}>
                                                {t("nav.aboutUs")}
                                            </div>
                                            <div className="flex flex-col items-center gap-3 bg-gray-50/50 w-full py-4 rounded-xl">
                                                {[
                                                    { nameKey: "nav.whoWeAre", href: "/about-us" },
                                                    { nameKey: "nav.ourHistory", href: "/history" },
                                                    { nameKey: "nav.statementOfFaith", href: "/statement-of-faith" },
                                                ].map((subItem) => (
                                                    <Link
                                                        key={subItem.nameKey}
                                                        href={subItem.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={`text-lg font-medium hover:text-accent ${pathname === subItem.href ? "text-accent" : "text-gray-600"}`}
                                                    >
                                                        {t(subItem.nameKey)}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                                const path = item.path!;
                                return (
                                    <Link
                                        key={item.key}
                                        href={path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-2xl font-display font-medium transition-colors duration-300 ${pathname === path ? "text-accent" : "text-gray-800 hover:text-accent"}`}
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        {t(item.key)}
                                    </Link>
                                );
                            })}
                            <Link
                                href="/donate"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="mt-4 bg-accent text-white font-bold px-8 py-3 rounded-full hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 w-full max-w-xs text-center"
                            >
                                {t("nav.donateNow")}
                            </Link>
                            {/* Mobile Language Switcher */}
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                                {LOCALES.map((l) => (
                                    <button key={l.code} onClick={() => setLang(l.code)} className={`px-4 py-2 rounded-full text-sm font-medium border ${lang === l.code ? "bg-accent text-white border-accent" : "bg-white text-gray-700 border-gray-200"}`}>
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center gap-6 mt-2 text-gray-400">
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
