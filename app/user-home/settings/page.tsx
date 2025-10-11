'use server'
import { createClient } from "@/app/clients/server";
import SettingsComponent from "./SettingsComponent";
import { createAdminClient } from "@/app/clients/admin";

export default async function EnrollmentPage() {    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    if (!userId) {
        console.error("No user ID found");
        return;
    }
    const email = user?.email || "";

    const { data, error } = await supabase
        .from("User")
        .select("id, phone, first_name, last_name, address, date_of_birth")
        .eq("id", userId)
        .single();
    if (error) {
        console.error("Error fetching user data", error);
        return;
    }

    return (
        <SettingsComponent
            userData={{
                id: data.id,
                firstName: data.first_name,
                lastName: data.last_name,
                email: email,
                phone: data.phone,
                address: data.address,
                dateOfBirth: data.date_of_birth
            }}
        />
    )
}