import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { value, remove } = await request.json();

    const response = NextResponse.json({ message: "Cookie set!" });

    if (remove) {
        response.cookies.delete(value);
        return response;
    }
    response.cookies.set(value, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/", 
    });

    return response;
}
