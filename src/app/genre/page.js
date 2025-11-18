"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsBookmarkHeart } from "react-icons/bs";
import { FaClockRotateLeft, FaRankingStar } from "react-icons/fa6";
import { LuPartyPopper } from "react-icons/lu";
import { PiCassetteTape, PiHeadphones, PiCowboyHat } from "react-icons/pi";
import { GiGuitarBassHead } from "react-icons/gi";
import { decades, genreArtists } from "../components/artistsByGenre";
import { LuStar } from "react-icons/lu";
import Loader from "../components/Loader";

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
    name: "Your recommendations",
    icon: <LuStar />,
    color: "from-red-500 to-orange-200",
    description: "Spotify recommendations.",
    special: "charts",
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
  const [loading, setLoading] = useState(false);

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
    const artists = genreArtists[genreQuery] || [];

    const queries = [
      ...artists.map((artist) => `artist:"${artist}"`),
      `genre:${genreQuery}`,
      ...decades
        .slice(-4)
        .map((d) => `genre:${genreQuery} year:${d.start}-${d.end}`),
    ];

    try {
      const selectedQueries = queries
        .sort(() => Math.random() - 0.5)
        .slice(0, 15);

      const responses = await Promise.all(
        selectedQueries.map((q) =>
          fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
              q
            )}&type=track&market=US&limit=50`,
            { headers: { Authorization: `Bearer ${token}` } }
          ).catch(() => null)
        )
      );

      const data = await Promise.all(
        responses.filter((r) => r && r.ok).map((r) => r.json())
      );

      let allTracks = data.flatMap((d) => d.tracks?.items || []);

      allTracks = allTracks.filter((t) => t.popularity >= 30);

      allTracks = allTracks.filter((track) => {
        const title = (track.name || "").toLowerCase();
        const artistNames = (
          track.artists?.map((a) => a.name).join(" ") || ""
        ).toLowerCase();
        const albumName = (track.album?.name || "").toLowerCase();

        const polishChars = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;
        if (
          polishChars.test(title) ||
          polishChars.test(artistNames) ||
          polishChars.test(albumName)
        ) {
          return false;
        }

        const polishWords = ["feat", "ft", "prod", "remix"].some((word) => {
          const pattern = new RegExp(`${word}\\.?\\s+[A-ZŁŚĆŻĄĘŃÓ]`, "i");
          return pattern.test(title) || pattern.test(artistNames);
        });

        if (polishWords) return false;

        const polishKeywords = [
          "sanah",
          "dawid podsiadlo",
          "taco hemingway",
          "quebonafide",
          "mata",
          "young leosia",
          "bedoes",
          "solar",
          "ralph kaminski",
          "lanberry",
          "vito bambino",
          "szpaku",
          "polish",
          "poland",
          "warszawa",
          "krakow",
          "wwa",
        ];
        if (
          polishKeywords.some(
            (keyword) =>
              artistNames.includes(keyword) || title.includes(keyword)
          )
        ) {
          return false;
        }

        const markets = track.album?.available_markets || [];
        const hasInternationalMarket = markets.some((m) =>
          ["US", "GB", "DE", "FR", "ES", "IT", "CA", "AU"].includes(m)
        );
        if (!hasInternationalMarket && markets.includes("PL")) {
          return false;
        }

        return true;
      });

      const uniqueTracks = Array.from(
        new Map(allTracks.map((t) => [t.id, t])).values()
      );

      const tracksByArtistAndDecade = {};

      uniqueTracks.forEach((track) => {
        const artistName = track.artists[0]?.name || "Unknown";
        const albumYear = track.album?.release_date?.substring(0, 4);
        const decade = albumYear ? Math.floor(albumYear / 10) * 10 : "unknown";
        const key = `${artistName}_${decade}`;

        if (!tracksByArtistAndDecade[key]) {
          tracksByArtistAndDecade[key] = [];
        }
        tracksByArtistAndDecade[key].push(track);
      });

      const diverseTracks = [];
      Object.values(tracksByArtistAndDecade).forEach((tracks) => {
        const best = tracks.sort((a, b) => b.popularity - a.popularity)[0];
        diverseTracks.push(best);
      });

      const sortedByPopularity = diverseTracks.sort(
        (a, b) => b.popularity - a.popularity
      );

      const topTracks = sortedByPopularity.slice(0, 200);

      return topTracks
        .sort(() => Math.random() - 0.5)
        .sort(() => Math.random() - 0.5)
        .sort(() => Math.random() - 0.5);
    } catch (err) {
      console.error("fetchGenreTracks error:", err);
      return [];
    }
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
    setLoading(true);
    let tracks = [];

    try {
      if (genre.special === "liked") {
        const res = await fetch(
          "https://api.spotify.com/v1/me/tracks?limit=50",
          {
            headers: { Authorization: `Bearer ${spotifyToken}` },
          }
        );
        const data = await res.json();
        tracks = data.items.map((i) => i.track);
      } else if (genre.special === "top") {
        const res = await fetch(
          "https://api.spotify.com/v1/me/top/tracks?limit=50",
          {
            headers: { Authorization: `Bearer ${spotifyToken}` },
          }
        );
        const data = await res.json();
        tracks = data.items;
      } else if (genre.special === "recent") {
        const res = await fetch(
          "https://api.spotify.com/v1/me/player/recently-played?limit=50",
          {
            headers: { Authorization: `Bearer ${spotifyToken}` },
          }
        );
        const data = await res.json();
        tracks = data.items.map((i) => i.track);
      } else if (genre.genreQuery) {
        tracks = await fetchGenreTracks(spotifyToken, genre.genreQuery);
      }

      if (!tracks.length) {
        setLoading(false);
        return alert("No tracks found for this category.");
      }

      const selectedTracks = getRandomTracks(tracks, trackCount);
      localStorage.setItem("selected_tracks", JSON.stringify(selectedTracks));
      router.push(`/tournament?genre=${genre.genreQuery || genre.special}`);
    } catch (err) {
      console.error(err);
      alert("Failed to load tracks");
    } finally {
      setLoading(false);
    }
  };

  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen h-full flex flex-col gap-4 items-center justify-center relative text-white p-8">
      {loading && <Loader />}

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
