import { createClient } from "@/lib/supabase/server";

export async function getOrganizationStats() {
    const supabase = await createClient();
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
    const supabase = await createClient();
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

export async function getCoaches() {
    const supabase = await createClient();
    const { data: coaches, error } = await supabase
        .from("Coach")
        .select("id, first_name, last_name, active, volunteer_hours, total_hours")
        .order("last_name", { ascending: true});
    if (error) {
        console.error("Error fetching coaches", error);
        return { success: false, error: error.message }
    }

    const coachIds = coaches?.map(coach => coach.id) || [];
    const { data: classCounts, error: classCountsError } = await supabase
        .from("Class_Coach")
        .select("coach_id, class_id", { count: "exact", head: false })
        .in("coach_id", coachIds);
    if (classCountsError) {
        console.error("Error fetching class counts per coach", classCountsError);
        return { success: false, error: classCountsError.message }
    }

    const classCountMap = new Map<string, number>();
    (classCounts || []).forEach((row: any) => {
        classCountMap.set(row.coach_id, (classCountMap.get(row.coach_id) || 0) + 1);
    });

    const coachesWithClassCounts = (coaches || []).map(coach => ({
        ...coach,
        classCount: classCountMap.get(coach.id) || 0
    }));

    return { success: true, data: coachesWithClassCounts };
}

export async function addCoach(firstName: string, lastName: string, status: string) {
    const isActive = status === "active";
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Coach")
        .insert({
            first_name: firstName,
            last_name: lastName,
            active: isActive,
        });
    if (error) {
        console.error("Error adding coach", error);
        return { success: false, error: error.message }
    }

    return { success: true, data };
}

export async function editCoach(coachId: number, firstName:string, lastName: string, status: string) {
    const isActive = status === "active";
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Coach")
        .update({
            first_name: firstName,
            last_name: lastName,
            active: isActive,
        })
        .eq("id", coachId);
    if (error) {
        console.error("Error editing coach", error);
        return { success: false, error: error.message }
    }

    return { success: true, data };
}

export async function deleteCoach(coachId: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("Coach")
        .delete()
        .eq("id", coachId);
    if (error) {
        console.error("Error deleting coach", error);
        return { success: false, error: error.message }
    }

    return { success: true };
}
// TODO: add coach total hours attribute, delete code that manually calculated this
// TODO: check functions above for correctness
export async function getCoach(coachId: number) {
    const supabase = await createClient();
    const { data: coach, error } = await supabase
        .from("Coach")
        .select("id, first_name, last_name, active, ")
}

