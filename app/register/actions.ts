'use server'

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

    // sign up — Supabase enforces email uniqueness at the DB level
    const { data: signUpData, error: signUpError } = await admin.auth.signUp({
        email: data.email,
        password: data.password,
    });
    if (signUpError) {
        console.error("Signup error:", signUpError);
        if (signUpError.code === 'user_already_exists') {
            return { success: false, error: "Email already in use." };
        }
        return { success: false, error: signUpError.message };
    }

    const userId = signUpData.user?.id;
    if (!userId) {
        console.error("User ID not found after signup.");
        return { success: false, error: "User ID not found after signup." };
    }

    // sign in immediately so the session cookie is set
    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });
    if (signInError) {
        console.error("Sign-in after signup failed:", signInError);
    }

    // add profile row — clean up auth user if this fails
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
        await admin.auth.admin.deleteUser(userId);
        return { success: false, error: profileError.message };
    }

    return { success: true };
}
