import Hero from "@/components/Hero";
import { ArrowRight, Play, Calendar, MapPin, Clock, Heart, CreditCard } from "lucide-react";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Video from "@/models/Video";
import GalleryImage from "@/models/GalleryImage";
import DonationSettings from "@/models/DonationSettings";

// Force dynamic rendering to ensure latest data is fetched
export const dynamic = 'force-dynamic';

async function getData() {
  await dbConnect();

  // 1. Fetch upcoming event
  const upcomingEvent = await Event.findOne({ date: { $gte: new Date() } }).sort({ date: 1 });

  // 2. Fetch latest videos (limit 4)
  const latestVideos = await Video.find().sort({ createdAt: -1 }).limit(4);

  // 3. Fetch latest gallery images (limit 4)
  const galleryImages = await GalleryImage.find({ category: { $ne: null } }).sort({ createdAt: -1 }).limit(4);

  // 4. Fetch Donation Settings
  const donationSettings = await DonationSettings.findOne();

  return {
    event: upcomingEvent ? JSON.parse(JSON.stringify(upcomingEvent)) : null,
    videos: JSON.parse(JSON.stringify(latestVideos)),
    galleryImages: JSON.parse(JSON.stringify(galleryImages)),
    donation: donationSettings ? JSON.parse(JSON.stringify(donationSettings)) : null
  };
}

export default async function Home() {
  const { event, videos, galleryImages, donation } = await getData();

  return (
    <div className="flex flex-col min-h-screen">

      {/* HEADER HERO */}
      <Hero />

      {/* MAIN CONTENT */}
      <main className="font-sans">

        {/* 1. UPCOMING EVENTS SECTION */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-accent font-bold uppercase tracking-wider text-sm">Join Us</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2">Upcoming Events</h2>
            </div>

            {event ? (
              <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-primary text-white p-8 flex flex-col justify-center items-center text-center">
                  <Calendar size={48} className="mb-4 opacity-80" />
                  <span className="text-lg font-medium opacity-90">{new Date(event.date).toLocaleString('default', { month: 'long' })}</span>
                  <span className="text-6xl font-bold my-2">{new Date(event.date).getDate()}</span>
                  <span className="text-lg opacity-90">{new Date(event.date).getFullYear()}</span>
                </div>
                <div className="p-8 md:w-2/3 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h3>
                  <div className="space-y-3 mb-6 text-gray-600">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-accent" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-accent" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{event.description}</p>
                  <Link href="/events" className="inline-block bg-white border border-gray-300 text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-colors text-center w-max">
                    View All Events
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-2xl max-w-2xl mx-auto border border-gray-100">
                <p className="mb-6">No upcoming events scheduled at the moment.</p>
                <Link href="/events" className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
                  Check Calendar
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 2. LATEST VIDEOS SECTION */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4 text-center md:text-left">
              <div>
                <span className="text-accent font-bold uppercase tracking-wider text-sm">Watch & Listen</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2">Latest Sermons</h2>
              </div>
              <Link href="/videos" className="hidden md:flex bg-white border border-gray-300 text-gray-900 font-bold px-6 py-2 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all items-center">
                View All Videos <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((video: any) => (
                  <a key={video._id} href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-video overflow-hidden">
                      {video.thumbnailUrl ? (
                        <img alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={video.thumbnailUrl} />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                          <Play size={40} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={20} className="text-accent ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{video.title}</h4>
                      <span className="text-xs text-gray-500 mt-2 block">{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-6 font-medium">No videos available at the moment.</p>
                <a href="https://www.youtube.com/@churchofgodprayertowerindia" target="_blank" rel="noopener noreferrer" className="inline-flex bg-red-600 text-white font-bold px-6 py-3 rounded-full hover:bg-red-700 transition-colors items-center shadow-md hover:shadow-lg transform hover:-translate-y-1">
                  <Play size={18} fill="currentColor" className="mr-2" /> Visit YouTube Channel
                </a>
              </div>
            )}

            <div className="mt-8 text-center md:hidden">
              <Link href="/videos" className="inline-flex bg-white border border-gray-300 text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all items-center">
                View All Videos <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. GALLERY SECTION */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-accent font-bold uppercase tracking-wider text-sm">Gallery</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2">Captured Moments</h2>
            </div>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((img: any, idx: number) => (
                  <div key={img._id} className={`group relative rounded-xl overflow-hidden cursor-pointer ${idx === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square'}`}>
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">No images in gallery.</div>
            )}

            <div className="text-center mt-10">
              <Link href="/gallery" className="inline-block bg-white border border-gray-300 text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-colors">
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>

        {/* 4. DONATION SECTION */}
        <section className="py-20 bg-primary text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute right-0 top-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute left-0 bottom-0 w-64 h-64 bg-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">

              {/* Text Content */}
              <div className="lg:w-1/2 text-center lg:text-left">
                <span className="bg-white/10 text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full mb-6 inline-block uppercase tracking-wider">Support Our Mission</span>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Give Generously</h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Your contributions help us spread the Word, support our community outreach, and maintain the sanctuary. Every gift makes a difference.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Heart className="text-accent" fill="currentColor" size={20} />
                    <span>Tithing</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CreditCard className="text-accent" size={20} />
                    <span>Donation</span>
                  </div>
                </div>
              </div>

              {/* Donation Card */}
              <div className="lg:w-1/2 w-full">
                <div className="bg-white text-gray-900 rounded-3xl p-8 shadow-2xl max-w-lg mx-auto relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>

                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-6 border-b border-gray-100 pb-4">Bank Details</h3>

                    {donation ? (
                      <div className="space-y-4 mb-8">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Account Name</p>
                          <p className="text-lg font-bold text-primary">{donation.accountName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Account Number</p>
                            <p className="text-lg font-mono font-medium">{donation.accountNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">IFSC Code</p>
                            <p className="text-lg font-mono font-medium">{donation.ifscCode}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Bank Name</p>
                          <p className="text-gray-800 font-medium">{donation.bankName} <span className="text-gray-500 text-sm font-normal">{donation.branchName ? `- ${donation.branchName}` : ''}</span></p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-500 mb-6">
                        Details coming soon.
                      </div>
                    )}


                    <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center gap-6 border border-gray-100 text-center">
                      <div className="w-full max-w-[300px] aspect-square bg-white p-2 rounded-lg border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden mx-auto shadow-sm">
                        {/* QR Placeholder */}
                        {donation && donation.qrCodeUrl ? (
                          <img src={donation.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-center text-gray-500">
                            [QR Code]
                          </div>
                        )}
                      </div>
                      <div className="w-full max-w-xs mx-auto">
                        <p className="font-bold text-gray-900 mb-2 text-xl">Scan to Pay</p>
                        <p className="text-base text-gray-500 leading-snug">Use any UPI app to scan and donate directly to our church account.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main >
    </div >
  );
}
