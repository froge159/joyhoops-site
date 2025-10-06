import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '../../clients/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash') ;
    const type = searchParams.get('type') as EmailOtpType;
    const next = searchParams.get('next') ?? '/';
    const cookieStore = cookies();
    const supabase = await createClient();
    // redirect response
    const response = NextResponse.redirect(next);

    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });
        if (!error) {
            response.cookies.delete('pendingEmail');
            return response;
        }
    }    
}