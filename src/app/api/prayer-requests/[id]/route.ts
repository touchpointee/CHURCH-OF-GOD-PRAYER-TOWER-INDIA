import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PrayerRequest from '@/models/PrayerRequest';

export async function DELETE(
    _request: Request,
    props: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const { id } = await props.params;
        const request = await PrayerRequest.findByIdAndDelete(id);
        if (!request) {
            return NextResponse.json({ success: false, error: 'Prayer request not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
