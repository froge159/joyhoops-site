import { NextResponse } from "next/server";
import { createAdminClient } from "../../supabase/admin"; 

export async function POST(req: Request) {
  try {
    const { id, firstName, lastName, status } = await req.json();

    if (!firstName || !lastName || typeof status !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("Coach")
      .insert({
        id: id,
        first_name: firstName,
        last_name: lastName,
        active: status,
      })
      .select();

    if (error) {
      console.error("Error adding coach:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const coachData = data?.[0] || null;

    return NextResponse.json({
      success: true,
      data: coachData
        ? {
            id: coachData.id,
            firstName: coachData.first_name,
            lastName: coachData.last_name,
            active: coachData.active,
          }
        : null,
    });
  } catch (err: any) {
        console.error("Server error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
  }
}
