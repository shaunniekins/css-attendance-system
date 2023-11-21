import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import Scan from "@/components/Scan";
import { getSession } from "@/context/auth";

export default async function Home() {
  try {
    await getSession(cookies);
  } catch (error) {
    return redirect("/signin");
  }

  return <Scan />;
}
