"use client";
import { useState, useEffect } from "react";
import SpotifyPlayer from "../api/spotify/SpotifyPlayer";
import ColorThief from "colorthief";
import { TbRefresh } from "react-icons/tb";
import { useRouter } from "next/navigation";
import ProgressBarAnimated from "../components/progressBarAnimated";
import Loader from "../components/Loader";

export default function Tournament() {
  const [tracks, setTracks] = useState([]);
  const [round, setRound] = useState(1);
  const [pairings, setPairings] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [winner, setWinner] = useState(null);
  const [dominantColors, setDominantColors] = useState({});
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
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
    // Take only first 16 tracks or fill up to 16 if less
    let tracksList = [...allTracks];
    if (tracksList.length > 16) {
      tracksList = tracksList.slice(0, 16);
    } else if (tracksList.length < 16) {
      router.push("/");
      return;
    }
    const shuffled = tracksList.sort(() => Math.random() - 0.5);
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

    const matchesInRound = pairings.length;
    const increment = 100 / matchesInRound; // Each match completes an equal portion of the round

    // Update progress for this match
    setProgress((prev) => Math.min(100, prev + increment));

    if (remaining.length === 1) {
      setProgress(100);
      return setWinner(selected);
    }

    if (currentPairIndex + 1 >= pairings.length) {
      setRound((prev) => prev + 1);
      setTimeout(() => {
        setTracks(remaining);
        setPairings(generatePairings(remaining));
        setCurrentPairIndex(0);
        setProgress(0); // Reset progress bar for new round
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
    <main className="flex min-h-screen flex-col sm:flex-row items-center justify-center relative p-4">
      {loading && <Loader />}

      {!loading && winner ? (
        <div className="absolute w-screen flex items-center justify-center h-screen top-0 z-50 bg-black/80 backdrop-blur-sm inset-0 text-white">
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl shadow-md z-10 bg-white/50">
            <h2 className="text-2xl font-semibold mb-4">Final Winner!</h2>
            <img
              src={winner.album?.images?.[0]?.url}
              alt={winner.name}
              className="w-48 h-48 object-cover rounded-md mb-4"
            />
            <p className="text-xl font-semibold mb-4 text-black">
              {winner.name}
            </p>
            <div className="w-full">
              <SpotifyPlayer trackId={winner.id} />
            </div>
          </div>
        </div>
      ) : !loading && currentPair ? (
        <div className="flex xl:w-3/5 w-full h-full sm:flex-row flex-col gap-12 items-center justify-center">
          {currentPair.map((track) => (
            <div key={track.id} className="flex-1 h-auto">
              <div
                className="flex flex-col sm:p-8 p-2 border-white/10 border rounded-xl w-full h-fit transition duration-500"
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

      <button
        onClick={handleRefresh}
        className="px-4 py-2 gap-2 mt-4 sm:fixed sm:bottom-24 w-full sm:w-auto z-10 flex items-center justify-center rounded-md text-black bg-[var(--primary)]"
      >
        <TbRefresh className="text-xl" /> Refresh Songs
      </button>

      <div className="absolute w-1/3 sm:top-24 z-10 text-white text-6xl font-extrabold flex items-center justify-center">
        <ProgressBarAnimated text={getRoundLabel()} processed={progress} />
      </div>
    </main>
  );
}
