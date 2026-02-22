import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import History from '@/models/History';
import { getLangFromRequest } from '@/lib/resolveLang';
import { resolveField } from '@/lib/resolveLang';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const lang = getLangFromRequest(request);
        const milestones = await History.find({}).sort({ year: 1 });
        const rawList = milestones.map((m) => (m.toObject ? m.toObject() : { ...m }));
        const data = rawList.map((raw: Record<string, unknown>) => ({
            ...raw,
            title: resolveField(raw, 'title', lang) ?? raw.title,
            description: resolveField(raw, 'description', lang) ?? raw.description,
        }));
        return NextResponse.json({ success: true, data });
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
