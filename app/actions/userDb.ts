"use server";
import { db } from "@/app/db/index"
import { profiles } from "@/app/db/schema";
import { createClient } from "@/app/db/server"; 
import { User } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";

export async function loginUser(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return { success: false, error: error.message, user: false };
  }

  return { success: true, error: null, user: data.user };
}

export async function signOut() {
  const supabase = await createClient()
  const {error} = await supabase.auth.signOut()

  return {error}
}

export async function currentUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if(user) return {success: true, user: user}
    return {success: false, user: null}
}

export async function getUserMetadata(user: User) {
  const metadata = await db.select().from(profiles).where(eq(profiles.id, user.id))
  return metadata 
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
        category: 'Spatula master'
      })
  }

  return { success: true, error: null };
}

export async function modifyUserBio(userId: string, bio: string) {
  const returning = await db.update(profiles).set({ bio: bio }).where(eq(profiles.id, userId))
  if(returning) return {success: true}
  return {success: false}
}