import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';

export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        const message = await ContactMessage.create(body);
        return NextResponse.json({ success: true, data: message });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 400 });
    }
}

export async function GET() {
    await dbConnect();
    try {
        const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: messages });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 400 });
    }
}
