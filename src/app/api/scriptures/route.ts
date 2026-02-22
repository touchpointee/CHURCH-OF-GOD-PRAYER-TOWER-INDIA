import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Scripture from '@/models/Scripture';
import { getLangFromRequest } from '@/lib/resolveLang';
import { resolveField } from '@/lib/resolveLang';

export async function GET(req: Request) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
        return NextResponse.json({ success: false, error: 'Key is required' }, { status: 400 });
    }

    try {
        const lang = getLangFromRequest(req);
        const scripture = await Scripture.findOne({ key });
        if (!scripture) return NextResponse.json({ success: true, data: null });
        const raw = scripture.toObject ? scripture.toObject() : { ...scripture };
        const data = {
            ...raw,
            text: resolveField(raw, 'text', lang) ?? raw.text,
            reference: resolveField(raw, 'reference', lang) ?? raw.reference,
        };
        return NextResponse.json({ success: true, data });
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

        const update: Record<string, unknown> = { text, reference };
        if (body.textHi != null) update.textHi = body.textHi;
        if (body.textMl != null) update.textMl = body.textMl;
        if (body.referenceHi != null) update.referenceHi = body.referenceHi;
        if (body.referenceMl != null) update.referenceMl = body.referenceMl;
        const scripture = await Scripture.findOneAndUpdate(
            { key },
            update,
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, data: scripture });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save scripture' }, { status: 400 });
    }
}
