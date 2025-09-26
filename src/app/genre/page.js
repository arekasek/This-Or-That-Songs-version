"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsBookmarkHeart } from "react-icons/bs";
import { FaClockRotateLeft } from "react-icons/fa6";
import { MdCalendarToday } from "react-icons/md";
import { LuPartyPopper } from "react-icons/lu";
import { PiCassetteTape } from "react-icons/pi";
import { GiGuitarBassHead } from "react-icons/gi";
import { PiCowboyHat } from "react-icons/pi";
import { PiHeadphones } from "react-icons/pi";

const genres = [
  {
    name: "Your Favorites",
    icon: <BsBookmarkHeart />,
    color: "from-pink-200 to-purple-500",
    description: "Your liked songs all in one place.",
    id: "1mJMnTs4l3WAmPHNgINVPS",
    special: "liked",
  },
  {
    name: "Recently Played",
    icon: <FaClockRotateLeft />,
    color: "from-yellow-200 to-red-500",
    description: "Songs you've played recently.",
    id: "7AsZxdanrHJFNGp3q7tp1f",
  },
  {
    name: "Daily Song Charts",
    icon: <MdCalendarToday />,
    color: "from-green-200 to-blue-500",
    description: "Songs of the day.",
    id: "37i9dQZEVXbLRQDuF5jeBp",
  },
  {
    name: "Pop",
    icon: <LuPartyPopper />,
    color: "from-purple-200 to-pink-500",
    description: "Catchy and upbeat music.",
    id: "37i9dQZF1DXcZDD7cfEKhW",
  },
  {
    name: "HipHop",
    icon: <PiCassetteTape />,
    color: "from-yellow-200 to-orange-500",
    description: "Rhythmic vocal style and DJing.",
    id: "37i9dQZF1DX0XUsuxWHRQd",
  },
  {
    name: "Rock",
    icon: <GiGuitarBassHead />,
    color: "from-gray-200 to-black",
    description: "Strong beats and electric guitar.",
    id: "37i9dQZF1DWXRqgorJj26U",
  },
  {
    name: "Alternative",
    icon: <PiHeadphones />,
    color: "from-blue-200 to-indigo-500",
    description: "Outside mainstream.",
    id: "37i9dQZF1DX2Nc3B70tvx0",
  },
  {
    name: "Country",
    icon: <PiCowboyHat />,
    color: "from-yellow-200 to-brown-500",
    description: "Stories of life and love.",
    id: "37i9dQZF1DX1lVhptIYRda",
  },
];

export default function Page() {
  const router = useRouter();
  const [spotifyToken, setSpotifyToken] = useState(null);

  // Obsługa tokena z URL po Spotify redirect
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");
      if (token) {
        localStorage.setItem("spotify_token", token);
        setSpotifyToken(token);
        // Usuń hash z URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    } else {
      const token = localStorage.getItem("spotify_token");
      if (token) setSpotifyToken(token);
    }
  }, []);

  const handleClick = async (genre) => {
    if (genre.special === "liked") {
      const token = localStorage.getItem("spotify_token");
      if (!token) {
        alert("Please connect Spotify first");
        return;
      }

      try {
        const res = await fetch("/api/spotify/liked", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch liked tracks");

        const data = await res.json();
        localStorage.setItem("liked_tracks", JSON.stringify(data));

        router.push("/tournament?playlistId=liked");
      } catch (err) {
        console.error(err);
        alert("Failed to fetch liked tracks");
      }
    } else {
      router.push(`/tournament?playlistId=${genre.id}`);
    }
  };

  return (
    <div className="min-h-screen h-full flex flex-col gap-4 items-center justify-center relative text-white p-8">
      <div className="gap-6 flex flex-col items-center mb-2">
        <h1 className="text-3xl">
          Choose Your Music{" "}
          <span className="px-2 py-1 rounded-md text-[var(--primary)] font-bold primary-shadow">
            Category
          </span>
        </h1>
        <h2 className="text-sm text-[var(--text-primary-lighter)] text-center sm:text-left">
          Select a category to create your tournament bracket
        </h2>
      </div>
      <input
        type="text"
        placeholder="Search..."
        className="xl:w-1/4 sm:w-[70%] w-full p-2 rounded-lg bg-transparent border border-white/50 text-white placeholder:text-[var(--text-primary-lighter)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:w-3/5 sm:w-full w-full">
        {genres.map((genre) => {
          return (
            <div
              onClick={() => handleClick(genre)}
              key={genre.name}
              className="p-4 rounded-lg text-center hover:bg-green-700/10 backdrop-blur-md hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col items-center gap-2 border border-white/10 hover:border-white/30"
            >
              <div
                className={`p-4 bg-gradient-to-br ${genre.color} rounded-2xl text-2xl`}
              >
                {genre.icon}
              </div>
              {genre.name}
              <p className="text-[var(--text-primary-lighter)] font-light text-xs">
                {genre.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
