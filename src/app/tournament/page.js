"use client";
import { useState, useEffect } from "react";
import SpotifyPlayer from "../api/spotify/SpotifyPlayer";
import ColorThief from "colorthief";
import { TbRefresh } from "react-icons/tb";
import { useRouter } from "next/navigation";

export default function Tournament() {
  const [tracks, setTracks] = useState([]);
  const [round, setRound] = useState(1);
  const [pairings, setPairings] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [winner, setWinner] = useState(null);
  const [dominantColors, setDominantColors] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("selected_tracks");
      const selectedTracks = stored ? JSON.parse(stored) : [];
      if (!selectedTracks || selectedTracks.length < 2) router.push("/");
      else initTournament(selectedTracks);
    } catch {
      router.push("/");
    }
  }, []);

  const fetchDominantColor = async (track) => {
    if (!track.album?.images?.[0]?.url) return null;
    const cacheKey = `color_${track.id}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return cached;
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = track.album.images[0].url;
      img.onload = () => {
        try {
          const color = new ColorThief().getColor(img);
          const rgb = `rgb(${color.join(",")})`;
          sessionStorage.setItem(cacheKey, rgb);
          resolve(rgb);
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
    });
  };

  const generatePairings = (trackList) => {
    const pairs = [];
    for (let i = 0; i < Math.floor(trackList.length / 2); i++)
      pairs.push([trackList[i * 2], trackList[i * 2 + 1]]);
    return pairs;
  };

  const initTournament = async (allTracks) => {
    setLoading(true);
    const shuffled = [...allTracks].sort(() => Math.random() - 0.5);
    setTracks(shuffled);

    const colors = {};
    await Promise.all(
      shuffled.map(async (track) => {
        const color = await fetchDominantColor(track);
        if (color) colors[track.id] = color;
      })
    );
    setDominantColors(colors);

    setPairings(generatePairings(shuffled));
    setCurrentPairIndex(0);
    setRound(1);
    setWinner(null);
    setLoading(false);
  };

  const getRoundLabel = () => {
    const roundsMap = {
      1: "Final",
      2: "Semifinals",
      4: "Quarterfinals",
      8: "1/8 Finals",
      16: "1/16 Finals",
      32: "1/32 Finals",
    };
    return (
      roundsMap[tracks.length / Math.pow(2, round - 1)] || `Round ${round}`
    );
  };

  const handleSelection = (selected) => {
    const loser = pairings[currentPairIndex].find((t) => t.id !== selected.id);
    const remaining = tracks.filter((t) => t.id !== loser.id);

    if (remaining.length === 1) return setWinner(selected);

    if (currentPairIndex + 1 >= pairings.length) {
      setRound((prev) => prev + 1);
      setTimeout(() => {
        setTracks(remaining);
        setPairings(generatePairings(remaining));
        setCurrentPairIndex(0);
      }, 300);
    } else {
      setTracks(remaining);
      setCurrentPairIndex((prev) => prev + 1);
    }
  };

  const handleRefresh = () => {
    const stored = localStorage.getItem("selected_tracks");
    if (stored) initTournament(JSON.parse(stored));
    else router.push("/");
  };

  const currentPair = pairings[currentPairIndex];
  const getDarkerColor = (rgb) =>
    rgb
      ? `rgb(${rgb
          .match(/\d+/g)
          .map((n) => Math.max(0, n - 50))
          .join(",")})`
      : "#1DB954";
  const addAlpha = (rgb, a = 0.7) =>
    rgb ? `rgba(${rgb.match(/\d+/g).join(",")},${a})` : `rgba(29,185,84,${a})`;

  return (
    <main className="flex min-h-screen flex-col sm:flex-row items-center justify-center relative">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <img src="/loading-gif.gif" className="w-[250px]" />
        </div>
      )}

      {!loading && winner ? (
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md z-10">
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Final Winner!
          </h2>
          <img
            src={winner.album?.images?.[0]?.url}
            alt={winner.name}
            className="w-48 h-48 object-cover rounded-md mb-4"
          />
          <p className="text-xl font-semibold mb-4 text-black">{winner.name}</p>
          <SpotifyPlayer trackId={winner.id} />
        </div>
      ) : !loading && currentPair ? (
        <div className="flex w-full h-full flex-col justify-evenly items-center sm:flex-row">
          {currentPair.map((track) => (
            <div
              key={track.id}
              className="flex justify-center w-full h-auto items-center p-10"
            >
              <div
                className="flex-col flex p-8 border-white/10 border rounded-xl xl:w-3/5 w-full h-fit sm:mx-2 my-8 transition duration-500"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = `0px 5px 15px 0px ${
                    dominantColors[track.id] || "rgb(0,0,0)"
                  }`)
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <SpotifyPlayer trackId={track.id} className="w-full" />
                <button
                  onClick={() => handleSelection(track)}
                  className="px-4 py-2 mt-2 rounded-md text-white transition duration-300 hover:scale-105 border border-white/10 backdrop-blur-sm"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${addAlpha(
                      dominantColors[track.id],
                      0.25
                    )} 0%, ${addAlpha(
                      getDarkerColor(dominantColors[track.id]),
                      0.25
                    )} 100%)`,
                  }}
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-400">No more tracks to display</p>
      )}

      <img
        src="/vs1.png"
        className="absolute top-1/2 h-32 w-32 object-contain -translate-y-1/2 z-0 select-none pointer-events-none"
      />
      <button
        onClick={handleRefresh}
        className="px-4 py-2 gap-2 mt-4 sm:fixed sm:bottom-24 w-full sm:w-auto z-10 flex items-center justify-center rounded-md text-black bg-[var(--primary)]"
      >
        <TbRefresh className="text-xl" /> Refresh Songs
      </button>

      <h1 className="absolute hidden sm:block sm:fixed sm:top-24 z-10 text-white text-6xl font-extrabold">
        {getRoundLabel()}
      </h1>
    </main>
  );
}
