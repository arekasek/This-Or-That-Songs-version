"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LikedTournament() {
  const [tracks, setTracks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLikedTracks = async () => {
      const token = localStorage.getItem("spotify_token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch(
          "https://api.spotify.com/v1/me/tracks?limit=50",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch liked tracks");

        const data = await res.json();
        const items = data.items.map((item) => item.track);
        setTracks(items);

        if (items.length > 0) {
          router.push(`/tournament?playlistId=liked`);
        }
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    };

    fetchLikedTracks();
  }, [router]);

  return <p className="text-white">Loading your liked songs...</p>;
}
