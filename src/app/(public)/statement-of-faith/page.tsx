"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Book, Heart, Users, Globe, Sun, Anchor } from "lucide-react";

export default function StatementOfFaithPage() {
    const [beliefs, setBeliefs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const initialBeliefs = [
        "The Holy Scriptures as the revealed will of God, the all sufficient rule for faith and practice. The Holy Bible consisting of sixty-six (66) books including the Old and New Testament, is the inspired Word of God, a revelation from God to Man, concerning the will of God in all things necessary to our faith, conduct and salvation, so that whatever is not contained therein is not to be enjoined as an article of faith (Hebrews 4:12; 2 Peter 1:20-21; 2 Timothy 3:15-17).",
        "In one God, eternally existing in three persons, namely the Father, the Son and the Holy Ghost (Deuteronomy 6:4; Isaiah 43:10-11; Matthew 28:19; Mark 12:29).",
        "That Jesus Christ is the only Begotten Son of the Father, conceived of the Holy Spirit, and born of virgin Mary (Isaiah 7:14; Matthew 3:16-17), that Jesus Christ died at the cross, and was buried and raised from the dead; that He ascended to heaven and is today at the right hand of the Father as our Intercessor.",
        "In the Holy Ghost, the Lord and giver of life, who proceed from the Father and the Son; who with the Father and Son together is worshiped and glorified (John 14:16-17).",
        "That man was created in the image and likeness of God, but fell by voluntary transgression and his only hope of redemption and salvation is in Jesus Christ; that all have sinned and come short of the glory of God, that repentance is commanded of God for all, and is necessary for forgiveness of sin; that salvation, new birth and justification are wrought by the grace of God, and faith in the Lord Jesus Christ and the renewing work of the Holy Ghost (Genesis 1:26-31; 3:1-7; Romans 5:12-21; 6:23; 10:13; Titus 2:11, 3:5-7).",
        "The inward evidence of salvation, new birth and justification to the believer is the direct witness of the Spirit, and the outward evidence to all men is a life of righteousness and holiness (Romans 8:16; 12:1-2).",
        "In the ordinance of water baptism by immersion, in the name of the Father, and of the Son and of the Holy Ghost, for all who repent and believe Jesus Christ as Savior and Lord (Matthew 28:19; Acts 10:47; Romans 6:4).",
        "All believers are entitled to and earnestly seek the promise of the Father, the Baptism in the Holy Spirit according to the command of our Lord Jesus Christ; that the full consummation of the Baptism of the believers in the Holy Spirit is evidenced by the initial sign of speaking with other tongues as the Spirit give utterances and by the subsequent manifestation of the gifts and fruits of the Spirit (Luke 24:49, Acts 1:4-6; 1:8; 2:4; 2:38; 10:44-46; 11:14-16; 15:7-9; 19:2-6; 1 Corinthians 12:1-31).",
        "The Lord's Supper consisting of the elements of bread and the fruit of the wine, is a memorial of His sufferings and death and a prophecy of His second coming, and will be enjoined by all believers, \"until He comes\" (Luke 22:17-20; 1 Corinthians 10:16,17; 11:23-32).",
        "Deliverance from sickness is provided for in the atonement and is the privilege of all believers, and the anointing of the sick with oil for healing and the laying on of hands (Isaiah 53:4; Matthew 8: 16-17; Mark 16:18-20; James 5:14-16).",
        "The Church is the body of Christ, the habitation of God through the Spirit, with divine appointments for the fulfillment of His great commission; and that a divinely called and scripturally ordained ministry have the two fold purposes of evangelization of the world and the edifying of the body of Christ (Ephesians 1:22,23; 2:19-22; Hebrews 12:23; Mark 16:15-20; Ephesians 4:11-13)."
    ];

    const [scripture, setScripture] = useState<{ text: string, reference: string }>({
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        reference: "John 3:16"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch points
                const beliefsRes = await axios.get('/api/statement-of-faith');
                if (beliefsRes.data.success && beliefsRes.data.data.length > 0) {
                    setBeliefs(beliefsRes.data.data.map((item: any) => item.content));
                } else {
                    setBeliefs(initialBeliefs);
                }

                // Fetch scripture
                const scriptureRes = await axios.get('/api/scriptures?key=statement-of-faith');
                if (scriptureRes.data.success && scriptureRes.data.data) {
                    setScripture({
                        text: scriptureRes.data.data.text,
                        reference: scriptureRes.data.data.reference
                    });
                }
            } catch (error) {
                console.error("Failed to fetch dynamic data", error);
                setBeliefs(initialBeliefs);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans">


            {/* Beliefs List */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="space-y-8">
                        {beliefs.map((belief, idx) => (
                            <div key={idx} className="flex gap-4">
                                <span className="text-xl font-bold text-gray-400 font-display min-w-[30px]">{idx + 1}.</span>
                                <p className="text-gray-700 leading-relaxed text-lg text-justify">
                                    {belief}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scripture Highlight */}
            <section className="py-20 px-4 bg-primary text-white text-center">
                <div className="container mx-auto max-w-3xl">
                    <Book className="w-12 h-12 text-accent mx-auto mb-6 opacity-80" />
                    <blockquote className="text-2xl md:text-3xl font-display font-medium leading-relaxed mb-6">
                        "{scripture.text}"
                    </blockquote>
                    <cite className="text-accent font-bold tracking-wider uppercase not-italic">- {scripture.reference}</cite>
                </div>
            </section>
        </div>
    );
}
