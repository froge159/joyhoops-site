'use server'
import { createClient } from "@/app/clients/server";
import {getClass, getChildren} from "./actions";
import EnrollmentComponent from "./EnrollmentComponent";

export default async function EnrollmentPage({params}: {params: Promise<{id: string}>}) {
	const { id } = await params;
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();
	const userId = user?.id;


	const classData = (await getClass(id)) ?? [];
	const children = (await getChildren(userId ?? "")) ?? [];

	console.log(JSON.stringify(children));

	return (
		<EnrollmentComponent
			classData = {classData}
			existingChildren = {children}
			userId = {userId ?? ""}
		/>
	)
}