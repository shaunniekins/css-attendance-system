import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const authContext = createServerComponentClient({
    cookies: () => req.cookies as any,
  });
  const {
    data: { session },
  } = await authContext.auth.getSession();

  if (!session) {
    return NextResponse.redirect("/signin");
  }

  return NextResponse.next();
}
