import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import StatementOfFaith from '@/models/StatementOfFaith';

export async function GET() {
    await dbConnect();
    try {
        const beliefs = await StatementOfFaith.find({}).sort({ order: 1, createdAt: 1 });
        return NextResponse.json({ success: true, data: beliefs });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch beliefs' }, { status: 400 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        // Get the current max order to append to the end
        const lastBelief = await StatementOfFaith.findOne().sort({ order: -1 });
        const newOrder = lastBelief ? lastBelief.order + 1 : 1;

        const belief = await StatementOfFaith.create({ ...body, order: body.order || newOrder });
        return NextResponse.json({ success: true, data: belief });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create belief' }, { status: 400 });
    }
}
