import { createClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";
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
        .select("id, active, start_datetime, end_datetime, description, name, location, volunteer_hours, price")
        .order("start_datetime", { ascending: true });
    if (error) {
        console.error("Error fetching classes", error);
        return { success: false, error: error.message }
    }
    // Format date/time for each class
    const formatted = (data || []).map((cls: any) => {
        return {
            id: cls.id,
            active: cls.active,
            description: cls.description,
            name: cls.name,
            location: cls.location,
            volunteerHours: cls.volunteer_hours,
            price: cls.price,
            startDatetime: new Date(cls.start_datetime).toISOString(),
            endDatetime: new Date(cls.end_datetime).toISOString(),
        }
    });
    return { success: true, data: formatted }
}
// update class
export async function editClass(
    classId: number,
    {
        active,
        start_datetime,
        end_datetime,
        description,
        name,
        location,
        volunteer_hours,
        price,
    }: {
        active: boolean,
        start_datetime: string,
        end_datetime: string,
        description: string,
        name: string,
        location: string,
        volunteer_hours: number,
        price: number,
    }
) {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
        .from("Class")
        .update({
            active,
            start_datetime,
            end_datetime,
            description,
            name,
            location,
            volunteer_hours,
            price,
        })
        .eq("id", classId)
        .select()
        .single();
    if (error) {
        console.error("Error editing class", error);
        return { success: false, error: error.message }
    }
    return {
        success: true,
        data: {
            id: data.id,
            active: data.active,
            description: data.description,
            name: data.name,
            location: data.location,
            volunteerHours: data.volunteer_hours,
            price: data.price,
            startDatetime: data.start_datetime.toISOString(),
            endDatetime: data.end_datetime.toISOString(),
        }
    }
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
    const supabase = await createClient();
    const { data: coach, error } = await supabase
        .from("Coach")
        .select("id, first_name, last_name, active, total_hours, volunteer_hours, created_at")
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
        .select("class_id")
        .eq("coach_id", coachId);
    if (classCoachError) {
        console.error("Error fetching class-coach relationships", classCoachError);
        return { success: false, error: classCoachError.message }
    }
    const { data: classes, error: classesError } = await supabase
        .from("Class")
        .select("id, start_datetime, volunteer_hours, location")
        .in("id", classCoachRows.map((row) => row.class_id));
    if (classesError) {
        console.error("Error fetching classes for coach", classesError);
        return { success: false, error: classesError.message }
    }
    const sortedClasses = (classes || []).sort((a, b) => 
        new Date(b?.start_datetime).getTime() - new Date(a?.start_datetime).getTime()
    );

    const detailedClasses = (sortedClasses || []).map((entry: any) => ({
        id: entry.id,
        startDatetime: entry.start_datetime.toISOString(),
        volunteerHours: entry.volunteer_hours,
        totalHours: entry.total_hours,
        location: entry.location,
        childCount: 0,
    }));

    detailedClasses.forEach(async (entry: any) => {
        entry.childCount = await getClassTotalChildren(Number(entry.id));
    });

    return { success: true, data: { 
        firstName: coach.first_name,
        lastName: coach.last_name,
        id: coach.id,
        active: coach.active,
        volunteerHours: coach.volunteer_hours,
        totalHours: coach.total_hours,
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
        .select("volunteer_hours.sum()")
    if (totalHoursError) {
        console.error("Error fetching total hours", totalHoursError);
        return { success: false, error: totalHoursError.message}
    }
    const totalHours = totalHoursData[0].sum || 0;

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
        .select("volunteer_hours.sum()")
    if (totalHoursError) {
        console.error("Error fetching total hours", totalHoursError);
        return { success: false, error: totalHoursError.message}
    }
    const totalHours = totalHoursData[0].sum || 0;
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




