import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../clients/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            console.error("Error exchanging code for session:", error);
            return NextResponse.json({error: error.message}, { status: 400});
        }
    }

     
    const pendingEmail = request.cookies.get("pendingEmail")?.value;
    const isChanging = request.cookies.get("isChangingPassword")?.value;

    const response = NextResponse.redirect(new URL(pendingEmail ? "/user-home" : isChanging ? "/set-password" : "/", request.url));
    response.cookies.delete("pendingEmail");
    return response;
}