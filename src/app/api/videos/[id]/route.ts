import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15+ / async params
) {
    try {
        await dbConnect();

        // Await params since it's a Promise in newer Next.js versions
        const { id } = await params;

        const deletedVideo = await Video.findByIdAndDelete(id);

        if (!deletedVideo) {
            return NextResponse.json(
                { success: false, error: 'Video not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Video deleted successfully',
            data: deletedVideo
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
