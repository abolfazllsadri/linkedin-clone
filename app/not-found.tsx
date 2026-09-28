import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-30 flex h-full justify-center px-4">
      <div className="bg-card w-full max-w-md rounded-xl border p-8 text-center shadow-sm">
        <h1 className="text-primary text-6xl font-bold">404</h1>

        <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>

        <p className="text-muted-foreground mt-2 text-sm">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

        <Button asChild className="mt-6">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
