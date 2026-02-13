import { Heart, CreditCard, Gift, CheckCircle } from "lucide-react";
import dbConnect from "@/lib/db";
import DonationSettings from "@/models/DonationSettings";

// Force dynamic rendering to ensure latest data is fetched
export const dynamic = 'force-dynamic';

async function getDonationSettings() {
    await dbConnect();
    const settings = await DonationSettings.findOne();
    return settings ? JSON.parse(JSON.stringify(settings)) : null;
}

export default async function DonatePage() {
    const donation = await getDonationSettings();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* Hero Section */}
            <section className="relative py-24 bg-primary overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqQCCCiU4Q7ntxH2de2l_N2gIFtNVVIG_F8KorgGzU224bcTCB04y5NoiajlT3skCpFXkoUyjy8ME1CB0opXeXsS_I2OIzGZfhbfq6dxPCZpc1P-0AzcQMZ_TM1JJ176l44uoAWEMCOMS4ZrnYatCLBj7LVxQZtGxwjOVdy4VaQW3-0XAeiIigzEHh3uO8ldg6UPjUV1Apxnm3v1n7WGj1gV80NpGWnyB-XMJGi4jfL_JZtFV2-4qAu4jZVfM7bfjjfxHkIFmrHeo"
                        alt="Giving"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-block bg-gray-100 rounded-full px-4 py-1 mb-6">
                        <span className="text-accent font-bold uppercase tracking-wider text-xs">Giving</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Generosity Changes Lives</h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                        "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." <br /> <span className="text-sm opacity-70 mt-2 block">- 2 Corinthians 9:7</span>
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">

                {/* Ways to Give */}
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Ways to Give</h2>
                        <p className="text-gray-500">Choose the most convenient way for you to support the ministry.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center hover:transform hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-gray-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <CreditCard size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Online Giving</h3>
                            <p className="text-gray-500 text-sm mb-6">Securely give directly using your preferred online payment method.</p>
                            {/* Placeholder for future payment gateway integration */}
                            <button disabled className="bg-gray-200 text-gray-500 font-bold py-3 px-8 rounded-full w-full cursor-not-allowed">
                                Coming Soon
                            </button>
                        </div>

                        {/* Method 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl transform scale-105 border border-primary/20 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Heart size={100} className="text-accent" />
                            </div>
                            <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10">
                                <Gift size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 relative z-10 text-gray-900">Bank Transfer</h3>
                            <p className="text-gray-500 text-sm mb-6 relative z-10">Directly transfer to our church bank account. Ideal for large donations.</p>

                            <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm relative z-10 border border-gray-100">
                                {donation ? (
                                    <>
                                        <div className="flex justify-between flex-wrap gap-2">
                                            <span className="text-gray-500">Account Name:</span>
                                            <span className="font-bold text-gray-900 text-right">{donation.accountName}</span>
                                        </div>
                                        <div className="flex justify-between flex-wrap gap-2">
                                            <span className="text-gray-500">Account No:</span>
                                            <span className="font-bold text-gray-900 font-mono text-right">{donation.accountNumber}</span>
                                        </div>
                                        <div className="flex justify-between flex-wrap gap-2">
                                            <span className="text-gray-500">IFSC Code:</span>
                                            <span className="font-bold text-gray-900 font-mono text-right">{donation.ifscCode}</span>
                                        </div>
                                        <div className="flex justify-between flex-wrap gap-2">
                                            <span className="text-gray-500">Bank:</span>
                                            <span className="font-bold text-gray-900 text-right">{donation.bankName}</span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-center text-gray-400 italic">Bank details pending update.</p>
                                )}
                            </div>
                        </div>

                        {/* Method 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center hover:transform hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 17h4.01M16 3h4.01M12 3c-1.25 0-2.5 1-2.5 2.5v13C9.5 19 10.75 20 12 20h8c1.25 0 2.5-1 2.5-2.5V5.5C22.5 4 21.25 3 20 3h-8z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">QR Code / UPI</h3>
                            <p className="text-gray-500 text-sm mb-6">Scan the QR code using any UPI app like GPay, PhonePe, or Paytm.</p>
                            <div className="w-32 h-32 bg-gray-50 mx-auto rounded-lg flex items-center justify-center mb-4 border border-gray-100 p-1">
                                {donation && donation.qrCodeUrl ? (
                                    <img src={donation.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain rounded" />
                                ) : (
                                    <span className="text-xs text-center text-gray-400">QR Code Here</span>
                                )}
                            </div>
                            <p className="text-xs font-mono bg-gray-100 py-2 rounded text-gray-500">Scan to Pay</p>
                        </div>
                    </div>
                </div>

                {/* Impact Section */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                        <div className="flex-1">
                            <span className="text-accent font-bold uppercase tracking-wider text-xs mb-2 block">Your Impact</span>
                            <h3 className="text-3xl font-display font-bold text-gray-900 mb-4">Where does my donation go?</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-accent flex-shrink-0 mt-1" />
                                    <span className="text-gray-600">Supporting local missions and community outreach programs.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-accent flex-shrink-0 mt-1" />
                                    <span className="text-gray-600">Maintaining the church facilities and creating a welcoming environment.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-accent flex-shrink-0 mt-1" />
                                    <span className="text-gray-600">Funding youth and children's ministries to raise the next generation.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-accent flex-shrink-0 mt-1" />
                                    <span className="text-gray-600">Helping those in need through our charity initiatives.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqU3s_dBFBeBwsrCfYk1v_MUxpJWi7ExUdPa3T13c5T8JHpfmJ6OZ3kY6cGZK6jlv4uBpVSNiVG_Mc419ykfHBdPIglZjswFpAzSF1J2Hk_emh9G-BmCfk1l6JrsOmtK0KfHxMOjrDnao99hzwIkCKpr03XZWvGkEkbz2jZ2DbGJ5OPHp2Lh1visQq23yAObbXbMa8pWegGYovCamiXIXm7-5B2whHYNhHjid_C2CHn4BFEccndwkP9vvisCY1n2ijfukzsCklvdo"
                                alt="Impact"
                                className="rounded-2xl shadow-lg w-full h-64 object-cover"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
