"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

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

  if (!whatsappUrl) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} strokeWidth={2} />
    </a>
  );
}
