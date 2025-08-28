import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            console.error("Error exchanging code for session:", error);
            return NextResponse.json({error: error.message}, { status: 400});
        }

        return NextResponse.redirect(requestUrl.origin);
    }
}