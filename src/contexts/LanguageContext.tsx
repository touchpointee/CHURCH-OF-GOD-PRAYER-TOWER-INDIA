"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import ml from "@/locales/ml.json";

const LOCALE_KEY = "NEXT_LANG";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export type Locale = "en" | "hi" | "ml";

const translations: Record<Locale, Record<string, string>> = { en, hi, ml };

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

interface LanguageContextType {
  lang: Locale;
  setLang: (lang: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getCookie(LOCALE_KEY);
    if (stored === "en" || stored === "hi" || stored === "ml") {
      setLangState(stored);
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((newLang: Locale) => {
    setLangState(newLang);
    setCookie(LOCALE_KEY, newLang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      if (!mounted) {
        const fallback = (translations.en as Record<string, string>)[key];
        return fallback ?? key;
      }
      const localeMap = translations[lang] ?? translations.en;
      const value = (localeMap as Record<string, string>)[key];
      if (value) return value;
      const enValue = (translations.en as Record<string, string>)[key];
      return enValue ?? key;
    },
    [lang, mounted]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
