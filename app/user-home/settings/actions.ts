'use server'

import { createAdminClient } from "@/lib/supabase/admin";


export async function deleteAccount() {
    const supabase = await createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "No user logged in." };
    }
    const userId = user.id;

    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
        console.error("error deleting user:", error);
        return { success: false, error: error.message };
    }

    console.log(userId);
    return { success: true };
}