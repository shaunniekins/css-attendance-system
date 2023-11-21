// auth.ts
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/utils/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession(cookies: any) {
  const authContext = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await authContext.auth.getSession();

  if (!session) {
    throw new Error("No session");
  }

  return session;
}

// auth.ts
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { supabase } from "@/utils/supabase";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export async function getSession(cookies: any) {
//   const authContext = createServerComponentClient({
//     cookies,
//   });

//   const {
//     data: { session },
//   } = await authContext.auth.getSession();

//   const { data, error } = await supabase.auth.getUser();

//   if (!data) {
//     throw new Error("No session");
//   }

//   return data;
// }
