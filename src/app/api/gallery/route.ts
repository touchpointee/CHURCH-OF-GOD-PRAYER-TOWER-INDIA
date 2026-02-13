import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GalleryImage from '@/models/GalleryImage';

export async function GET() {
    try {
        await dbConnect();
        const images = await GalleryImage.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: images });
    } catch (error: any) {
        console.error('Gallery Fetch Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const image = await GalleryImage.create(body);
        return NextResponse.json({ success: true, data: image }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
