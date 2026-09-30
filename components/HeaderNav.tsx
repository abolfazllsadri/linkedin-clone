"use client";

import { Button } from "@/components/ui/button";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { cn } from "cn";
import { Briefcase, HomeIcon, MessageSquare, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <ul className="flex list-none items-center px-6">
      <Link
        href="/"
        className={cn(
          "nav-link relative",
          pathname === "/"
            ? "text-black after:scale-x-100"
            : "text-black/70 after:scale-x-0",
        )}
      >
        <HomeIcon
          className={cn(
            "h-4 w-4 stroke-black/70 sm:h-5 sm:w-5",
            pathname === "/" ? "fill-black" : "fill-transparent",
          )}
        />
        <span className="hidden lg:inline-block">Home</span>
      </Link>

      <Link
        href="/mynetwork"
        className={cn(
          "nav-link relative",
          pathname === "/mynetwork"
            ? "text-black after:scale-x-100"
            : "text-black/70 after:scale-x-0",
        )}
      >
        <UsersIcon
          className={cn(
            "h-4 w-4 stroke-black/70 sm:h-5 sm:w-5",
            pathname === "/mynetwork" ? "fill-black" : "fill-transparent",
          )}
        />
        <span className="hidden lg:inline-block">My Network</span>
      </Link>

      <Link
        href="/jobs"
        className={cn(
          "nav-link relative",
          pathname === "/jobs"
            ? "text-black after:scale-x-100"
            : "text-black/70 after:scale-x-0",
        )}
      >
        <Briefcase
          className={cn(
            "h-4 w-4 stroke-black/70 sm:h-5 sm:w-5",
            pathname === "/jobs" ? "fill-black" : "fill-transparent",
          )}
        />
        <span className="hidden lg:inline-block">Jobs</span>
      </Link>

      <Link
        href="/messaging"
        className={cn(
          "nav-link relative",
          pathname === "/messaging"
            ? "text-black after:scale-x-100"
            : "text-black/70 after:scale-x-0",
        )}
      >
        <MessageSquare
          className={cn(
            "h-4 w-4 stroke-black/70 sm:h-5 sm:w-5",
            pathname === "/messaging" ? "fill-black" : "fill-transparent",
          )}
        />
        <span className="hidden lg:inline-block">Messaging</span>
      </Link>

      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: { avatarBox: { width: "35px", height: "35px" } },
          }}
        />
      </Show>

      <Show when="signed-out">
        <SignInButton>
          <Button className="ml-1 text-xs sm:text-sm">Sign in</Button>
        </SignInButton>
      </Show>
    </ul>
  );
}
