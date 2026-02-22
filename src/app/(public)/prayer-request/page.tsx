"use client";

import { useState } from "react";
import axios from "axios";
import { Send, Heart, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrayerRequestPage() {
    const { t } = useLanguage();
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setSubmitStatus('submitting');
        try {
            await axios.post('/api/prayer-requests', data);
            setSubmitStatus('success');
            reset();
        } catch (error) {
            console.error("Failed to submit prayer request", error);
            setSubmitStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pt-20 pb-20">

            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border-t-4 border-accent">
                    {submitStatus === 'success' ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Send size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("prayerRequest.requestSent")}</h3>
                            <p className="text-gray-600 mb-8">{t("prayerRequest.thankYouRequest")}</p>
                            <button
                                onClick={() => setSubmitStatus('idle')}
                                className="text-accent font-bold hover:underline"
                            >
                                {t("prayerRequest.sendAnotherRequest")}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 text-center">{t("prayerRequest.howCanWePray")}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t("prayerRequest.nameOptional")}</label>
                                    <input
                                        {...register("name")}
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                        placeholder={t("prayerRequest.placeholderName")}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t("prayerRequest.phoneEmail")}</label>
                                    <input
                                        {...register("contact")}
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                        placeholder={t("prayerRequest.placeholderContact")}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t("prayerRequest.yourPrayerRequest")}</label>
                                <textarea
                                    {...register("message", { required: true })}
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                                    placeholder={t("prayerRequest.placeholderMessage")}
                                ></textarea>
                                {errors.message && <span className="text-red-500 text-sm">{t("prayerRequest.pleaseEnterRequest")}</span>}
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    {...register("isConfidential")}
                                    type="checkbox"
                                    id="private"
                                    className="rounded text-accent focus:ring-accent"
                                />
                                <label htmlFor="private" className="text-sm text-gray-600">{t("prayerRequest.keepConfidential")}</label>
                            </div>

                            <button
                                type="submit"
                                disabled={submitStatus === 'submitting'}
                                className="w-full bg-accent text-white font-bold py-4 rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitStatus === 'submitting' ? t("prayerRequest.sending") : (
                                    <>
                                        <Send size={18} /> {t("prayerRequest.submitRequest")}
                                    </>
                                )}
                            </button>
                            {submitStatus === 'error' && <p className="text-red-500 text-sm mt-2 text-center">{t("prayerRequest.failedToSubmit")}</p>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
