import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';
import { getLangFromRequest } from '@/lib/resolveLang';
import { resolveField } from '@/lib/resolveLang';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const lang = getLangFromRequest(request);
        const videos = await Video.find({}).sort({ createdAt: -1 });
        const rawList = videos.map((v) => (v.toObject ? v.toObject() : { ...v }));
        const data = rawList.map((raw: Record<string, unknown>) => ({
            ...raw,
            title: resolveField(raw, 'title', lang) ?? raw.title,
        }));
        return NextResponse.json({ success: true, data });
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
