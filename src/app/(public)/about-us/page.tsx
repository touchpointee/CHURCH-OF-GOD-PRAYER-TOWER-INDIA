"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AboutPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/about');
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch about data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Default values if no data yet
    const founderName = data?.founderName || "Pastor P M Joseph";
    const founderImage = data?.founderImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuAnSH6F9FDGDKuyw4T63E-9y_0uJcX2dFseLUuqN9lF3CZHe09bXg37HSTZtaoPmw1R0UPT35f7WbzQV5E_fBtOwwAvynAxki85vu2C1wfw12jdeeAvCCe33aGKlgSaOasXFn-lSvmeHgdmMTzfMGUuzk8u7eQcDFHOoOc_lGJrTvhD6uEKY-WUV-5Aq98TxxxHvCGBtGOEUKFykBbkNNPzoI2Gnh5Tg2R4sR-xvDgqxD5f50jDC-NLZMdHsgFZOkwXkela-zrg1O4"; // Fallback image provided in previous version
    const title = data?.title || "Who we are?";
    const content = data?.content || "The India Pentecostal Church of God (IPC) is the largest indigenous Pentecostal denomination in India. The Christian movement in India was pioneered by the disciple of Lord Jesus Christ, Thomas the Apostle, who traveled outside the Roman Empire to preach the Gospel, traveling as far as India. According to tradition, the Apostle reached Muziris, India in 52 AD and baptized several people. The origins of the Indian Pentecostal Church of God can be traced back to the Pentecostal movement in India to the early 20th century and the church has been growing ever since.\n\nThe chief architect and the founder of IPC was Pastor K.E.Abraham, a powerful orator and writer. Pastor K.E. Abraham received the baptism of the Holy Spirit in 1923. Apostle P. M. Samuel, Pastor T. G. Oommen, Pastor K.C.Cherian, Pastor P.T.Chacko, Pastor K.C.Oommen, Pastor P.T. Mathew and many others were also filled with the Holy Spirit in Nineteen Twenties.";
    return (
        <div className="min-h-screen bg-white font-sans pt-12 pb-20">
            {/* Header Section */}
            <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                    <img src="/logo.jpg" alt="IPC Logo" className="h-24 md:h-28" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                    Church of God Prayer Tower India
                </h1>
                {/* Optional separator line if desired, image shows subtle spacing */}
                <div className="w-24 h-1 bg-gray-100 mx-auto mt-6 rounded-full"></div>
            </div>

            {/* Main Content Grid */}
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Column: Founder Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#0f172a] text-white rounded-lg overflow-hidden shadow-xl max-w-sm mx-auto lg:mx-0">
                            {/* Card Header */}
                            <div className="bg-[#0f172a] py-4 text-center border-b border-gray-700">
                                <h3 className="text-xl font-bold text-white">Our Founder</h3>
                            </div>

                            {/* Image */}
                            <div className="aspect-[3/4] relative bg-gray-800">
                                <img
                                    src={founderImage}
                                    alt={founderName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Card Footer */}
                            <div className="bg-[#0f172a] py-4 text-center border-t border-gray-700">
                                <h3 className="text-lg font-bold text-white">{founderName}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="lg:col-span-8">
                        <h2 className="text-2xl font-bold text-[#334155] mb-6">{title}</h2> {/* Using a slate-700 color for title matching image vibe */}

                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-justify space-y-6">
                            {/* Render content paragraphs */}
                            {content.split('\n\n').map((paragraph: string, index: number) => (
                                <p key={index} className="mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
