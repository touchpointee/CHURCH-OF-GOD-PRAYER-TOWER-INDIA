import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';
import { getLangFromRequest } from '@/lib/resolveLang';
import { resolveField } from '@/lib/resolveLang';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const lang = getLangFromRequest(request);
        const video = await Video.findById(id);

        if (!video) {
            return NextResponse.json(
                { success: false, error: 'Video not found' },
                { status: 404 }
            );
        }

        const raw = video.toObject ? video.toObject() : { ...video };
        const data = {
            ...raw,
            title: resolveField(raw, 'title', lang) ?? raw.title,
        };
        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const updatedVideo = await Video.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedVideo) {
            return NextResponse.json(
                { success: false, error: 'Video not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Video updated successfully',
            data: updatedVideo
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

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
