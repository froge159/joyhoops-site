'use server'
import UserHomePage from "./UserComponent";
import { createClient } from "../clients/server";
import {getUserClasses, getUserStats} from "./actions";

export default async function UserHome() {
  const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();
	const userId = user?.id;


  const classes = (await getUserClasses(userId ?? "")).classes ?? [];
  const stats = (await getUserStats(userId ?? "")).data ?? {
    upcomingClasses: 0,
    totalHours: 0,
    availableClasses: 0,
    classesCompleted: 0
  };

	const name = user?.user_metadata?.full_name;
  
  return (
    <UserHomePage
        classes={classes}
				userStats={stats}
				name={name ?? "User"}
    />
  )
}