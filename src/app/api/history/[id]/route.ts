import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import History from '@/models/History';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const milestone = await History.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!milestone) {
            return NextResponse.json({ success: false, error: 'Milestone not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: milestone });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const deletedMilestone = await History.findByIdAndDelete(id);
        if (!deletedMilestone) {
            return NextResponse.json({ success: false, error: 'Milestone not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
