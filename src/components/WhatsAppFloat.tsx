"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MessageCircle, MapPin } from "lucide-react";

export default function WhatsAppFloat() {
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const res = await fetch("/api/settings/social");
        const data = await res.json();
        if (data.success && data.data?.whatsappUrl?.trim()) {
          let url = data.data.whatsappUrl.trim();
          if (!url.startsWith("http")) url = `https://${url}`;
          if (!url.includes("wa.me") && !url.includes("whatsapp.com")) {
            const num = url.replace(/\D/g, "");
            if (num) url = `https://wa.me/${num}`;
          }
          setWhatsappUrl(url);
        }
      } catch (err) {
        console.error("Failed to load WhatsApp link", err);
      }
    };
    fetchSocial();
  }, []);

  useEffect(() => {
    const fetchMapUrl = async () => {
      try {
        const res = await fetch("/api/contact/locations");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const firstWithMap = data.data.find((loc: { mapUrl?: string }) => loc.mapUrl?.trim());
          if (firstWithMap?.mapUrl?.trim()) {
            let url = firstWithMap.mapUrl.trim();
            if (!url.startsWith("http")) url = `https://${url}`;
            setMapUrl(url);
          }
        }
      } catch (err) {
        console.error("Failed to load map link", err);
      }
    };
    fetchMapUrl();
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Floating button: open maps directly, or contact page if no map URL */}
      {mapUrl ? (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Open location in maps"
        >
          <MapPin size={28} strokeWidth={2} />
        </a>
      ) : (
        <Link
          href="/contact"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Find us / Contact"
        >
          <MapPin size={28} strokeWidth={2} />
        </Link>
      )}
      {/* WhatsApp button */}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={28} strokeWidth={2} />
        </a>
      )}
    </div>
  );
}
