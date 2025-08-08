'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

interface SignupData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    dateOfBirth: string;
    phone: string;
}

export async function login(data: { email: string; password: string }) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
        console.error("Login error:", error);
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/user-home');
}