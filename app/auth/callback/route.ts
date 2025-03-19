import { createClient } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/auth/error");
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Exchange Code Error:", error.message);
    return NextResponse.redirect("/auth/auth-code-error");
  }

  const next = searchParams.get("next") || "/";
  const host = request.headers.get("host") || process.env.NEXT_PUBLIC_SITE_URL || "localhost:3000";

  return NextResponse.redirect(`https://${host}${next}`);
}
