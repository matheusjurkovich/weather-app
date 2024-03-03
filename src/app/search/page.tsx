"use client";
import Main from "@/components/main";
import Nav from "@/components/nav";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q");

  return (
    <div>
      <Nav />
      <Main query={search ? search : undefined} />
    </div>
  );
}
