import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./utils/supabase";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  //   const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}
