'use server';

import { createClient } from "../clients/server";

export async function getUserClasses(userId: string) {
    const supabase = await createClient();
    const { data: classes, error } = await supabase
        .from("Class")
        .select("id, name, start_datetime, end_datetime, location, price, description, active")
    if (error) {
        console.error("Error fetching classes", error);
        return {success: false, error: error.message };
    }
    const data = (classes ?? []).filter((cls: any) => cls.active === true);
    // get status
    const now = new Date();
    const classIds = data?.map((cls: any) => cls.id) ?? [];
    const { data: junctions, error: junctionError } = await supabase
        .from("Class_User_Child")
        .select("class_id, child_id, Child(first_name, date_of_birth), Class(end_datetime)")
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

    // get children
    const enrolledChildrenMap = new Map<string, any[]>();
    junctions?.forEach((j: any) => {
        if (!enrolledChildrenMap.has(j.class_id)) {
            enrolledChildrenMap.set(j.class_id, []);
        }
        enrolledChildrenMap.get(j.class_id)?.push({
            id: j.child_id,
            name: j.Child.first_name,
            age: Math.floor((new Date().getTime() - new Date(j.Child.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365)),
        });
    });

    const classesWithChildren = classesWithStatus.map((cls: any) => ({
        ...cls,
        enrolledChildren: enrolledChildrenMap.get(cls.id) || []
    }));

    return { success: true, classes: classesWithChildren };
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
    // deduplicate by class_id
    const uniqueClassesMap = new Map<string, any>();
    enrolledClasses.forEach((cls: any) => {
        if (!uniqueClassesMap.has(cls.class_id)) {
            uniqueClassesMap.set(cls.class_id, cls);
        }
    });
    const uniqueEnrolledClasses = Array.from(uniqueClassesMap.values());

    // get unenrolled classes
    const { data: unenrolledClasses, error: unenrolledClassesError } = await supabase
        .from("Class")
        .select("id")
        .not("id", "in", `(${uniqueEnrolledClasses.map((cls: any) => cls.class_id).join(",")})`);
    if (unenrolledClassesError) {
        console.error("Error fetching classes", unenrolledClassesError);
        return { success: false, error: unenrolledClassesError.message };
    }

    let upcoming = 0;
    let completed = 0;
    let totalHours = 0;
    uniqueEnrolledClasses.forEach((cls: any) => {
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