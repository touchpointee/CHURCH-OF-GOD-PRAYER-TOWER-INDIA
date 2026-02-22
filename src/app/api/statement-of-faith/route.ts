import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import StatementOfFaith from '@/models/StatementOfFaith';
import { getLangFromRequest } from '@/lib/resolveLang';
import { resolveField } from '@/lib/resolveLang';

export async function GET(request: Request) {
    await dbConnect();
    try {
        const lang = getLangFromRequest(request);
        const beliefs = await StatementOfFaith.find({}).sort({ order: 1, createdAt: 1 });
        const rawList = beliefs.map((b) => (b.toObject ? b.toObject() : { ...b }));
        const data = rawList.map((raw: Record<string, unknown>) => ({
            ...raw,
            content: resolveField(raw, 'content', lang) ?? raw.content,
        }));
        return NextResponse.json({ success: true, data });
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
