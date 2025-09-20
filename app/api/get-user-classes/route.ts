import { createClient } from "../../clients/server"
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const userId = url.pathname.split("/").pop();

        const supabase = await createClient();
        const { data, error } = await supabase
            .from("Class")
            .select("id, name, start_datetime, end_datetime, location, price, description")
        if (error) {
            console.error("Error fetching classes", error);
            return NextResponse.json({ success: false, error: error.message }, {status: 500});
        }

        // get status
        const now = new Date();
        const classIds = data?.map((cls: any) => cls.id) ?? [];
        const { data: junctions, error: junctionError } = await supabase
            .from("Class_User_Child")
            .select("class_id, Class(end_datetime)")
            .eq("user_id", userId)
            .in("class_id", classIds);
        if (junctionError) {
            console.error("Error fetching junctions", junctionError);
            return NextResponse.json({ success: false, error: junctionError.message }, {status: 500});
        }
        const classStatusMap = new Map<string, "available" | "completed" | "enrolled">();

        junctions?.forEach((j: any) => {
            if (new Date(j.end_datetime) < now) {
                classStatusMap.set(j.class_id, "completed");
            } else {
                classStatusMap.set(j.class_id, "enrolled");
            }
        });

        const classesWithStatus = data?.map((cls: any) => ({
            ...cls,
            status: classStatusMap.get(cls.id) ?? "available"
        })) ?? [];

        // get coaches
        const classCoachesMap = new Map<string, any[]>();
        const { data: classCoachData, error: classCoachError } = await supabase
            .from("Class_Coach")
            .select("class_id, Coach(id, first_name, last_name, active, created_at)")
            .in("class_id", classIds);
        if (classCoachError) {
            console.error("Error fetching class coaches", classCoachError);
            return NextResponse.json({ success: false, error: classCoachError.message }, {status: 500});
        }
        classCoachData?.forEach((cc: any) => {
            if (!classCoachesMap.has(cc.class_id)) {
                classCoachesMap.set(cc.class_id, []);
            }
            classCoachesMap.get(cc.class_id)?.push(cc.Coach);
        });
        const classesWithCoaches = classesWithStatus.map((cls: any) => ({
            ...cls,
            coaches: classCoachesMap.get(cls.id) || [],
            enrolledChildren: []
        }));

        return NextResponse.json({ success: true, classes: classesWithCoaches });

    }   
    catch (err: any ) {
        console.error("Server error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }

}1