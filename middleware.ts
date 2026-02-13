import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './src/lib/auth';
import { getSession } from './src/lib/auth';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Exclude login page from protection
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Verify session
        const session = request.cookies.get('session')?.value;
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Refresh session if needed
        return await updateSession(request);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
