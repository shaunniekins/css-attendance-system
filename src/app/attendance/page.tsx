import AttendanceComponent from "@/components/Attendance";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/context/auth";

export default async function Attendance() {
  try {
    await getSession(cookies);
  } catch (error) {
    return redirect("/signin");
  }

  return <AttendanceComponent />;
}
