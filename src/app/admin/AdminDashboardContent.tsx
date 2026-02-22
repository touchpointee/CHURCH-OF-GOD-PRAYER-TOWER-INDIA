"use client";

import Link from "next/link";
import { Calendar, Video, Image as ImageIcon, ChevronRight, Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AdminDashboardContentProps {
  counts: { events: number; videos: number; gallery: number };
  recent: any[];
}

export default function AdminDashboardContent({ counts, recent }: AdminDashboardContentProps) {
  const { t } = useLanguage();
  const cards = [
    { titleKey: "admin.totalEvents", value: counts.events, icon: Calendar, color: "bg-blue-500", href: "/admin/events" },
    { titleKey: "admin.totalVideos", value: counts.videos, icon: Video, color: "bg-purple-500", href: "/admin/videos" },
    { titleKey: "admin.galleryImages", value: counts.gallery, icon: ImageIcon, color: "bg-emerald-500", href: "/admin/gallery" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">{t("admin.dashboard")}</h1>
        <p className="text-gray-500">{t("admin.welcomeBack")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.titleKey} href={card.href} className="block group">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{t(card.titleKey)}</p>
                  <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${card.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Activity size={20} className="text-primary" />
          {t("admin.recentEventsAdded")}
        </h2>
        <div className="space-y-4">
          {recent.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">{t("admin.noEventsYet")}</p>
          ) : (
            recent.map((event: any) => (
              <div key={event._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                <div>
                  <h4 className="font-bold text-gray-900">{event.title}</h4>
                  <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()} • {event.category}</p>
                </div>
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link href="/admin/events" className="text-primary text-sm font-bold hover:underline inline-flex items-center gap-1">
            {t("admin.viewAllEvents")} <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
