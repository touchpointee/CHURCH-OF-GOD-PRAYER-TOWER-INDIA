"use client";

import { useState, useEffect } from "react";
import { Save, Facebook, Youtube, Instagram, MessageCircle, Mail, Phone, Plus, Trash2 } from "lucide-react";

export default function SocialSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        facebookUrl: '',
        youtubeUrl: '',
        instagramUrl: '',
        whatsappUrl: '',
        contactEmails: [] as string[],
        contactPhones: [] as string[],
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings/social');
            const data = await res.json();
            if (data.success && data.data) {
                const d = data.data;
                setFormData(prev => ({
                    ...prev,
                    ...d,
                    contactEmails: Array.isArray(d.contactEmails) && d.contactEmails.length
                        ? d.contactEmails
                        : (d.contactEmail ? [d.contactEmail] : ['']),
                    contactPhones: Array.isArray(d.contactPhones) && d.contactPhones.length
                        ? d.contactPhones
                        : (d.contactPhone ? [d.contactPhone] : ['']),
                }));
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
            setMessage({ type: 'error', text: 'Failed to load settings.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('contactEmail_')) {
            const i = parseInt(name.replace('contactEmail_', ''), 10);
            setFormData(prev => ({
                ...prev,
                contactEmails: prev.contactEmails.map((v, j) => (j === i ? value : v)),
            }));
            return;
        }
        if (name.startsWith('contactPhone_')) {
            const i = parseInt(name.replace('contactPhone_', ''), 10);
            setFormData(prev => ({
                ...prev,
                contactPhones: prev.contactPhones.map((v, j) => (j === i ? value : v)),
            }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addContactEmail = () => setFormData(prev => ({ ...prev, contactEmails: [...prev.contactEmails, ''] }));
    const removeContactEmail = (index: number) => setFormData(prev => ({
        ...prev,
        contactEmails: prev.contactEmails.filter((_, i) => i !== index).length ? prev.contactEmails.filter((_, i) => i !== index) : [''],
    }));
    const addContactPhone = () => setFormData(prev => ({ ...prev, contactPhones: [...prev.contactPhones, ''] }));
    const removeContactPhone = (index: number) => setFormData(prev => ({
        ...prev,
        contactPhones: prev.contactPhones.filter((_, i) => i !== index).length ? prev.contactPhones.filter((_, i) => i !== index) : [''],
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/settings/social', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' });
                const d = data.data || {};
                setFormData(prev => ({
                    ...prev,
                    ...d,
                    contactEmails: Array.isArray(d.contactEmails) && d.contactEmails.length ? d.contactEmails : [''],
                    contactPhones: Array.isArray(d.contactPhones) && d.contactPhones.length ? d.contactPhones : [''],
                }));
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save settings.' });
            }
        } catch (error) {
            console.error("Failed to save settings", error);
            setMessage({ type: 'error', text: 'An error occurred while saving.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Social Media Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

                    {message.text && (
                        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="grid gap-6">
                        {/* Facebook */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Facebook size={18} className="text-blue-600" /> Facebook URL
                            </label>
                            <input
                                type="url"
                                name="facebookUrl"
                                value={formData.facebookUrl}
                                onChange={handleChange}
                                placeholder="https://facebook.com/yourpage"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* YouTube */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Youtube size={18} className="text-red-600" /> YouTube Channel URL
                            </label>
                            <input
                                type="url"
                                name="youtubeUrl"
                                value={formData.youtubeUrl}
                                onChange={handleChange}
                                placeholder="https://youtube.com/@yourchannel"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Instagram */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Instagram size={18} className="text-pink-600" /> Instagram URL
                            </label>
                            <input
                                type="url"
                                name="instagramUrl"
                                value={formData.instagramUrl}
                                onChange={handleChange}
                                placeholder="https://instagram.com/yourprofile"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* WhatsApp (Optional) */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <MessageCircle size={18} className="text-green-600" /> WhatsApp Link (Optional)
                            </label>
                            <input
                                type="url"
                                name="whatsappUrl"
                                value={formData.whatsappUrl}
                                onChange={handleChange}
                                placeholder="https://wa.me/1234567890"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact (Phones & Emails)</h3>
                        <div className="grid gap-6">
                            <div className="space-y-3">
                                <label className="flex items-center justify-between gap-2 text-sm font-medium text-gray-700">
                                    <span className="flex items-center gap-2"><Mail size={18} className="text-gray-600" /> Contact Emails</span>
                                    <button type="button" onClick={addContactEmail} className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                                        <Plus size={16} /> Add email
                                    </button>
                                </label>
                                {formData.contactEmails.map((email, i) => (
                                    <div key={`email-${i}`} className="flex gap-2">
                                        <input
                                            type="email"
                                            name={`contactEmail_${i}`}
                                            value={email}
                                            onChange={handleChange}
                                            placeholder="contact@example.org"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeContactEmail(i)}
                                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between gap-2 text-sm font-medium text-gray-700">
                                    <span className="flex items-center gap-2"><Phone size={18} className="text-gray-600" /> Contact Phones</span>
                                    <button type="button" onClick={addContactPhone} className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                                        <Plus size={16} /> Add phone
                                    </button>
                                </label>
                                {formData.contactPhones.map((phone, i) => (
                                    <div key={`phone-${i}`} className="flex gap-2">
                                        <input
                                            type="tel"
                                            name={`contactPhone_${i}`}
                                            value={phone}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeContactPhone(i)}
                                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {saving ? (
                                <>Saving...</>
                            ) : (
                                <><Save size={18} /> Save Settings</>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
