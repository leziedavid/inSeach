"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeScreen from "@/components/page/HomeScreen";

export default function Page() {
  // rien n’a besoin d’être rendu
  return (
    <>

      <HomeScreen />

    </>
  )
}
