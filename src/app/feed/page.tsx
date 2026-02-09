"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Feed page is now merged into the landing page.
// Redirect any old /feed links back to /.
export default function FeedRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
