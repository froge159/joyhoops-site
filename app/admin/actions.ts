"use server";

import { createClient } from "../clients/server";
import { createAdminClient } from "../clients/admin";



export async function getClasses() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Class")
        .select("id, active, start_datetime, end_datetime, description, name, location, price")
        .order("start_datetime", { ascending: true });
    if (error) {
        console.error("Error fetching classes", error);
        return { success: false, error: error.message }
    }

    const supabaseAdmin = await createAdminClient();
    const now = new Date();
    for (const cls of data || []) {
        if (cls.active && new Date(cls.end_datetime) < now) {
            const { error: updateError } = await supabaseAdmin
                .from("Class")
                .update({ active: false })
                .eq("id", cls.id);
            if (updateError) {
                console.error(`Error updating class ${cls.id} to inactive`, updateError);
            } else {
                cls.active = false;
            }
        }
    }

    const upcomingClasses = (data || []).filter((cls: any) => new Date(cls.end_datetime) >= now);
    const classIds = upcomingClasses.map((cls: any) => cls.id);

    const { data: enrollmentData } = await supabaseAdmin
        .from("Class_User_Child")
        .select("class_id")
        .in("class_id", classIds);

    const countMap: Record<number, number> = {};
    for (const row of enrollmentData || []) {
        countMap[row.class_id] = (countMap[row.class_id] || 0) + 1;
    }

    const formatted = upcomingClasses.map((cls: any) => ({
        id: cls.id,
        active: cls.active,
        description: cls.description,
        name: cls.name,
        location: cls.location,
        price: cls.price,
        startDatetime: new Date(cls.start_datetime).toISOString(),
        endDatetime: new Date(cls.end_datetime).toISOString(),
        registrantCount: countMap[cls.id] || 0,
    }));
    return { success: true, data: formatted }
}

export async function getRoster(classId: number) {
    const supabaseAdmin = await createAdminClient();
    const { data, error } = await supabaseAdmin
        .from("Class_User_Child")
        .select(
            "child:Child!Class_User_Child_child_id_fkey(first_name, date_of_birth), parent:User!Class_User_Child_user_id_fkey(first_name, last_name, phone)"
        )
        .eq("class_id", classId);
    if (error) {
        console.error(`Error fetching roster for class ${classId}`, error);
        return { success: false, error: error.message };
    }

    const roster = (data || []).map((row: any) => ({
        childName: row.child?.first_name ?? "",
        childDob: row.child?.date_of_birth ?? null,
        parentName: row.parent
            ? `${row.parent.first_name} ${row.parent.last_name}`.trim()
            : "",
        phone: row.parent?.phone ?? "",
    }));
    return { success: true, data: roster };
}
