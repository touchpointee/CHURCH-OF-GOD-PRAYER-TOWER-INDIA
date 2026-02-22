import dbConnect from "@/lib/db";
import DonationSettings from "@/models/DonationSettings";
import DonateContent from "./DonateContent";

export const dynamic = "force-dynamic";

async function getDonationSettings() {
  await dbConnect();
  const settings = await DonationSettings.findOne();
  return settings ? JSON.parse(JSON.stringify(settings)) : null;
}

export default async function DonatePage() {
  const donation = await getDonationSettings();
  return <DonateContent donation={donation} />;
}
