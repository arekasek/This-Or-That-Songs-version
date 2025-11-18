"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/loader";

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
        router.push("/genre");
      } else {
        router.push("/");
      }
    }
  }, [router]);

  return <Loader />;
}
