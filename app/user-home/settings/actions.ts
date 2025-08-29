'use server'
import { createAdminClient } from "@/lib/supabase/admin";

export default async function deleteAccount(userId: string) {
    const supabase = await createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
        console.error("error deleting user:", error);
        return { success: false, error: error.message }; 
    }
    return { success: true };
}