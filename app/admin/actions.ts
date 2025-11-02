import { createClient } from "../clients/server";
import { createAdminClient } from "../clients/admin";
import { adaptEventHandlers } from "recharts/types/util/types";


// helper functions

async function getCoachTotalClasses(coachId: number) {
    const supabase = await createAdminClient();
    const { count, error } = await supabase
        .from("Class_Coach")
        .select("class_id", { count: "exact", head: true})
        .eq("coach_id", coachId);
    if (error) {
        console.error("Error fetching total classes for coach", error);
        return 0;
    }
    return count || 0;
}

async function getClassTotalChildren(classId: number) {
    const supabase = await createAdminClient();
    const { count, error } = await supabase
        .from("Class_User_Child")
        .select("child_id", { count: "exact", head: true})
        .eq("class_id", classId);
    if (error) {
        console.error("Error fetching total children for class", error);
        return 0;
    }
    return count || 0;
}


// read all classes
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
    const classIds = (data || []).map((cls: any) => cls.id);
    const { data: classCoachRows, error: classCoachError } = await supabaseAdmin
        .from("Class_Coach")
        .select("class_id, coach_id, volunteer_hours")
        .in("class_id", classIds);
    if (classCoachError) {
        console.error("Error fetching class-coach relationships", classCoachError);
        return { success: false, error: classCoachError.message }
    }

    const classIdToCoachIds: Record<number, number[]> = {};
    const classIdToCoachHours: Record<number, Record<number, number>> = {};
    (classCoachRows || []).forEach((row: any) => {
        if (!classIdToCoachIds[row.class_id]) {
            classIdToCoachIds[row.class_id] = [];
        }
        classIdToCoachIds[row.class_id].push(row.coach_id);
        if (!classIdToCoachHours[row.class_id]) classIdToCoachHours[row.class_id] = {};
        classIdToCoachHours[row.class_id][row.coach_id] = row.volunteer_hours ?? 0;
    });

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

    const formatted = (data || []).map((cls: any) => {
        const coachIds = classIdToCoachIds[cls.id] || [];
        const coaches = coachIds.map((id) => ({
            coachId: id,
            volHours: classIdToCoachHours[cls.id]?.[id] ?? 0
        }));
        return {
             id: cls.id,
             active: cls.active,
             description: cls.description,
             name: cls.name,
             location: cls.location,
             price: cls.price,
             startDatetime: new Date(cls.start_datetime).toISOString(),
             endDatetime: new Date(cls.end_datetime).toISOString(),
             coaches
         }
     });
     return { success: true, data: formatted }
}



// read all coaches
export async function getCoaches() {
    const supabase = await createAdminClient();
    const { data: coaches, error } = await supabase
        .from("Coach")
        .select("id")
    if (error) {
        console.error("Error fetching coach", error);
        return { success: false, error: error.message }
    }

    const data = await Promise.all(coaches.map((coach) => getCoach(coach.id).then(res => res.data)))
    return {
        success: true,
        data: data
    }
}
// read individual coach
export async function getCoach(coachId: number) {
    const supabase = await createAdminClient();
    const { data: coach, error } = await supabase
        .from("Coach")
        .select("id, first_name, last_name, active, created_at")
        .eq("id", coachId)
        .single();
    if (error) {
        console.error("Error fetching coach", error);
        return { success: false, error: error.message }
    }
    if (!coach) {
        return { success: false, error: "Coach not found" }
    }
    const totalClasses = await getCoachTotalClasses(coachId);

    const { data: classCoachRows, error: classCoachError } = await supabase
        .from("Class_Coach")
        .select("class_id, volunteer_hours")
        .eq("coach_id", coachId);
    if (classCoachError) {
        console.error("Error fetching class-coach relationships", classCoachError);
        return { success: false, error: classCoachError.message }
    }

    // Fetch all classes for this coach
    const { data: classes, error: classesError } = await supabase
        .from("Class")
        .select("id, start_datetime, end_datetime, location, name")
        .in("id", classCoachRows.map((row) => row.class_id));
    if (classesError) {
        console.error("Error fetching classes for coach", classesError);
        return { success: false, error: classesError.message }
    }

    const now = new Date();
    const classEndById: Record<number, string> = {};
    (classes || []).forEach((c: any) => {
        if (c && c.id != null) classEndById[c.id] = c.end_datetime;
    });

    const volunteerHours = (classCoachRows || [])
        .filter((row: any) => {
            const end = classEndById[row.class_id];
            return end ? new Date(end) <= now : false;
        })
        .reduce((sum: number, row: any) => sum + (row.volunteer_hours || 0), 0);
    
    const {data: updateCoach, error: updateError} = await supabase
        .from("Coach")
        .update({ volunteer_hours: volunteerHours })
        .eq("id", coachId);
    if (updateError) {
        console.error("Error updating coach volunteer hours", updateError);
        return { success: false, error: updateError.message }
    }

    const sortedClasses = (classes || []).sort((a, b) => 
        new Date(b?.start_datetime).getTime() - new Date(a?.start_datetime).getTime()
    );

    const detailedClasses = (sortedClasses || []).map((entry: any) => ({
        id: entry.id,
        startDatetime: new Date(entry.start_datetime).toISOString(),
        volunteerHours: (classCoachRows || []).find((r: any) => r.class_id === entry.id)?.volunteer_hours ?? 0,
        location: entry.location,
        childCount: 0,
        name: entry.name
    }));

    for (const entry of detailedClasses) {
        entry.childCount = await getClassTotalChildren(Number(entry.id));
    }

    return { success: true, data: { 
        firstName: coach.first_name,
        lastName: coach.last_name,
        id: coach.id,
        active: coach.active,
        volunteerHours, 
        createdAt: new Date(coach.created_at).toISOString(),
        totalClasses,
        detailedClasses 
    }};
}



