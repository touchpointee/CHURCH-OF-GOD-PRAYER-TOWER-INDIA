import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import About from '@/models/About';
import { getLangFromRequest } from '@/lib/resolveLang';
import { resolveField } from '@/lib/resolveLang';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const lang = getLangFromRequest(request);
        let about = await About.findOne().sort({ updatedAt: -1 });

        if (!about) {
            return NextResponse.json({ success: true, data: {} });
        }

        const raw = about.toObject ? about.toObject() : { ...about };
        const data = {
            ...raw,
            title: resolveField(raw, 'title', lang) ?? raw.title,
            content: resolveField(raw, 'content', lang) ?? raw.content,
        };
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Check if a document already exists
        let about = await About.findOne();

        if (about) {
            // Update existing
            about = await About.findByIdAndUpdate(about._id, body, {
                new: true,
                runValidators: true
            });
        } else {
            // Create new
            about = await About.create(body);
        }

        return NextResponse.json({ success: true, data: about });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
