"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash
        .substring(1)
        .split("&")
        .reduce((acc, item) => {
          const [key, value] = item.split("=");
          acc[key] = decodeURIComponent(value);
          return acc;
        }, {});

      if (hash.access_token) {
        localStorage.setItem("spotify_token", hash.access_token);
        router.push("/liked-tournament");
      } else {
        router.push("/");
      }
    }
  }, [router]);

  return <p className="text-white">Logging in...</p>;
}
