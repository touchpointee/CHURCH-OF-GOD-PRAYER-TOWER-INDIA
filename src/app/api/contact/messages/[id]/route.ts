import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';

export async function DELETE(
    _request: Request,
    props: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const { id } = await props.params;
        const message = await ContactMessage.findByIdAndDelete(id);
        if (!message) {
            return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
