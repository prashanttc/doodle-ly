import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";

const page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/auth/signUp");
  }
};

export default page;
