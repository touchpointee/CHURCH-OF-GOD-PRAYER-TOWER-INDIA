import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GalleryImage from '@/models/GalleryImage';
import { getLangFromRequest } from '@/lib/resolveLang';
import { resolveField } from '@/lib/resolveLang';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const lang = getLangFromRequest(request);
        const images = await GalleryImage.find({}).sort({ createdAt: -1 });
        const rawList = images.map((i) => (i.toObject ? i.toObject() : { ...i }));
        const data = rawList.map((raw: Record<string, unknown>) => ({
            ...raw,
            title: resolveField(raw, 'title', lang) ?? raw.title,
        }));
        return NextResponse.json({ success: true, data });
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
