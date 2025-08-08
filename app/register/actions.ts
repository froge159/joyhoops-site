'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';

interface SignupData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    dateOfBirth: string;
    phone: string;
}


export async function register(data: SignupData) {
    const supabase = await createClient();
    const admin = await createAdminClient();    

    // check if email already exists
    const { data: existingUser, error: userError } = await admin
        .from('auth.users')
        .select('id')
        .eq('email', data.email)
        .single();
    if (existingUser) {
        return { success: false, error: "Email already registered." };
    }
    
    // sign up user - added to auth.users
    const { data:signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    });
    if (signUpError) {
        console.error("Signup error:", signUpError);
        return { success: false, error: signUpError.message };
    };

    // obtain user id
    const userId = signUpData.user?.id;
    if (!userId) {
        console.error("User ID not found after signup.");
        return { success: false, error: "User ID not found after signup." };
    }

    // add user to User table
    const { error: profileError } = await admin
        .from("User")
        .insert({
            id: userId,
            first_name: data.firstName,
            last_name: data.lastName,
            address: data.address,
            date_of_birth: data.dateOfBirth,
            phone: data.phone,
        });
    if (profileError) {
        console.error("Profile creation error:", profileError);
        return { success: false, error: profileError.message };
    }

    // revalidate home, set cookie, and return success
    revalidatePath('/', 'layout');
    (await cookies()).set('pendingEmail', data.email, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
    });
    return {success: true};
}