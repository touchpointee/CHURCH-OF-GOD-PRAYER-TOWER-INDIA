import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { getLangFromRequest } from '@/lib/resolveLang';
import { resolveField } from '@/lib/resolveLang';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const lang = getLangFromRequest(request);
        const events = await Event.find({}).sort({ date: 1 });
        const rawList = events.map((e) => (e.toObject ? e.toObject() : { ...e }));
        const data = rawList.map((raw: Record<string, unknown>) => ({
            ...raw,
            title: resolveField(raw, 'title', lang) ?? raw.title,
            description: resolveField(raw, 'description', lang) ?? raw.description,
            location: resolveField(raw, 'location', lang) ?? raw.location,
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
        const event = await Event.create(body);
        return NextResponse.json({ success: true, data: event }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
