"use server";
import { db } from "@/app/db/index"
import { profiles } from "@/app/db/schema";
import { createClient } from "@/app/db/server";

export async function loginUser(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return { success: false, error: error.message, user: true };
  }

  return { success: true, error: null, user: data.user };
}

export async function currentUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user
}


export async function registerUser(email: string, password: string, username: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (error) {
    console.log(error)
    return{ success: false, error: error.message}
  }
  if (data.user) {
    await db.insert(profiles).values({ 
        id: data.user.id,
        name: username, 
        isActive: false,
      })
  }

  return { success: true, error: null };
}