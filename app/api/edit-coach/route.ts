import { NextResponse } from "next/server";
import { createAdminClient } from "../../clients/admin";

export async function PUT(req: Request) {
    try {
        const {id, firstName, lastName, active } = await req.json();
        if (!firstName || !lastName || typeof active !== "boolean") {
            return NextResponse.json(
                { success: false, error: "invalid input data"},
                {status: 400}
            );
        }

        const supabase = await createAdminClient();
        const { data, error } = await supabase
            .from("Coach")
            .update({
                first_name: firstName,
                last_name: lastName,
                active: active,
            })
            .eq("id", id)
            .select()
            .single();
        if (error) {
            console.error("Error editing coach", error);
            return NextResponse.json({ success: false, error: error.message }, {status: 500});
        }

        const coachData = data?.[0] || null;

        return NextResponse.json({
            success: true,
            data: coachData ? {
                id: data.id,
                firstName: data.first_name,
                lastName: data.last_name,
                active: data.active,
                volunteerHours: data.volunteer_hours,
                createdAt: data.created_at.toISOString()
            }
            : null,
        });
    } 
    catch (err: any) {
        console.error("Server error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
