import Scan from "@/components/Scan";
import Protected from "@/utils/Protected";

export default async function Home() {
  return (
    <Protected>
      <Scan />
    </Protected>
  );
}
