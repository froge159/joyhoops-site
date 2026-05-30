import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../clients/server";
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    let next = searchParams.get('next') ?? '/user-home';
    if (!next.startsWith('/')) {
        next = '/user-home';
    }

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Create User profile for OAuth sign-ups in all environments
            const cookieStore = await cookies();
            if (cookieStore.get('pendingFirstName')) {
                const { error: userError } = await supabase.from("User").insert({
                    id: data.user.id,
                    first_name: cookieStore.get('pendingFirstName')?.value,
                    last_name: cookieStore.get('pendingLastName')?.value,
                    address: cookieStore.get('pendingAddress')?.value,
                    date_of_birth: cookieStore.get('pendingDateOfBirth')?.value,
                    phone: cookieStore.get('pendingPhone')?.value,
                });
                if (userError) {
                    console.error("Error creating user profile:", userError);
                    return NextResponse.json({ error: userError.message }, { status: 400 });
                }
                cookieStore.delete('pendingFirstName');
                cookieStore.delete('pendingLastName');
                cookieStore.delete('pendingAddress');
                cookieStore.delete('pendingDateOfBirth');
                cookieStore.delete('pendingPhone');
            }

            const forwardedHost = request.headers.get('x-forwarded-host');
            if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            }
            return NextResponse.redirect(new URL(next, origin));
        } else {
            console.error("Error exchanging code for session:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    return NextResponse.redirect(new URL('/user-home', request.url));
}
