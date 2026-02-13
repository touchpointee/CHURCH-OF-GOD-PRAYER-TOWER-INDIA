'use client';

import { useState, useEffect } from 'react';
import { Save, Upload, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function DonationSettingsPage() {
    const [settings, setSettings] = useState({
        accountName: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        branchName: '',
        qrCodeUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploadingQR, setUploadingQR] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/donation-settings');
            if (res.data.success && res.data.data) {
                setSettings(prev => ({ ...prev, ...res.data.data }));
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.post('/api/donation-settings', settings);
            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingQR(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.success) {
                setSettings({ ...settings, qrCodeUrl: res.data.imageUrl });
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload QR Code');
        } finally {
            setUploadingQR(false);
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Donation Settings</h1>

            <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                <div className="space-y-6">

                    {/* Bank Details Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Bank Account Details</h3>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                                <input
                                    type="text"
                                    name="accountName"
                                    value={settings.accountName}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="Enter Account Name"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        value={settings.accountNumber}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2 font-mono"
                                        placeholder="Enter Account Number"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                                    <input
                                        type="text"
                                        name="ifscCode"
                                        value={settings.ifscCode}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2 font-mono uppercase"
                                        placeholder="Enter IFSC Code"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={settings.bankName}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="Enter Bank Name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name (Optional)</label>
                                <input
                                    type="text"
                                    name="branchName"
                                    value={settings.branchName}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="Enter Branch Name"
                                />
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">QR Code</h3>
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="w-32 h-32 bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden">
                                {settings.qrCodeUrl ? (
                                    <img src={settings.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-gray-400 text-xs text-center p-2">No QR Code Uploaded</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload QR Image</label>
                                <div className="flex items-center gap-2">
                                    <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center transition-colors">
                                        <Upload size={18} className="mr-2" />
                                        {uploadingQR ? 'Uploading...' : 'Choose Image'}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleQRUpload} disabled={uploadingQR} />
                                    </label>
                                    {settings.qrCodeUrl && (
                                        <button
                                            type="button"
                                            onClick={() => setSettings({ ...settings, qrCodeUrl: '' })}
                                            className="text-red-500 text-sm hover:underline"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Recommended: Square image, clearly visible QR code.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-end gap-3">
                        {success && <span className="text-green-600 flex items-center text-sm"><CheckCircle size={16} className="mr-1" /> Saved Successfully!</span>}
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors flex items-center font-bold"
                        >
                            {saving ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Settings</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
