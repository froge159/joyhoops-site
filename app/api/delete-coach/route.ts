import { NextResponse } from "next/server";
import { createAdminClient } from "../../supabase/admin";

export async function DELETE(req: Request) {
    try {
        const { id  } = await req.json();

        const supabase = await createAdminClient();
        const { data, error } = await supabase
            .from("Coach")
            .delete()
            .eq("id", id)
            .select()
            .single();
        if (error) {
            console.error("Error deleting coach", error);
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
                totalHours: data.total_hours,
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
