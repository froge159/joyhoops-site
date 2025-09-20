import { NextResponse } from "next/server";
import { createAdminClient } from "../../clients/admin"; 


export async function POST(req: Request) {
  try {
    const { name, id, description, startDatetime, endDatetime, location, volunteerHours, price, active, coaches} = await req.json();

    if (!coaches || !id || !name || !description || !startDatetime || !endDatetime || !location || typeof volunteerHours !== "number" || typeof price !== "number" || typeof active !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    const adminClient = await createAdminClient();
    const { data, error } = await adminClient.functions.invoke('create-class', {
        body: {
            id: id,
            name: name,
            description: description,
            startDatetime: startDatetime,
            endDatetime: endDatetime,
            location: location,
            volunteerHours: volunteerHours,
            price: price,
            active: active,
            coaches: coaches
        }
    });

    if (error) {
      console.error("Error adding class:", error);
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
