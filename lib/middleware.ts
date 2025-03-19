/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect users to /auth/signUp if they are not logged in and accessing protected pages
  if (!user && !request.nextUrl.pathname.startsWith("/signUp") && !request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/signUp", request.url));
  }

  // ❗ Protect API routes (Example: /api/protected/*)
  if (!user && request.nextUrl.pathname.startsWith("/api/protected")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return supabaseResponse;
}
