"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsBookmarkHeart } from "react-icons/bs";
import { FaClockRotateLeft } from "react-icons/fa6";
import { LuPartyPopper } from "react-icons/lu";
import { PiCassetteTape, PiHeadphones, PiCowboyHat } from "react-icons/pi";
import { GiGuitarBassHead } from "react-icons/gi";
import { FaRankingStar } from "react-icons/fa6";

const genres = [
  {
    name: "Your Favorites",
    icon: <BsBookmarkHeart />,
    color: "from-pink-200 to-purple-500",
    description: "Your liked songs all in one place.",
    special: "liked",
  },
  {
    name: "Your Top",
    icon: <FaRankingStar />,
    color: "from-blue-200 to-green-500",
    description: "Your 16 top songs of all time.",
    special: "top",
  },
  {
    name: "Recently Played",
    icon: <FaClockRotateLeft />,
    color: "from-yellow-200 to-red-500",
    description: "Songs you've played recently.",
    special: "recent",
  },
  {
    name: "Pop",
    icon: <LuPartyPopper />,
    color: "from-purple-200 to-pink-500",
    description: "Catchy and upbeat music.",
    genreQuery: "pop",
  },
  {
    name: "Hip-Hop",
    icon: <PiCassetteTape />,
    color: "from-yellow-200 to-orange-500",
    description: "Rhythmic vocal style and DJing.",
    genreQuery: "hip-hop",
  },
  {
    name: "Rock",
    icon: <GiGuitarBassHead />,
    color: "from-gray-200 to-black",
    description: "Strong beats and electric guitar.",
    genreQuery: "rock",
  },
  {
    name: "Alternative",
    icon: <PiHeadphones />,
    color: "from-blue-200 to-indigo-500",
    description: "Outside mainstream.",
    genreQuery: "alternative",
  },
  {
    name: "Country",
    icon: <PiCowboyHat />,
    color: "from-yellow-200 to-brown-500",
    description: "Stories of life and love.",
    genreQuery: "country",
  },
];

export default function Page() {
  const router = useRouter();
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [search, setSearch] = useState("");
  const [trackCount, setTrackCount] = useState(16);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");
      if (token) {
        localStorage.setItem("spotify_token", token);
        setSpotifyToken(token);
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

  const fetchGenreTracks = async (token, genreQuery) => {
    const yearRanges = ["1970-1989", "1990-2005", "2006-2015", "2016-2025"];
    const subQueries = [
      genreQuery,
      `${genreQuery} hits`,
      `${genreQuery} classics`,
      `${genreQuery} vibes`,
      `${genreQuery} mix`,
      `${genreQuery} trending`,
    ];
    const allResults = [];

    for (const year of yearRanges) {
      for (let i = 0; i < 3; i++) {
        const randomSub =
          subQueries[Math.floor(Math.random() * subQueries.length)];
        const query = `${randomSub} year:${year}`;
        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&market=US&limit=50`;

        try {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) continue;
          const data = await res.json();
          if (data.tracks?.items) allResults.push(...data.tracks.items);
        } catch {}
      }
    }

    const uniqueTracks = Array.from(
      new Map(allResults.map((t) => [t.id, t])).values()
    );

    return uniqueTracks.sort(() => Math.random() - 0.5);
  };

  const getRandomTracks = (tracks, count) => {
    const shuffled = [...tracks]
      .sort(() => Math.random() - 0.5)
      .sort(() => Math.random() - 0.5)
      .sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const handleClick = async (genre) => {
    if (!spotifyToken) return alert("Please connect Spotify first");
    let tracks = [];

    try {
      if (genre.special === "liked") {
        const res = await fetch(
          "https://api.spotify.com/v1/me/tracks?limit=50",
          { headers: { Authorization: `Bearer ${spotifyToken}` } }
        );
        const data = await res.json();
        tracks = data.items.map((i) => i.track);
      } else if (genre.special === "top") {
        const res = await fetch(
          "https://api.spotify.com/v1/me/top/tracks?limit=50",
          { headers: { Authorization: `Bearer ${spotifyToken}` } }
        );
        const data = await res.json();
        tracks = data.items;
      } else if (genre.special === "recent") {
        const res = await fetch(
          "https://api.spotify.com/v1/me/player/recently-played?limit=50",
          { headers: { Authorization: `Bearer ${spotifyToken}` } }
        );
        const data = await res.json();
        tracks = data.items.map((i) => i.track);
      } else if (genre.genreQuery) {
        tracks = await fetchGenreTracks(spotifyToken, genre.genreQuery);
      }

      if (!tracks.length) return alert("No tracks found for this category.");
      const selectedTracks = getRandomTracks(tracks, trackCount);

      localStorage.setItem("selected_tracks", JSON.stringify(selectedTracks));
      router.push(`/tournament?genre=${genre.genreQuery || genre.special}`);
    } catch (err) {
      console.error(err);
      alert("Failed to load tracks");
    }
  };

  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen h-full flex flex-col gap-4 items-center justify-center relative text-white p-8">
      <div className="gap-6 flex flex-col items-center mb-2">
        <h1 className="text-3xl">
          Choose Your Music{" "}
          <span className="px-2 py-1 rounded-md text-[var(--primary)] font-bold primary-shadow">
            Category
          </span>
        </h1>
        <h2 className="text-sm text-[var(--text-primary-lighter)] text-center">
          Select a category and tournament size
        </h2>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm text-[var(--text-primary-lighter)]">
          Tournament size:
        </label>
        <select
          value={trackCount}
          onChange={(e) => setTrackCount(Number(e.target.value))}
          className="bg-transparent border border-white/50 rounded-lg px-3 py-1 text-white focus:outline-none"
        >
          <option value={4}>4 Songs</option>
          <option value={8}>8 Songs</option>
          <option value={16}>16 Songs</option>
          <option value={32}>32 Songs</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="xl:w-1/4 sm:w-[70%] w-full p-2 rounded-lg bg-transparent border border-white/50 text-white placeholder:text-[var(--text-primary-lighter)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:w-3/5 sm:w-full w-full">
        {filteredGenres.map((genre) => (
          <div
            key={genre.name}
            onClick={() => handleClick(genre)}
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
        ))}
      </div>
    </div>
  );
}
