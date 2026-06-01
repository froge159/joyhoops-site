import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '../../clients/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType;
    const next = searchParams.get('next') ?? '/user-home';
    const supabase = await createClient();

    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });
        if (!error) {
            const response = NextResponse.redirect(new URL(next, request.url));
            response.cookies.delete('pendingEmail');
            return response;
        } else {
            console.error("Supabase verifyOtp error:", error);
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    return NextResponse.redirect(new URL('/', request.url));
}
