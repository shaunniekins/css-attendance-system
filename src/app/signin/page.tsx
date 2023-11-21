import SigninComponent from "@/components/Signin";
import { supabase } from "@/utils/supabase";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Signin() {
  const authContext = createServerComponentClient({
    cookies,
  });
  const {
    data: { session },
  } = await authContext.auth.getSession();

  if (session) {
    return redirect("/");
  }
  return <SigninComponent />;
}

// export default async function Signin() {
//   const authContext = createServerComponentClient({
//     cookies,
//   });
//   const {
//     data: { session },
//   } = await authContext.auth.getSession();
//   const { data, error } = await supabase.auth.getUser();

//   if (data) {
//     return redirect("/");
//   }
//   return <SigninComponent />;
// }
