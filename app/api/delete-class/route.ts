import { NextResponse } from "next/server";
import { createAdminClient } from "../../supabase/admin";

export async function DELETE(req: Request) {
    try {
        const { id  } = await req.json();

        const supabase = await createAdminClient();
        const { data, error } = await supabase
            .from("Class")
            .delete()
            .eq("id", id)
            .select()
            .single();
        if (error) {
            console.error("Error deleting class", error);
            return NextResponse.json({ success: false, error: error.message }, {status: 500});
        }

        const classData = data?.[0] || null;

        return NextResponse.json({
            success: true,
            data: classData ?  {
                id: classData.id,
                active: classData.active,
                description: classData.description,
                name: classData.name,
                location: classData.location,
                volunteerHours: classData.volunteer_hours,
                price: classData.price,
                startDatetime: new Date(classData.start_datetime).toISOString(),
                endDatetime: new Date(classData.end_datetime).toISOString(),
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
