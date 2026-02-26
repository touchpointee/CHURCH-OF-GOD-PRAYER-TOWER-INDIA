import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Location from '@/models/Location';
import mongoose from 'mongoose';

const LOCATION_UPDATE_FIELDS = [
    'name', 'nameHi', 'nameMl', 'address', 'addressHi', 'addressMl',
    'details', 'detailsHi', 'detailsMl', 'mapUrl'
] as const;

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await params;
    try {
        const body = await req.json();
        const update: Record<string, unknown> = {};
        for (const key of LOCATION_UPDATE_FIELDS) {
            if (key in body) {
                const val = body[key];
                update[key] = key === 'mapUrl' && typeof val === 'string' ? val.trim() : val;
            }
        }
        // Ensure mapUrl is always in payload so it gets saved (from form)
        if ('mapUrl' in body) {
            update.mapUrl = typeof body.mapUrl === 'string' ? body.mapUrl.trim() : '';
        }

        // Use native MongoDB $set so mapUrl is never stripped by schema
        const _id = new mongoose.Types.ObjectId(id);
        const result = await Location.updateOne(
            { _id },
            { $set: update },
            { runValidators: true }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });
        }
        const updated = await Location.findById(id);
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
