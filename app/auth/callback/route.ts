import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../clients/client";
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            console.error("Error exchanging code for session:", error);
            return NextResponse.json({error: error.message}, { status: 400});
        }
        if (data?.user?.app_metadata?.provider === 'google') {
           const cookieStore = await cookies();
           if (cookieStore.get('pendingFirstName')) {
                const {error: userError} = await supabase.from("User")
                .insert({
                    id: data.user.id,
                    first_name: cookieStore.get('pendingFirstName')?.value,
                    last_name: cookieStore.get('pendingLastName')?.value,
                    address: cookieStore.get('pendingAddress')?.value,
                    date_of_birth: cookieStore.get('pendingDateOfBirth')?.value,
                    phone: cookieStore.get('pendingPhone')?.value,
                });
                if (userError) {
                    console.error("Error creating user profile:", userError);
                    return NextResponse.json({error: userError.message}, { status: 400});
                }
                cookieStore.delete('pendingFirstName');
                cookieStore.delete('pendingLastName');
                cookieStore.delete('pendingAddress');
                cookieStore.delete('pendingDateOfBirth');
                cookieStore.delete('pendingPhone');
           }
        }
    }

     
    const isChanging = request.cookies.get("isChangingPassword")?.value;

    const response = NextResponse.redirect(new URL(isChanging ? "/set-password" : "/user-home", request.url));
    return response;
}  