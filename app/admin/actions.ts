import { createClient } from "@/lib/supabase/server";
import { adaptEventHandlers } from "recharts/types/util/types";


// helper functions

async function getCoachTotalClasses(coachId: number) {
    const supabase = await createClient();
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
    const supabase = await createClient();
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

// create class
export async function addClass({
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
}) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Class")
        .insert({
            active,
            start_datetime,
            end_datetime,
            description,
            name,
            location,
            volunteer_hours,
            price,
        })
        .select()
        .single();
    if (error) {
        console.error("Error adding class", error);
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
            startDatetime: data.start_datetime,
            endDatetime: data.end_datetime,
        }
    }
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
            startDatetime: cls.start_datetime,
            endDatetime: cls.end_datetime,
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
    const supabase = await createClient();
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
            startDatetime: data.start_datetime,
            endDatetime: data.end_datetime,
        }
    }
}
// delete class
export async function deleteClass(classId: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("Class")
        .delete()
        .eq("id", classId);
    if (error) {
        console.error("Error deleting class", error);
        return { success: false, error: error.message }
    }
    return { success: true }
}


// read all coaches
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
        firstName: coach.first_name,
        lastName: coach.last_name,
        id: coach.id,
        active: coach.active,
        volunteerHours: coach.volunteer_hours,
        totalHours: coach.total_hours,
        classCount: classCountMap.get(coach.id) || 0
    }));

    return { success: true, data: coachesWithClassCounts };
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

    const { data: classes, error: classesError } = await supabase
        .from("Class_Coach")
        .select("class_id, Class:class_id(id, start_datetime, volunteer_hours, total_hours, location)")
        .eq("coach_id", coachId)
        .order("Class.start_datetime", { ascending: false });
    if (classesError) {
        console.error("Error fetching classes for coach", classesError);
        return { success: false, error: classesError.message }
    }

    const detailedClasses = (classes || []).map((entry: any) => ({
        id: entry.Class.id,
        startDatetime: entry.Class.start_datetime,
        volunteerHours: entry.Class.volunteer_hours,
        totalHours: entry.Class.total_hours,
        location: entry.Class.location,
        childCount: 0,
    }));

    detailedClasses.forEach((entry: any) => {
        entry.childCount = getClassTotalChildren(Number(entry.id));
    });

    return { success: true, data: { 
        firstName: coach.first_name,
        lastName: coach.last_name,
        id: coach.id,
        active: coach.active,
        volunteerHours: coach.volunteer_hours,
        totalHours: coach.total_hours,
        createdAt: coach.created_at,
        totalClasses,
        detailedClasses 
    }};
}
// create coach
export async function addCoach(firstName: string, lastName: string, status: boolean) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Coach")
        .insert({
            first_name: firstName,
            last_name: lastName,
            active: status,
        })
        .select()
    if (error) {
        console.error("Error adding coach", error);
        return { success: false, error: error.message }
    }

    type Coach = { id: number, firstName: string, lastName: string, active: boolean};
    const coachData = data as Coach[] | null;

    return { success: true, 
        data: {
            id: coachData?.[0]?.id,
            firstName: coachData?.[0]?.firstName,
            lastName: coachData?.[0]?.lastName,
            active: coachData?.[0]?.active
        }
    };
}
// update coach
export async function editCoach(coachId: number, firstName: string, lastName: string, status: boolean) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Coach")
        .update({
            first_name: firstName,
            last_name: lastName,
            active: status,
        })
        .eq("id", coachId)
        .select()
        .single();
    if (error) {
        console.error("Error editing coach", error);
        return { success: false, error: error.message }
    }

    return {
        success: true,
        data: {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            active: data.active,
            volunteerHours: data.volunteer_hours,
            totalHours: data.total_hours,
            createdAt: data.created_at
        }
    };
}
// delete coach
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




