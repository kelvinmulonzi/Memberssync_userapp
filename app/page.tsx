"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "/login";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="text-center">
        <p>Redirecting to login...</p>
      </div>
    </div>
  );
}
