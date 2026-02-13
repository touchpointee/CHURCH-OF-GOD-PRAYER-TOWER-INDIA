import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PrayerRequest from '@/models/PrayerRequest';

export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        const request = await PrayerRequest.create(body);
        return NextResponse.json({ success: true, data: request });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to submit prayer request' }, { status: 400 });
    }
}

export async function GET() {
    await dbConnect();
    try {
        const requests = await PrayerRequest.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: requests });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch prayer requests' }, { status: 400 });
    }
}
