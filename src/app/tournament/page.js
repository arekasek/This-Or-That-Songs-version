"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SpotifyPlayer from "../api/spotify/SpotifyPlayer";
import ColorThief from "colorthief";

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

  const containerClasses = [
    "checks-container",
    "dots-container",
    "hlines-container",
    "vlines-container",
    "checks2-container",
  ];

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const playlistId = query.get("playlistId");
    fetchTracks(playlistId);
  }, []);

  const fetchTracks = async (playlistId) => {
    try {
      const response = await fetch(
        `/api/spotify/random?playlistId=${playlistId}`
      );
      if (!response.ok) throw new Error("Failed to fetch tracks");
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

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
      img.src = track.album.images[0]?.url;

      img.onload = () => {
        const color = colorThief.getColor(img);
        setDominantColors((prevColors) => ({
          ...prevColors,
          [track.id]: `rgb(${color.join(",")})`,
        }));
      };
    });
  };

  const selectRandomTracks = (tracksList) => {
    const shuffledTracks = tracksList.sort(() => 0.5 - Math.random());
    const selectedTracks = shuffledTracks.slice(0, 16);
    setTracks(selectedTracks);
    generatePairings(selectedTracks);
  };

  const generatePairings = (tracks) => {
    const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
    const numPairs = Math.floor(shuffledTracks.length / 2);
    const newPairings = [];

    for (let i = 0; i < numPairs; i++) {
      newPairings.push([shuffledTracks[i * 2], shuffledTracks[i * 2 + 1]]);
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

  const handleSelection = (winner) => {
    const updatedSelectedTracks = [...selectedTracks, winner];
    const loser = pairings[currentPairIndex].find(
      (track) => track.id !== winner.id
    );

    const nextRoundTracks = tracks.filter((track) => track.id !== loser.id);

    if (nextRoundTracks.length <= 1) {
      setWinner(winner);
      return;
    }

    if (currentPairIndex + 1 < pairings.length) {
      setCurrentPairIndex(currentPairIndex + 1);
    } else {
      setRound(round + 1);
      setSelectedTracks([]);

      if (nextRoundTracks.length > 16) {
        selectRandomTracks(nextRoundTracks);
      } else {
        generatePairings(nextRoundTracks);
      }

      setCurrentPairIndex(0);
    }

    setTracks(nextRoundTracks);
    setSelectedTracks(updatedSelectedTracks);
  };

  const handleRefresh = () => {
    setWinner(null);
    setRound(1);
    setSelectedTracks([]);
    selectRandomTracks(allTracks);
  };

  const getRandomClass = () => {
    return containerClasses[
      Math.floor(Math.random() * containerClasses.length)
    ];
  };

  const currentPair = pairings[currentPairIndex];

  return (
    <main className="flex min-h-screen flex-col sm:flex-row items-center justify-center bg-gray-100 relative">
      {loading && (
        <div className="flex items-center justify-center absolute inset-0 z-50 bg-white">
          <img src="/loading-gif.gif" className="w-[400px]" />
        </div>
      )}
      {!loading && winner ? (
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md z-10">
          <h2 className="text-2xl font-semibold mb-4">Final Winner!</h2>
          <img
            src={winner.album.images[0]?.url}
            alt={winner.album.name}
            className="w-48 h-48 object-cover rounded-md mb-4"
          />
          <p className="text-xl font-semibold mb-4">{winner.name}</p>
          <div>
            <SpotifyPlayer trackId={winner.id} />
          </div>
        </div>
      ) : !loading && currentPair ? (
        <div className="w-full h-full flex flex-col sm:flex-row">
          {currentPair.map((track) => (
            <div
              key={track.id}
              className={`sm:w-[50%] w-[100%] flex justify-center h-[30%] sm:h-screen items-center p-2 sm:p-6 special-container z-0 ${getRandomClass()}`}
              style={{
                backgroundColor: dominantColors[track.id] || "white",
              }}
            >
              <div className="flex-col flex p-4 bg-white shadow-md rounded-lg xl:w-3/5 w-full sm:w-full h-fit glass-effect-container-md sm:mx-2 2xl:mx-0 my-8 hover:transform hover:scale-105 transition duration-500">
                <div>
                  <SpotifyPlayer trackId={track.id} />
                </div>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => handleSelection(track)}
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
      <button
        onClick={handleRefresh}
        className="px-4 py-2 bg-blue-500 sm:block text-white rounded-md hover:bg-blue-600 mt-4 hidden sm:fixed sm:bottom-24 w-full sm:w-auto z-10"
      >
        Refresh Songs
      </button>
      <div className="absolute hidden bg-white sm:block sm:h-screen sm:w-12 z-0 border-x-[10px] border-black"></div>
      <div className="absolute">
        <img src="/vs1.png" className="xl:w-[250px] w-[100px] z-10" />
      </div>
      <h1 className="absolute hidden sm:block  sm:fixed sm:top-24 z-10 text-white text-6xl font-extrabold">
        {getRoundLabel()}
      </h1>
    </main>
  );
}
