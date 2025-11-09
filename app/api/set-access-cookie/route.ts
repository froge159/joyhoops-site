import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { name, value, remove } = await request.json();

    const response = NextResponse.json({ message: "Cookie set!" });

    if (remove) {
        response.cookies.delete(name);
        return response;
    }
    response.cookies.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/", 
        maxAge: 3600, 
    });

    return response;
}
