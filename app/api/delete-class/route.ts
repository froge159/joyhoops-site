import { NextResponse } from "next/server";
import { createAdminClient } from "../../clients/admin"; 

export async function DELETE(req: Request) {
  try {
    const { id  } = await req.json();

    if (!id ) {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    const adminClient = await createAdminClient();
    const { data, error } = await adminClient.functions.invoke('delete-class', {
        body: {
            id
        }
    });

    if (error) {
      console.error("Error deleting class:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true
    });
  } catch (err: any) {
        console.error("Server error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
  }
}
