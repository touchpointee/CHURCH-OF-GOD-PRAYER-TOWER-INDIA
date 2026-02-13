import EventDetailClient from "./EventDetailClient";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";

// Since we are now using a real database, we can-t statically generate ALL params at build time 
// for every possible event unless we fetch them all. 
// For now, we will use 'generateStaticParams' to pre-render the latest few, or fallback to dynamic rendering.
// However, 'output: export' requires ALL paths to be known. 
// If 'output: export' is strictly required, we must fetch all IDs here.

export async function generateStaticParams() {
    await dbConnect();
    // Fetch all event IDs for static generation
    const events = await Event.find({}, '_id');

    return events.map((event) => ({
        id: event._id.toString(),
    }));
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    // We pass the ID to the client component, which fetches the full data.
    // Alternatively, we could fetch here and pass data as props if not using 'output: export' so strictly.
    // Given the previous pattern, let-s keep data fetching on client for consistency with 'EventDetailClient' logic 
    // or refactor to server-fetching if desired. 
    // The previous EventDetailClient fetched from static array. Now it fetches from API.

    return <EventDetailClient id={resolvedParams.id} />;
}
