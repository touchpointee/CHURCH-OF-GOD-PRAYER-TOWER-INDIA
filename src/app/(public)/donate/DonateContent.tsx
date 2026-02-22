"use client";

import { Heart, Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DonateContentProps {
  donation: any;
}

export default function DonateContent({ donation }: DonateContentProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqQCCCiU4Q7ntxH2de2l_N2gIFtNVVIG_F8KorgGzU224bcTCB04y5NoiajlT3skCpFXkoUyjy8ME1CB0opXeXsS_I2OIzGZfhbfq6dxPCZpc1P-0AzcQMZ_TM1JJ176l44uoAWEMCOMS4ZrnYatCLBj7LVxQZtGxwjOVdy4VaQW3-0XAeiIigzEHh3uO8ldg6UPjUV1Apxnm3v1n7WGj1gV80NpGWnyB-XMJGi4jfL_JZtFV2-4qAu4jZVfM7bfjjfxHkIFmrHeo" alt={t("donate.giving")} className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-gray-100 rounded-full px-4 py-1 mb-6">
            <span className="text-accent font-bold uppercase tracking-wider text-xs">{t("donate.giving")}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">{t("donate.generosityChangesLives")}</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            &quot;{t("donate.scriptureQuote")}&quot; <br /> <span className="text-sm opacity-70 mt-2 block">- 2 Corinthians 9:7</span>
          </p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">{t("donate.waysToGive")}</h2>
            <p className="text-gray-500">{t("donate.chooseConvenient")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-primary/20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Heart size={100} className="text-accent" />
              </div>
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10">
                <Gift size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10 text-gray-900">{t("donate.bankTransfer")}</h3>
              <p className="text-gray-500 text-sm mb-6 relative z-10">{t("donate.bankTransferDesc")}</p>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm relative z-10 border border-gray-100">
                {donation ? (
                  <>
                    <div className="flex justify-between flex-wrap gap-2">
                      <span className="text-gray-500">{t("donate.accountName")}:</span>
                      <span className="font-bold text-gray-900 text-right">{donation.accountName}</span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-2">
                      <span className="text-gray-500">{t("donate.accountNo")}:</span>
                      <span className="font-bold text-gray-900 font-mono text-right">{donation.accountNumber}</span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-2">
                      <span className="text-gray-500">{t("donate.ifscCode")}:</span>
                      <span className="font-bold text-gray-900 font-mono text-right">{donation.ifscCode}</span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-2">
                      <span className="text-gray-500">{t("donate.bank")}:</span>
                      <span className="font-bold text-gray-900 text-right">{donation.bankName}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-400 italic">{t("donate.bankDetailsPending")}</p>
                )}
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 17h4.01M16 3h4.01M12 3c-1.25 0-2.5 1-2.5 2.5v13C9.5 19 10.75 20 12 20h8c1.25 0 2.5-1 2.5-2.5V5.5C22.5 4 21.25 3 20 3h-8z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{t("donate.qrCodeUpi")}</h3>
              <p className="text-gray-500 text-sm mb-6">{t("donate.scanQrCodeDesc")}</p>
              <div className="w-56 h-56 sm:w-64 sm:h-64 bg-gray-50 mx-auto rounded-lg flex items-center justify-center mb-4 border border-gray-100 p-2">
                {donation && donation.qrCodeUrl ? (
                  <img src={donation.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain rounded" />
                ) : (
                  <span className="text-xs text-center text-gray-400">QR Code Here</span>
                )}
              </div>
              <p className="text-xs font-mono bg-gray-100 py-2 rounded text-gray-500">{t("donate.scanToPay")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
