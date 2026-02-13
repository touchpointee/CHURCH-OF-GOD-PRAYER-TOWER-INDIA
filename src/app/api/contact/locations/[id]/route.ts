import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Location from '@/models/Location';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await params;
    try {
        const body = await req.json();
        const updated = await Location.findByIdAndUpdate(id, body, { new: true });
        if (!updated) {
            return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update location' }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await params;
    try {
        const deleted = await Location.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete location' }, { status: 400 });
    }
}
