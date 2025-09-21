'use server';

import { createClient } from "../clients/server";

export async function getUserClasses(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Class")
        .select("id, name, start_datetime, end_datetime, location, price, description")
    if (error) {
        console.error("Error fetching classes", error);
        return {success: false, error: error.message };
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
        return {success: false, error: junctionError.message };
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
        return {success: false, error: classCoachError.message };
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

    return { success: true, classes: classesWithCoaches };
}

export async function getUserStats(userId: string) {
    const supabase = await createClient();
    // get enrolled classes
    const { data: enrolledClasses, error: enrolledClassesError } = await supabase
        .from("Class_User_Child")
        .select("class_id, Class(start_datetime, end_datetime)")
        .eq("user_id", userId);
    if (enrolledClassesError) {
        console.error("Error fetching classes", enrolledClassesError);
        return { success: false, error: enrolledClassesError.message };
    }
    // get unenrolled classes
    const { data: unenrolledClasses, error: unenrolledClassesError } = await supabase
        .from("Class")
        .select("id")
        .not("id", "in", `(${enrolledClasses?.map((cls: any) => cls.class_id).join(",")})`);
    if (unenrolledClassesError) {
        console.error("Error fetching classes", unenrolledClassesError);
        return { success: false, error: unenrolledClassesError.message };
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

    return {
        success: true,
        data: {
            upcomingClasses: upcoming,
            classesCompleted: completed,
            totalHours,
            availableClasses: unenrolledClasses.length
        }
    }
}