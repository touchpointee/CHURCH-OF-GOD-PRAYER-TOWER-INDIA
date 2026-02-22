import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { getLangFromRequest } from '@/lib/resolveLang';
import { resolveField } from '@/lib/resolveLang';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await props.params;
        const lang = getLangFromRequest(request);
        const event = await Event.findById(id);
        if (!event) {
            return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
        }
        const raw = event.toObject ? event.toObject() : { ...event };
        const data = {
            ...raw,
            title: resolveField(raw, 'title', lang) ?? raw.title,
            description: resolveField(raw, 'description', lang) ?? raw.description,
            location: resolveField(raw, 'location', lang) ?? raw.location,
        };
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
