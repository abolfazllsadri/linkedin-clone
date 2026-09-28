import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grow",
};

export default function Page() {
  return (
    <div className="scroll mx-auto flex h-full min-h-0 w-full flex-col overflow-y-auto px-4 py-6">
      <div className="space-y-2 p-6">
        <h1 className="text-2xl font-bold">My Network Page</h1>
        <p className="text-xl font-medium">This feature is coming soon...</p>
      </div>
    </div>
  );
}
