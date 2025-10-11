'use server'
import { createAdminClient } from "../../clients/admin";

export async function deleteAccount(userId: string) {
    const supabase = await createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
        console.error("error deleting user:", error);
        return { success: false, error: error.message }; 
    }
    return { success: true };
}

export async function updatePassword(userId: string, newPassword: string) {
    const supabase = await createAdminClient();

    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword,
    });
    if (updateError) {
        return { success: false, error: updateError.message };
    }
    return { success: true };
}