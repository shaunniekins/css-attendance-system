import SettingsComponent from "@/components/Settings";
import { getSession } from "@/context/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Settings() {
  try {
    await getSession(cookies);
  } catch (error) {
    return redirect("/signin");
  }
  return <SettingsComponent />;
}
