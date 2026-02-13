"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, Video, Image as ImageIcon, LogOut, Home, Info, History as HistoryIcon, Mail, Heart, FileText, X, CreditCard, HandHeart, MessageCircle } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Events', href: '/admin/events', icon: Calendar },
        { name: 'Videos', href: '/admin/videos', icon: Video },
        { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
        { name: 'About Us', href: '/admin/about', icon: Info },
        { name: 'History', href: '/admin/history', icon: HistoryIcon },
        { name: 'Contact', href: '/admin/contact', icon: Mail },
        { name: 'Prayer Requests', href: '/admin/prayer-requests', icon: HandHeart },
        { name: 'Statement of Faith', href: '/admin/statement-of-faith', icon: FileText },
        { name: 'Donation Settings', href: '/admin/donation', icon: CreditCard },
        { name: 'Social Media', href: '/admin/settings/social', icon: MessageCircle },
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col 
                fixed left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">A</div>
                        <span className="font-display font-bold text-xl text-gray-900">Admin Portal</span>
                    </div>
                    <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-900">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()} // Auto-close on mobile nav
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <Home size={20} />
                        View Website
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
