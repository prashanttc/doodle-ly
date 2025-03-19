"use server";
import { redirect } from "next/navigation";
import { createClient } from "../lib/server";

export const signInwithAuth = async () => {
  const supabase =await createClient();
  const auth_callback_url = "http://localhost:3000/auth/callback";
  const{data,error}= await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: auth_callback_url,
    },
  });
  if(error){
    console.log(error)

  }if(data.url){
  redirect(data.url)
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.log("Sign out error:", error);
  } else {
    redirect("/auth/signUp");
  }
};
