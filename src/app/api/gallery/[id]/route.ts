import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GalleryImage from '@/models/GalleryImage';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const body = await request.json();

        const updatedImage = await GalleryImage.findByIdAndUpdate(
            id,
            { title: body.title },
            { new: true }
        );

        if (!updatedImage) {
            return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedImage });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const deletedImage = await GalleryImage.findByIdAndDelete(id);

        if (!deletedImage) {
            return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
        }

        // Note: In a production app, we would also delete the file from MinIO here.
        // For now, we are just removing the database record as per the scope.

        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
