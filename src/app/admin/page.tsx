import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import VideoModel from "@/models/Video";
import GalleryImage from "@/models/GalleryImage";
import AdminDashboardContent from "./AdminDashboardContent";

export const dynamic = "force-dynamic";

async function getStats() {
  await dbConnect();
  const eventCount = await Event.countDocuments();
  const videoCount = await VideoModel.countDocuments();
  const imageCount = await GalleryImage.countDocuments();
  const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(5);
  return {
    counts: { events: eventCount, videos: videoCount, gallery: imageCount },
    recent: JSON.parse(JSON.stringify(recentEvents)),
  };
}

export default async function AdminDashboard() {
  const { counts, recent } = await getStats();
  return <AdminDashboardContent counts={counts} recent={recent} />;
}
