import { createClient } from "../../clients/server"
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const userId = url.pathname.split("/").pop();
        const supabase = await createClient();
        // get enrolled classes
        const { data: enrolledClasses, error: enrolledClassesError } = await supabase
            .from("Class_User_Child")
            .select("class_id, Class(start_datetime, end_datetime)")
            .eq("user_id", userId);
        if (enrolledClassesError) {
            console.error("Error fetching classes", enrolledClassesError);
            return NextResponse.json({ success: false, error: enrolledClassesError.message }, { status: 500 });
        }
        // get unenrolled classes
        const { data: unenrolledClasses, error: unenrolledClassesError } = await supabase
            .from("Class")
            .select("id")
            .not("id", "in", `(${enrolledClasses?.map((cls: any) => cls.class_id).join(",")})`);
        if (unenrolledClassesError) {
            console.error("Error fetching classes", unenrolledClassesError);
            return NextResponse.json({ success: false, error: unenrolledClassesError.message }, { status: 500 });
        }

        let upcoming = 0;
        let completed = 0;
        let totalHours = 0;
        enrolledClasses.forEach((cls: any) => {
            const now = new Date();
            const endDate = new Date(cls.Class.end_datetime);
            const startDate = new Date(cls.Class.start_datetime);
            if (endDate < now) {
                completed++;
                const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
                totalHours += duration;
            }
            else upcoming++;
        });

        return NextResponse.json({
            success: true,
            data: {
                upcomingClasses: upcoming,
                classesCompleted: completed,
                totalHours,
                availableClasses: unenrolledClasses.length
            }
        })
    }
    catch (error) {
        console.error("Error in get-user-stats", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}