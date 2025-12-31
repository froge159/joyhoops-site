import { createAdminClient } from "@/app/clients/admin";

export async function GET() {
	const supabase = await createAdminClient();
	const { data, error } = await supabase
		.from("Class")
		.select("id, name, start_datetime, location")
		.order("start_datetime", { ascending: false })
		.limit(1);

	if (error) {
		return new Response(JSON.stringify({ success: false, error: error.message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
	if (!data || data.length === 0) {
		return new Response(JSON.stringify({ success: false, error: "No classes found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}
	const latest = data[0];
	return new Response(
		JSON.stringify({
			success: true,
			data: {
				name: latest.name,
				date: new Date(latest.start_datetime).toISOString(),
				location: latest.location,
			},
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		}
	);
}
