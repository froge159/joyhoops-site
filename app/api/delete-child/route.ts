import { NextResponse } from "next/server";
import { createAdminClient } from "../../clients/admin"; 

export async function DELETE(req: Request) {
  try {
    const { childId } = await req.json();

    if (!childId) {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();
    const { data, error } = await supabase
        .from("Child")
        .delete()
        .eq("id", childId)
        .select()
        .single();
    if (error) {
        console.error("Error deleting child:", error);
        throw new Error(error.message || "Could not delete child");
    }
    return NextResponse.json({
        success: true,
        data: {
            id: data.id,
            name: data.first_name,
            age: Math.floor((new Date().getTime() - new Date(data.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365)),
            dateOfBirth: new Date(data.date_of_birth).toISOString()
        }
    });
  } catch (err: any) {
        console.error("Server error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
  }
}


