import AmenitySuite from "@/components/AmenitySuite";
import SuiteContextSync from "@/components/SuiteContextSync";

export default function Page30A() {
  return (
    <>
      <AmenitySuite />
      {/* Invisible data tracker */}
      <SuiteContextSync market="30a" mode="30a" />
    </>
  );
}
