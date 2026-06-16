import { NextResponse } from "next/server";
import { createAdminClient } from "../../clients/admin";


export async function POST(req: Request) {
  try {
    const { name, description, startDatetime, endDatetime, location, price, active } = await req.json();

    if (!name || !description || !startDatetime || !endDatetime || !location || typeof price !== "number" || typeof active !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    const adminClient = await createAdminClient();
    const { data, error } = await adminClient.functions.invoke('create-class', {
        body: { name, description, startDatetime, endDatetime, location, price, active },
    });

    if (error) {
      console.error("Error adding class:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.class_id });
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
