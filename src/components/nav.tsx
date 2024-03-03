"use client";
import React from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Nav() {
  const [search, setSearch] = React.useState("");

  const router = useRouter();

  const handlesubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search) return;

    router.push(`/search?q=${search}`);
  };

  return (
    <header className="flex items-center justify-between mb-10 max-sm:flex-col gap-4">
      <a href="/">
        <h1 className="text-5xl font-bold">
          Weather <br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            App
          </span>
        </h1>
      </a>
      <form
        className="flex items-center gap-2 bg-slate-800 p-2 shadow-md rounded-full"
        onSubmit={handlesubmit}
      >
        <button type="submit">
          <Search />
        </button>
        <input
          className="p-1 rounded-full bg-slate-800 text-gray-100 focus:outline-none"
          type="text"
          placeholder="Search for a city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    </header>
  );
}
