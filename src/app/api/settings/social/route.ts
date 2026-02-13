import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SocialSettings from '@/models/SocialSettings';

export async function GET() {
    try {
        await dbConnect();
        // Find the first document (singleton pattern)
        let settings = await SocialSettings.findOne();

        // If no settings exist, return default structure (or create one)
        if (!settings) {
            settings = {
                facebookUrl: '',
                youtubeUrl: '',
                instagramUrl: '',
                whatsappUrl: '',
            };
        }

        return NextResponse.json({ success: true, data: settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Upsert: update if exists, otherwise create
        // We assume only one document for settings
        const settings = await SocialSettings.findOneAndUpdate(
            {},
            { $set: body },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
