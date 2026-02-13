import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await dbConnect();
        const state = mongoose.connection.readyState;
        const states: Record<number, string> = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
        };
        return NextResponse.json({
            success: true,
            status: states[state] || 'unknown',
            env: process.env.MONGODB_URI ? 'Set' : 'Missing'
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
