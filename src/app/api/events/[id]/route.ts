import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await props.params;
        const event = await Event.findById(id);
        if (!event) {
            return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: event });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
