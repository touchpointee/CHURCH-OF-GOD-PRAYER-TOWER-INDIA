import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DonationSettings from '@/models/DonationSettings';

export async function GET() {
    await dbConnect();
    try {
        const settings = await DonationSettings.findOne(); // Fetch the first document
        return NextResponse.json({ success: true, data: settings || {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();

        // Upsert: Find one and update, or create if not exists
        const settings = await DonationSettings.findOneAndUpdate({}, body, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        });

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
    }
}
