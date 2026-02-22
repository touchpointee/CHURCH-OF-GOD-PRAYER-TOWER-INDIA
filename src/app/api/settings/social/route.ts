import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SocialSettings from '@/models/SocialSettings';

export async function GET() {
    try {
        await dbConnect();
        // Find the first document (singleton pattern)
        let settings = await SocialSettings.findOne();

        // If no settings exist, return default structure (or create one)
        const raw = settings ? (typeof settings.toObject === 'function' ? settings.toObject() : { ...settings }) : {};
        const data = {
            ...raw,
            contactEmails: Array.isArray(raw.contactEmails) && raw.contactEmails.length
                ? raw.contactEmails
                : (raw.contactEmail ? [raw.contactEmail] : []),
            contactPhones: Array.isArray(raw.contactPhones) && raw.contactPhones.length
                ? raw.contactPhones
                : (raw.contactPhone ? [raw.contactPhone] : []),
        };
        if (!settings) {
            Object.assign(data, {
                facebookUrl: '', youtubeUrl: '', instagramUrl: '', whatsappUrl: '',
                contactEmail: '', contactPhone: '', contactEmails: [], contactPhones: [],
            });
        }
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const contactEmails = Array.isArray(body.contactEmails) ? body.contactEmails.filter((e: string) => e?.trim()) : [];
        const contactPhones = Array.isArray(body.contactPhones) ? body.contactPhones.filter((p: string) => p?.trim()) : [];
        const payload = { ...body, contactEmails, contactPhones };

        const settings = await SocialSettings.findOneAndUpdate(
            {},
            { $set: payload },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        const raw = settings ? (typeof settings.toObject === 'function' ? settings.toObject() : { ...settings }) : {};
        const data = {
            ...raw,
            contactEmails: Array.isArray(raw.contactEmails) ? raw.contactEmails : (raw.contactEmail ? [raw.contactEmail] : []),
            contactPhones: Array.isArray(raw.contactPhones) ? raw.contactPhones : (raw.contactPhone ? [raw.contactPhone] : []),
        };
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
