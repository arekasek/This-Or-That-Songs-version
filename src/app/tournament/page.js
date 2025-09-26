"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SpotifyPlayer from "../api/spotify/SpotifyPlayer";
import ColorThief from "colorthief";
import { TbRefresh } from "react-icons/tb";
export default function Tournament() {
  const [allTracks, setAllTracks] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [round, setRound] = useState(1);
  const [pairings, setPairings] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [winner, setWinner] = useState(null);
  const [dominantColors, setDominantColors] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const playlistId = query.get("playlistId");

    if (playlistId === "liked") {
      const likedTracks = JSON.parse(
        localStorage.getItem("liked_tracks") || "[]"
      );
      setAllTracks(likedTracks);
      selectRandomTracks(likedTracks);
      fetchDominantColors(likedTracks);
      setLoading(false);
    } else if (playlistId) {
      fetchTracks(playlistId);
    }
  }, []);

  const fetchTracks = async (playlistId) => {
    try {
      const response = await fetch(
        `/api/spotify/random?playlistId=${playlistId}`
      );
      if (!response.ok) throw new Error("Failed to fetch tracks");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format");

      setAllTracks(data);
      selectRandomTracks(data);
      fetchDominantColors(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tracks:", err);
      setLoading(false);
    }
  };

  const fetchDominantColors = (tracks) => {
    const colorThief = new ColorThief();
    tracks.forEach((track) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = track.album?.images?.[0]?.url || "";
      img.onload = () => {
        const color = colorThief.getColor(img);
        setDominantColors((prev) => ({
          ...prev,
          [track.id]: `rgb(${color.join(",")})`,
        }));
      };
    });
  };

  const selectRandomTracks = (tracksList) => {
    const shuffled = [...tracksList].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 16);
    setTracks(selected);
    generatePairings(selected);
  };

  const generatePairings = (tracksList) => {
    const shuffled = [...tracksList].sort(() => 0.5 - Math.random());
    const newPairings = [];
    for (let i = 0; i < Math.floor(shuffled.length / 2); i++) {
      newPairings.push([shuffled[i * 2], shuffled[i * 2 + 1]]);
    }
    setPairings(newPairings);
    setCurrentPairIndex(0);
  };

  const getRoundLabel = () => {
    switch (round) {
      case 1:
        return "1/8 Finals";
      case 2:
        return "1/4 Finals";
      case 3:
        return "1/2 Finals";
      case 4:
        return "Final";
      default:
        return `Round ${round}`;
    }
  };

  const handleSelection = (selected) => {
    const loser = pairings[currentPairIndex].find((t) => t.id !== selected.id);
    const remaining = tracks.filter((t) => t.id !== loser.id);

    setSelectedTracks((prev) => [...prev, selected]);
    setTracks(remaining);

    if (remaining.length <= 1) {
      setWinner(selected);
      return;
    }

    if (currentPairIndex + 1 < pairings.length) {
      setCurrentPairIndex(currentPairIndex + 1);
    } else {
      setRound(round + 1);
      setSelectedTracks([]);
      if (remaining.length > 16) {
        selectRandomTracks(remaining);
      } else {
        generatePairings(remaining);
      }
    }
  };

  const handleRefresh = () => {
    setWinner(null);
    setRound(1);
    setSelectedTracks([]);
    selectRandomTracks(allTracks);
  };

  const currentPair = pairings[currentPairIndex];

  const getDarkerColor = (rgb) => {
    if (!rgb) return "#1DB954";
    const nums = rgb.match(/\d+/g).map(Number);
    const darker = nums.map((n) => Math.max(0, n - 50));
    return `rgb(${darker.join(",")})`;
  };

  const addAlpha = (rgb, alpha = 0.7) => {
    if (!rgb) return `rgba(29, 185, 84, ${alpha})`;
    const nums = rgb.match(/\d+/g).map(Number);
    return `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${alpha})`;
  };

  return (
    <main className="flex min-h-screen flex-col sm:flex-row items-center justify-center  relative">
      {loading && (
        <div className="flex items-center justify-center absolute inset-0 z-50 bg-white">
          <img src="/loading-gif.gif" className="w-[400px]" />
        </div>
      )}

      {!loading && winner ? (
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md z-10">
          <h2 className="text-2xl font-semibold mb-4">Final Winner!</h2>
          <img
            src={winner.album?.images?.[0]?.url}
            alt={winner.name}
            className="w-48 h-48 object-cover rounded-md mb-4"
          />
          <p className="text-xl font-semibold mb-4">{winner.name}</p>
          <SpotifyPlayer trackId={winner.id} />
        </div>
      ) : !loading && currentPair ? (
        <div className="w-full h-full flex flex-col justify-evenly items-center sm:flex-row">
          {currentPair.map((track) => (
            <div
              key={track.id}
              className={` flex justify-center w-full h-auto items-center p-10 special-container z-0`}
            >
              <div
                className="flex-col flex p-8 border-white/10 border rounded-xl xl:w-3/5 w-full h-fit sm:mx-2 2xl:mx-0 my-8 transition duration-500"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0px 5px 15px 0px ${
                    dominantColors[track.id] || "rgb(0,0,0)"
                  }`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <SpotifyPlayer trackId={track.id} className="w-full" />
                <button
                  className="px-4 py-2 text-white rounded-md mt-2 transition duration-300 hover:scale-105 border border-white/10 backdrop-blur-sm"
                  onClick={() => handleSelection(track)}
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
        !loading && (
          <p className="text-lg text-gray-600">No more tracks to display</p>
        )
      )}
      <img
        src="/vs1.png"
        className="absolute top-1/2 h-32 w-32 object-contain -translate-y-1/2 z-0 select-none pointer-events-none"
      />
      <button
        onClick={handleRefresh}
        className="px-4 py-2 font-semibold text-black rounded-md bg-[var(--primary)] mt-4 sm:fixed sm:bottom-24 w-full sm:w-auto z-10 gap-2 flex flex-row justify-center items-center primary-shadow"
      >
        <TbRefresh className="text-xl" />
        Refresh Songs
      </button>

      <h1 className="absolute hidden sm:block sm:fixed sm:top-24 z-10 text-white text-6xl font-extrabold">
        {getRoundLabel()}
      </h1>
    </main>
  );
}
