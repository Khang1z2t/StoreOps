"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Header from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  return (
    <>
      <Header search={search} onSearchChange={setSearch} user={user} />
      {children}
    </>
  );
}
