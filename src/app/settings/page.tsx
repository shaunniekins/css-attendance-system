import SettingsComponent from "@/components/Settings";
import Protected from "@/utils/Protected";

export default async function Settings() {
  return (
    <Protected>
      <SettingsComponent />
    </Protected>
  );
}
