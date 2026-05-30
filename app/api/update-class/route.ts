import { NextResponse } from "next/server";
import { createAdminClient } from "../../clients/admin";

export async function PUT(req: Request) {
  try {
    const { id, name, description, startDatetime, endDatetime, location, price, active } = await req.json();

    if (!id || !name || !description || !startDatetime || !endDatetime || !location || typeof price !== "number" || typeof active !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    const adminClient = await createAdminClient();
    const { data, error } = await adminClient.functions.invoke('update-class', {
        body: {
            id,
            name,
            description,
            start_datetime: startDatetime,
            end_datetime: endDatetime,
            location,
            price,
            active,
        }
    });

    if (error) {
      console.error("Error updating class:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
