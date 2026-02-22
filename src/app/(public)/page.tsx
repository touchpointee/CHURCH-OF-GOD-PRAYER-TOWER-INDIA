import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Video from "@/models/Video";
import GalleryImage from "@/models/GalleryImage";
import DonationSettings from "@/models/DonationSettings";
import HomeContent from "./HomeContent";
import { resolveField } from "@/lib/resolveLang";
import type { Locale } from "@/lib/resolveLang";

export const dynamic = "force-dynamic";

function resolveLocale(lang: string | undefined): Locale {
  if (lang === "hi" || lang === "ml") return lang;
  return "en";
}

async function getData() {
  const cookieStore = await cookies();
  const lang = resolveLocale(cookieStore.get("NEXT_LANG")?.value);

  await dbConnect();
  const upcomingEvent = await Event.findOne({ date: { $gte: new Date() } }).sort({ date: 1 });
  const latestVideos = await Video.find().sort({ createdAt: -1 }).limit(4);
  const galleryImages = await GalleryImage.find({ category: { $ne: null } }).sort({ createdAt: -1 }).limit(4);
  const donationSettings = await DonationSettings.findOne();

  const eventRaw = upcomingEvent ? JSON.parse(JSON.stringify(upcomingEvent)) : null;
  const event = eventRaw
    ? {
        ...eventRaw,
        title: resolveField(eventRaw, "title", lang) ?? eventRaw.title,
        description: resolveField(eventRaw, "description", lang) ?? eventRaw.description,
        location: resolveField(eventRaw, "location", lang) ?? eventRaw.location,
      }
    : null;

  const videosRaw = JSON.parse(JSON.stringify(latestVideos));
  const videos = videosRaw.map((v: Record<string, unknown>) => ({
    ...v,
    title: resolveField(v, "title", lang) ?? v.title,
  }));

  const galleryRaw = JSON.parse(JSON.stringify(galleryImages));
  const galleryImagesResolved = galleryRaw.map((g: Record<string, unknown>) => ({
    ...g,
    title: resolveField(g, "title", lang) ?? g.title,
  }));

  return {
    event,
    videos,
    galleryImages: galleryImagesResolved,
    donation: donationSettings ? JSON.parse(JSON.stringify(donationSettings)) : null,
  };
}

export default async function Home() {
  const { event, videos, galleryImages, donation } = await getData();
  return <HomeContent event={event} videos={videos} galleryImages={galleryImages} donation={donation} />;
}
