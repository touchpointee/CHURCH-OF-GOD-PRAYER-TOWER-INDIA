import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { getLangFromRequest } from '@/lib/resolveLang';
import { resolveField } from '@/lib/resolveLang';
import { normalizeEventBody } from '@/lib/events';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await props.params;
        const event = await Event.findById(id);
        if (!event) {
            return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
        }
        const raw = event.toObject ? event.toObject() : { ...event };
        const url = new URL(request.url);
        if (url.searchParams.get('raw') === '1') {
            return NextResponse.json({ success: true, data: raw });
        }
        const lang = getLangFromRequest(request);
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

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await props.params;
        const body = await request.json();
        if (body.category === '') body.category = null;
        const normalized = normalizeEventBody(body);
        const event = await Event.findByIdAndUpdate(id, normalized, { new: true, runValidators: true });
        if (!event) {
            return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
        }
        const raw = event.toObject ? event.toObject() : { ...event };
        return NextResponse.json({ success: true, data: raw });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await props.params;
        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
