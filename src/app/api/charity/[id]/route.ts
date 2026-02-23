import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CharityImage from '@/models/CharityImage';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const deleted = await CharityImage.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