export async function getOrganizationStats() {
    const supabase = await createAdminClient();
    // sum of hours from all coaches
    const { data: totalHoursData, error: totalHoursError } = await supabase
        .from("Coach")
        .select("volunteer_hours")
    if (totalHoursError) {
        console.error("Error fetching total hours", totalHoursError);
        return { success: false, error: totalHoursError.message}
    }
    const totalHours = (totalHoursData || []).reduce((sum, row) => sum + (row.volunteer_hours || 0), 0);

    // classes delivered
    const { count: inactiveClassesCount, error: inactiveClassesError } = await supabase
        .from("Class")
        .select("id", { count: "exact", head: true })
        .eq("active", false);
    if (inactiveClassesError) {
        console.error("Error fetching inactive classes count", inactiveClassesError);
        return { success: false, error: inactiveClassesError.message }
    }
    const classesDelivered = inactiveClassesCount || 0;

    // unique children
    const { count: childrenCount, error: childrenCountError } = await supabase
        .from("Child")
        .select("id", { count: "exact", head: true});
    if (childrenCountError) {
        console.error("Error fetching children count", childrenCountError);
        return { success: false, error: childrenCountError.message }
    }
    const uniqueChildren = childrenCount || 0;

    // active coaches
    const { count: activeCoachesCount, error: activeCoachesError } = await supabase
        .from("Coach")
        .select("id", { count: "exact", head: true})
        .eq("active", true);
    if (activeCoachesError) {
        console.error("Error fetching active coaches count", activeCoachesError);
        return { success: false, error: activeCoachesError.message }
    }
    const activeCoaches = activeCoachesCount || 0;

    // total active classes
    const { count: totalActiveClassesCount, error: totalActiveClassesError } = await supabase
        .from("Class")
        .select("id", { count: "exact", head: true})
        .eq("active", true);
    if (totalActiveClassesError) {
        console.error("Error fetching total active classes count", totalActiveClassesError);
        return { success: false, error: totalActiveClassesError.message }
    }
    const totalActiveClasses = totalActiveClassesCount || 0;

    return {
        success: true,
        data: {
            totalHours,
            classesDelivered,
            uniqueChildren,
            activeCoaches,
            totalActiveClasses
        }
    }
}

export async function getQuickSummaryStats() {
    const supabase = await createAdminClient();
    // avg hours per coach
    const { data: totalHoursData, error: totalHoursError } = await supabase
        .from("Coach")
        .select("volunteer_hours")
    if (totalHoursError) {
        console.error("Error fetching total hours", totalHoursError);
        return { success: false, error: totalHoursError.message}
    }
    const totalHours = (totalHoursData || []).reduce((sum, row) => sum + (row.volunteer_hours || 0), 0);
    const { count: totalCoachesCount, error: totalCoachesError } = await supabase
        .from("Coach")
        .select("id", { count: "exact", head: true})
    if (totalCoachesError) {
        console.error("Error fetching active coaches count", totalCoachesError);
        return { success: false, error: totalCoachesError.message }
    }
    const totalCoaches = totalCoachesCount || 0;
    const avgHoursPerCoach = totalCoaches > 0 ? (totalHours / totalCoaches) : 0;
    // avg classes per coach
    const { count: totalClassesCount, error: totalClassesError } = await supabase
        .from("Class")
        .select("id", { count: "exact", head: true})
    if (totalClassesError) {
        console.error("Error fetching total classes count", totalClassesError);
        return { success: false, error: totalClassesError.message }
    }
    const totalClasses = totalClassesCount || 0;
    const avgClassesPerCoach = totalCoaches > 0 ? (totalClasses / totalCoaches) : 0;

    // avg children per class
    const { count: totalChildrenCount, error: totalChildrenError } = await supabase
        .from("Child")
        .select("id", { count: "exact", head: true});
    if (totalChildrenError) {
        console.error("Error fetching total children count", totalChildrenError);
        return { success: false, error: totalChildrenError.message }
    }
    const totalChildren = totalChildrenCount || 0;
    const avgChildrenPerClass = totalClasses > 0 ? (totalChildren / totalClasses) : 0;
    return {
        success: true,
        data: {
            avgHoursPerCoach,
            avgClassesPerCoach,
            avgChildrenPerClass
        }
    }
}




