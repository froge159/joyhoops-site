'use server'
import UserHomePage from "./UserComponent";
import { createClient } from "../clients/server";

export default async function UserHome() {
  const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();
	const userId = user?.id;


  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-user-classes/${userId}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user classes");
  }
  const classes = (await response.json()).classes;

	const response2 = await fetch(`/api/get-user-stats/${userId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	});
	if (!response2.ok) {
		throw new Error("Failed to fetch user stats");
	}
	const stats = (await response2.json()).data;
  
  return (
    <UserHomePage
        classes={classes}
				userStats={stats}
    />
  )
}