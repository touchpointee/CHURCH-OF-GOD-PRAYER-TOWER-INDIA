import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';

export async function GET() {
    try {
        await dbConnect();
        const videos = await Video.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: videos });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        // Logic to extract thumbnail from YouTube URL could go here or on client
        // For now, assuming client sends it or we just store URL
        const video = await Video.create(body);
        return NextResponse.json({ success: true, data: video }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
