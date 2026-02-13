import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import History from '@/models/History';

export async function GET() {
    try {
        await dbConnect();
        // Sort by year ascending, or we can use an 'order' field if we successfully implemented it. 
        // For now, let's sort by year string (might need better logic if mixed formats, but standard years work)
        // Or creation time. Let's rely on 'year' for display but sort by 'order' or 'year'.
        // Let's standard sort by 'year'.
        const milestones = await History.find({}).sort({ year: 1 });
        return NextResponse.json({ success: true, data: milestones });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const milestone = await History.create(body);
        return NextResponse.json({ success: true, data: milestone }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
