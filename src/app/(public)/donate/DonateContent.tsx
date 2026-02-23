"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink } from "lucide-react";

interface DonationPoster {
  _id: string;
  title?: string;
  imageUrl: string;
  paymentLink: string;
  order: number;
}

interface DonateContentProps {
  posters: DonationPoster[];
}

export default function DonateContent({ posters }: DonateContentProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqQCCCiU4Q7ntxH2de2l_N2gIFtNVVIG_F8KorgGzU224bcTCB04y5NoiajlT3skCpFXkoUyjy8ME1CB0opXeXsS_I2OIzGZfhbfq6dxPCZpc1P-0AzcQMZ_TM1JJ176l44uoAWEMCOMS4ZrnYatCLBj7LVxQZtGxwjOVdy4VaQW3-0XAeiIigzEHh3uO8ldg6UPjUV1Apxnm3v1n7WGj1gV80NpGWnyB-XMJGi4jfL_JZtFV2-4qAu4jZVfM7bfjjfxHkIFmrHeo"
            alt={t("donate.giving")}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-gray-100 rounded-full px-4 py-1 mb-6">
            <span className="text-accent font-bold uppercase tracking-wider text-xs">
              {t("donate.giving")}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            {t("donate.generosityChangesLives")}
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            &quot;{t("donate.scriptureQuote")}&quot; <br />{" "}
            <span className="text-sm opacity-70 mt-2 block">{t("donate.scriptureRef")}</span>
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              {t("donate.waysToGive")}
            </h2>
            <p className="text-gray-500">{t("donate.chooseConvenient")}</p>
          </div>

          {posters.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">{t("donate.noOptionsYet")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posters.map((poster) => (
                <div
                  key={poster._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={poster.imageUrl}
                      alt={poster.title || t("donate.donate")}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    {poster.title && (
                      <h3 className="font-bold text-gray-900 mb-3">{poster.title}</h3>
                    )}
                    <a
                      href={poster.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-accent text-white font-bold py-3 px-6 rounded-full hover:bg-accent-hover transition-colors"
                    >
                      {t("donate.payOrDonate")}
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
