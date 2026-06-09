
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
