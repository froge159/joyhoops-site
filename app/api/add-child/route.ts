import { NextResponse } from "next/server";
import { createAdminClient } from "../../clients/admin"; 

export async function POST(req: Request) {
  try {
    const { userId, childFirstName, childDateOfBirth } = await req.json();

    if (!childFirstName || !childDateOfBirth) {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();
	const { data, error } = await supabase
		.from("Child")
		.insert([
            { user_id: userId, first_name: childFirstName, date_of_birth: childDateOfBirth }
        ])
		.select()
		.single();
	if (error) {
		console.error("Error adding child:", error);
		throw new Error(error.message || "Could not add child");
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
