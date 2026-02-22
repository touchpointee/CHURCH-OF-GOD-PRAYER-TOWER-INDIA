import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Location from '@/models/Location';
import { getLangFromRequest } from '@/lib/resolveLang';
import { resolveField } from '@/lib/resolveLang';

export async function GET(request: Request) {
    await dbConnect();
    try {
        const lang = getLangFromRequest(request);
        const locations = await Location.find({});
        const rawList = locations.map((l) => (l.toObject ? l.toObject() : { ...l }));
        const data = rawList.map((raw: Record<string, unknown>) => ({
            ...raw,
            name: resolveField(raw, 'name', lang) ?? raw.name,
            address: resolveField(raw, 'address', lang) ?? raw.address,
            details: resolveField(raw, 'details', lang) ?? raw.details,
        }));
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch locations' }, { status: 400 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        const locations = await Location.create(body);
        return NextResponse.json({ success: true, data: locations });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create location' }, { status: 400 });
    }
}
