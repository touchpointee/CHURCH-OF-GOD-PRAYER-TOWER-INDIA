"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
    const { t, lang } = useLanguage();
    const [locations, setLocations] = useState<any[]>([]);
    const [contactInfo, setContactInfo] = useState<{ contactEmails: string[]; contactPhones: string[] }>({ contactEmails: [], contactPhones: [] });
    const [loading, setLoading] = useState(true);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axios.get(`/api/contact/locations?lang=${lang}`);
                if (res.data.success) {
                    setLocations(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch locations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, [lang]);

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const res = await axios.get('/api/settings/social');
                if (res.data.success && res.data.data) {
                    const d = res.data.data;
                    setContactInfo({
                        contactEmails: Array.isArray(d.contactEmails) ? d.contactEmails : (d.contactEmail ? [d.contactEmail] : []),
                        contactPhones: Array.isArray(d.contactPhones) ? d.contactPhones : (d.contactPhone ? [d.contactPhone] : []),
                    });
                }
            } catch (error) {
                console.error("Failed to fetch contact info", error);
            }
        };
        fetchContactInfo();
    }, []);

    const onSubmit = async (data: any) => {
        setSubmitStatus('submitting');
        try {
            await axios.post('/api/contact/messages', data);
            setSubmitStatus('success');
            reset();
        } catch (error) {
            console.error("Failed to send message", error);
            setSubmitStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Content: address first, then send message form below */}
            <div className="container mx-auto px-4 py-16 relative z-20">
                <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                    {/* Contact Info / Address Box */}
                    <div className="bg-gray-50 text-gray-900 p-10 md:p-14 rounded-3xl shadow-2xl border border-gray-100">
                        <div>
                            <h2 className="text-3xl font-display font-bold mb-6 text-gray-900">{t("contact.title")}</h2>
                            <p className="text-gray-500 mb-10">{t("contact.subtitle")}</p>

                            <div className="space-y-8">
                                {locations.map((location) => (
                                    <div key={location._id} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-gray-900 uppercase tracking-widest mb-2 border-b border-gray-100 pb-2">{location.name}</h4>
                                        <p className="text-gray-600 mb-1 font-medium">{location.address}</p>
                                        {location.details && (
                                            <div className="text-sm text-gray-500 space-y-1 mt-3 whitespace-pre-wrap">
                                                {location.details}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {locations.length === 0 && !loading && (
                                    <p className="text-gray-500 italic">{t("contact.noLocationDetails")}</p>
                                )}

                                {(contactInfo.contactEmails?.some(Boolean) || contactInfo.contactPhones?.some(Boolean)) && (
                                    <div className="space-y-4 pt-4">
                                        {contactInfo.contactEmails?.filter(Boolean).map((email, i) => (
                                            <div key={`email-${i}`} className="flex items-start gap-4">
                                                <div className="bg-white p-3 rounded-lg border border-gray-200"><Mail size={20} className="text-gray-700" /></div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-1">{t("contact.email")}</h4>
                                                    <a href={`mailto:${email}`} className="font-medium text-lg text-accent hover:underline">{email}</a>
                                                </div>
                                            </div>
                                        ))}
                                        {contactInfo.contactPhones?.filter(Boolean).map((phone, i) => (
                                            <div key={`phone-${i}`} className="flex items-start gap-4">
                                                <div className="bg-white p-3 rounded-lg border border-gray-200"><Phone size={20} className="text-gray-700" /></div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-1">{t("contact.phone")}</h4>
                                                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="font-medium text-lg text-accent hover:underline">{phone}</a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Send a message form (below address) */}
                    <div className="p-10 md:p-14 bg-white rounded-3xl shadow-2xl border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2 font-display">{t("contact.sendMessage")}</h2>
                        <p className="text-gray-500 mb-8">{t("contact.weAreHere")}</p>

                        {submitStatus === 'success' ? (
                            <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-100 text-center">
                                <h3 className="font-bold text-xl mb-2">{t("contact.messageSent")}</h3>
                                <p>{t("contact.thankYouMessage")}</p>
                                <button onClick={() => setSubmitStatus('idle')} className="mt-4 text-sm font-bold underline hover:text-green-800">{t("contact.sendAnotherMessage")}</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{t("contact.firstName")}</label>
                                        <input
                                            {...register("firstName", { required: true })}
                                            type="text"
                                            className="w-full border-b-2 border-gray-200 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors"
                                            placeholder={t("contact.placeholderFirstName")}
                                        />
                                        {errors.firstName && <span className="text-red-500 text-xs">{t("contact.required")}</span>}
                                    </div>
                                    <div className="relative">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{t("contact.lastName")}</label>
                                        <input
                                            {...register("lastName")}
                                            type="text"
                                            className="w-full border-b-2 border-gray-200 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors"
                                            placeholder={t("contact.placeholderLastName")}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{t("contact.emailLabel")}</label>
                                        <input
                                            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                                            type="email"
                                            className="w-full border-b-2 border-gray-200 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors"
                                            placeholder={t("contact.placeholderEmail")}
                                        />
                                        {errors.email && <span className="text-red-500 text-xs">{t("contact.validEmailRequired")}</span>}
                                    </div>
                                    <div className="relative">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{t("contact.phone")}</label>
                                        <input
                                            {...register("phone")}
                                            type="tel"
                                            className="w-full border-b-2 border-gray-200 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors"
                                            placeholder={t("contact.placeholderPhone")}
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{t("contact.messageOrPrayer")}</label>
                                    <textarea
                                        {...register("message", { required: true })}
                                        rows={4}
                                        className="w-full border-b-2 border-gray-200 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors resize-none"
                                        placeholder={t("contact.placeholderMessage")}
                                    ></textarea>
                                    {errors.message && <span className="text-red-500 text-xs">{t("contact.required")}</span>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitStatus === 'submitting'}
                                    className="bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary-dark transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitStatus === 'submitting' ? t("contact.sending") : t("contact.sendMessageButton")} <Send size={18} className="ml-2" />
                                </button>
                                {submitStatus === 'error' && <p className="text-red-500 text-sm mt-2">{t("contact.failedToSend")}</p>}
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
