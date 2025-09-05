import { NextResponse } from "next/server";
import { createAdminClient } from "../../supabase/admin";

export async function PUT(req: Request) {
    try {
        const { id, name, description, startDatetime, endDatetime, location, volunteerHours, price, active } = await req.json();
        if (!name || !description || !location || typeof active !== "boolean") {
            return NextResponse.json(
                { success: false, error: "invalid input data"},
                {status: 400}
            );
        }

        const supabase = await createAdminClient();
        const { data, error } = await supabase
            .from("Coach")
            .update({
                name: name,
                description: description,
                start_datetime: startDatetime,
                end_datetime: endDatetime,
                location: location,
                volunteer_hours: volunteerHours,
                price: price,
                active: active,
            })
            .eq("id", id)
            .select()
            .single();
        if (error) {
            console.error("Error editing class", error);
            return NextResponse.json({ success: false, error: error.message }, {status: 500});
        }

        const classData = data?.[0] || null;

        return NextResponse.json({
            success: true,
            data: classData ? {
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
