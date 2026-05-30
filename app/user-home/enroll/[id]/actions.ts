import { createAdminClient } from "@/app/clients/admin";
import { createClient } from "../../../clients/server";

export async function getClass(id: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Class")
		.select("id, name, start_datetime, end_datetime, location, price, description")
		.eq("id", id)
		.single();
	if (error) {
		console.error("Error fetching class:", error);
		return {success: false, error: "Could not fetch class"};
	}

	return {
		id: data.id,
		name: data.name,
		startDatetime: new Date(data.start_datetime).toISOString(),
		endDatetime: new Date(data.end_datetime).toISOString(),
		location: data.location,
		price: data.price,
		description: data.description,
	};
}

export async function getChildren(userId: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Child")
		.select("id, first_name, date_of_birth")
		.eq("user_id", userId);
	if (error) {
		console.error("Error fetching children:", error);
		return {success: false, error: "Could not fetch children"};
	}

	const result = data.map((child) => ({
		id: child.id,
		name: child.first_name,
		age: Math.floor((new Date().getTime() - new Date(child.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365)),
		dateOfBirth: new Date(child.date_of_birth).toISOString()
	}))
	return result;
}

export async function addChild(userId: string, childFirstName: string, childDateOfBirth: string) {
	if (!childFirstName || !childDateOfBirth) {
		return {success: false, error: "Invalid input data"}
	}

	const supabase = await createAdminClient();
	const { data, error } = await supabase
		.from("Child")
		.insert([
			{ user_id: userId, first_name: childFirstName, date_of_birth: childDateOfBirth }
		])
		.select()
		.single();
	if (error || !data) {
		return {success: false, error: "Could not add child"};
	}
	return {
		success: true,
		data: {
			id: data.id,
			name: data.first_name,
			age: Math.floor((new Date().getTime() - new Date(data.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365)),
			dateOfBirth: new Date(data.date_of_birth).toISOString()
		}
	};
}