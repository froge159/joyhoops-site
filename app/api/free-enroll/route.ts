import { NextResponse } from "next/server";
import { createAdminClient } from "../../clients/admin";

export async function POST(req: Request) {
  try {
    const { userId, classId, childIds } = await req.json();

    if (!userId || !classId || !Array.isArray(childIds) || childIds.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid input data" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    const { data: classData, error: classError } = await supabase
      .from("Class")
      .select("price")
      .eq("id", classId)
      .single();

    if (classError || !classData) {
      return NextResponse.json({ success: false, error: "Class not found" }, { status: 404 });
    }

    if (classData.price !== 0) {
      return NextResponse.json({ success: false, error: "Class is not free" }, { status: 400 });
    }

    const rows = childIds.map((childId: number) => ({
      class_id: Number(classId),
      user_id: userId,
      child_id: Number(childId),
      charge_id: null,
    }));

    const { error } = await supabase
      .from("Class_User_Child")
      .upsert(rows, { onConflict: "class_id,user_id,child_id", ignoreDuplicates: true });

    if (error) {
      console.error("Failed to insert free enrollment:", error);
      return NextResponse.json({ success: false, error: "Failed to record enrollment" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
