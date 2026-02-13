import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const formData = new FormData();
    formData.append('username', body.username);
    formData.append('password', body.password);

    const success = await login(formData);

    if (success) {
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
}
