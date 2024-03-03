'use client';
import Main from "@/components/main";
import Nav from "@/components/nav";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Search() {
  function Search() {
    const search = useSearchParams();
    return search.get("q");
  }
  const search = Search();
  
  return (
    <Suspense>
      <Nav />
      <Main query={search}/>
    </Suspense>
  );
}
