"use client";
import { useTestContext } from "../layout";

export default function TestPage() {
  const uid = useTestContext(); // Access the value from the context

  return (
    <div>
      <p>Test Page</p>
      <p>UID: {uid}</p> {/* Display the UID */}
    </div>
  );
}
