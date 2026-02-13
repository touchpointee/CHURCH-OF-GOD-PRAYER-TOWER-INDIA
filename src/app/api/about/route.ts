import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import About from '@/models/About';

export async function GET() {
    try {
        await dbConnect();
        // Return the most recently updated about info, or create a default one if none exists
        let about = await About.findOne().sort({ updatedAt: -1 });

        if (!about) {
            // Return empty structure or default
            return NextResponse.json({ success: true, data: {} });
        }

        return NextResponse.json({ success: true, data: about });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Check if a document already exists
        let about = await About.findOne();

        if (about) {
            // Update existing
            about = await About.findByIdAndUpdate(about._id, body, {
                new: true,
                runValidators: true
            });
        } else {
            // Create new
            about = await About.create(body);
        }

        return NextResponse.json({ success: true, data: about });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
