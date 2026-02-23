import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DonationPoster from '@/models/DonationPoster';

export async function GET() {
    await dbConnect();
    try {
        const posters = await DonationPoster.find({}).sort({ order: 1, createdAt: 1 });
        const data = posters.map((p) => p.toObject ? p.toObject() : { ...p });
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch posters' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const count = await DonationPoster.countDocuments();
        const poster = await DonationPoster.create({
            ...body,
            order: body.order != null ? body.order : count,
        });
        return NextResponse.json({ success: true, data: poster }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Failed to create poster' }, { status: 400 });
    }
}
