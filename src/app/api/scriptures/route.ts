import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Scripture from '@/models/Scripture';

export async function GET(req: Request) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
        return NextResponse.json({ success: false, error: 'Key is required' }, { status: 400 });
    }

    try {
        const scripture = await Scripture.findOne({ key });
        return NextResponse.json({ success: true, data: scripture });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch scripture' }, { status: 400 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        const { key, text, reference } = body;

        if (!key || !text || !reference) {
            return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
        }

        const scripture = await Scripture.findOneAndUpdate(
            { key },
            { text, reference },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, data: scripture });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save scripture' }, { status: 400 });
    }
}
