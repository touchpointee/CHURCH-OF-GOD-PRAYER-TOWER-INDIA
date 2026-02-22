"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto">
                <h1 className="text-9xl font-display font-bold text-primary opacity-20">404</h1>
                <div className="relative -mt-16">
                    <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">{t("notFound.pageNotFound")}</h2>
                    <p className="text-gray-600 mb-8 text-lg">{t("notFound.oops")}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/" className="flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
                            <Home size={20} /> {t("notFound.goHome")}
                        </Link>
                        <button onClick={() => window.history.back()} className="flex items-center justify-center gap-2 bg-white text-gray-700 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-all border border-gray-200">
                            <ArrowLeft size={20} /> {t("notFound.goBack")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
