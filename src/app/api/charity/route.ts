import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CharityImage from '@/models/CharityImage';

export async function GET() {
    try {
        await dbConnect();
        const images = await CharityImage.find({}).sort({ createdAt: -1 });
        const data = images.map((i) => (i.toObject ? i.toObject() : { ...i }));
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const image = await CharityImage.create(body);
        return NextResponse.json({ success: true, data: image }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
