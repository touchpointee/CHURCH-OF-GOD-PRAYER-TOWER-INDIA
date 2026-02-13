import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Location from '@/models/Location';

export async function GET() {
    await dbConnect();
    try {
        const locations = await Location.find({}); // Sort or paginate if needed
        return NextResponse.json({ success: true, data: locations });
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
