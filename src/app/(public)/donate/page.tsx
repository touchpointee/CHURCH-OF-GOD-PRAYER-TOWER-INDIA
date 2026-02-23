import dbConnect from "@/lib/db";
import DonationPoster from "@/models/DonationPoster";
import DonateContent from "./DonateContent";

export const dynamic = "force-dynamic";

async function getDonationPosters() {
  await dbConnect();
  const posters = await DonationPoster.find({}).sort({ order: 1, createdAt: 1 });
  return posters.map((p) => JSON.parse(JSON.stringify(p)));
}

export default async function DonatePage() {
  const posters = await getDonationPosters();
  return <DonateContent posters={posters} />;
}
