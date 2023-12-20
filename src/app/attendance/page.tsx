import AttendanceComponent from "@/components/Attendance";
import Protected from "@/utils/Protected";

export default async function Attendance() {
  return (
    <Protected>
      <AttendanceComponent />
    </Protected>
  );
}
