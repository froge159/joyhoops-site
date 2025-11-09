'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '../clients/server';
import { createAdminClient } from '../clients/admin';
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
interface OAuthSignUpData {
    firstName: string;
    lastName: string;
    address: string;
    dateOfBirth: string;
    phone: string;
}

export async function setOAuthCookies(data: OAuthSignUpData) {
    const cookieStore = await cookies();
    cookieStore.set('pendingFirstName', data.firstName, { path: '/' });
    cookieStore.set('pendingLastName', data.lastName, { path: '/' });
    cookieStore.set('pendingAddress', data.address, { path: '/' });
    cookieStore.set('pendingDateOfBirth', data.dateOfBirth, { path: '/' });
    cookieStore.set('pendingPhone', data.phone, { path: '/' });
    return { success: true };
}


export async function register(data: SignupData) {
    const admin = await createAdminClient();    

    const { data: user, error: userError} = await admin.auth.admin.listUsers();

    if (userError) {
        console.error("user lookup error:", userError);
        return { success: false, error: userError.message };
    }

    if (user.users.some(u => u.email === data.email)) {
        return { success: false, error: "Email already in use." };
    }

    // sign up user - added to auth.users
    const { data:signUpData, error: signUpError } = await admin.auth.signUp({
        email: data.email,
        password: data.password,
    });
    if (signUpError) {
        console.error("Signup error:", signUpError);
        return { success: false, error: signUpError.message };
    };

    const supabase = await createClient();
    // sign in
    await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });

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

    return {success: true};
}
