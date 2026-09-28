import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto mt-5 grid w-full max-w-7xl grid-cols-1 gap-5 px-4 lg:grid-cols-[220px_minmax(0,1fr)_280px]">
      {/* Left */}
      <div className="hidden lg:block">
        <Skeleton className="h-56 w-full rounded-lg bg-white" />
      </div>

      {/* Feed */}
      <div className="flex min-w-0 flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg bg-white p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />

              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-2/3" />
            </div>

            <Skeleton className="mt-4 h-32 w-full rounded-md" />
          </div>
        ))}
      </div>

      {/* Right */}
      <div className="hidden lg:block">
        <Skeleton className="h-80 w-full rounded-lg bg-white" />
      </div>
    </div>
  );
}
