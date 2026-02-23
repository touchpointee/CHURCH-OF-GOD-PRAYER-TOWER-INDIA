import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DonationPoster from '@/models/DonationPoster';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await context.params;
        const body = await req.json();
        const update: Record<string, unknown> = {};
        if (body.title !== undefined) update.title = body.title;
        if (body.imageUrl !== undefined) update.imageUrl = body.imageUrl;
        if (body.paymentLink !== undefined) update.paymentLink = body.paymentLink;
        if (body.order !== undefined) update.order = body.order;
        const poster = await DonationPoster.findByIdAndUpdate(id, update, { new: true });
        if (!poster) return NextResponse.json({ success: false, error: 'Poster not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: poster });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await context.params;
        const poster = await DonationPoster.findByIdAndDelete(id);
        if (!poster) return NextResponse.json({ success: false, error: 'Poster not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
