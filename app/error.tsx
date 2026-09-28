"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center gap-2 text-2xl">
      <h2 className="font-semibold">Something went wrong!</h2>
      <Button size="lg" className="text-xl" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
