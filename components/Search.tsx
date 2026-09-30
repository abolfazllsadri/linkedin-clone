"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import type { Post } from "@/lib/types";
import SearchResults from "@/components/SearchResults";
import { useUser } from "@clerk/nextjs";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { user, isLoaded } = useUser();

  function handleSelect(postId: string) {
    setShowResults(false);
    setQuery("");
    setResults([]);
    router.push(`/?postId=${postId}`);
  }

  useEffect(() => {
    if (!isLoaded) return;

    const searchValue = query.trim();

    if (!searchValue) {
      // eslint-disable-next-line
      setResults([]);
      setIsSearching(false);
      return;
    }

    if (!user) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true);

        const response = await fetch(
          `/api/posts/search?q=${encodeURIComponent(searchValue)}`,
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error("Failed to search posts");

        const data = await response.json();

        setResults(data ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;

        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, isLoaded, user]);

  useEffect(() => {
    if (!showResults) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowResults(false);
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      )
        setShowResults(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [showResults]);

  return (
    <form className="w-full" onSubmit={(e) => e.preventDefault()}>
      <div ref={searchRef} className="relative w-full sm:max-w-60">
        <label className="flex h-9 flex-1 cursor-text items-center justify-center rounded-full border border-gray-400 bg-gray-50 p-2.5 font-normal transition focus-within:bg-gray-100 focus-within:outline-2 focus-within:outline-gray-500 hover:bg-gray-100">
          <SearchIcon className="h-4 w-4 stroke-3 text-gray-600" />

          <input
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={query}
            className="w-full flex-1 bg-transparent pl-2.5 text-[15px] outline-none"
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => {
              if (query.trim()) setShowResults(true);
            }}
          />
        </label>

        {showResults && query.trim() && (
          <SearchResults
            results={results}
            onSelect={handleSelect}
            isSearching={isSearching}
            user={user}
          />
        )}
      </div>
    </form>
  );
}
