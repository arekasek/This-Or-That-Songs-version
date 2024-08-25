"use client";
import { useState, useEffect, useRef } from "react";

export default function Tournament() {
  const [tracks, setTracks] = useState([]);
  const [round, setRound] = useState(1);
  const [pairings, setPairings] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [playingTrack, setPlayingTrack] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await fetch("/api/spotify/random");
      if (!response.ok) throw new Error("Failed to fetch tracks");
      const data = await response.json();
      if (!Array.isArray(data) || data.length < 16) {
        throw new Error("Not enough tracks fetched or invalid data format");
      }
      setTracks(data);
      setRound(1);
      generatePairings(data);
    } catch (err) {
      console.error("Error fetching tracks:", err);
    }
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
    stopPreview();

    const updatedSelectedTracks = [...selectedTracks, winner];
    const loser = pairings[currentPairIndex].find(
      (track) => track.id !== winner.id
    );

    const nextRoundTracks = tracks.filter((track) => track.id !== loser.id);

    if (nextRoundTracks.length <= 1) {
      alert(`Tournament Ended! Final winner: ${winner.name}`);
      return;
    }

    if (currentPairIndex + 1 < pairings.length) {
      setCurrentPairIndex(currentPairIndex + 1);
    } else {
      setRound(round + 1);
      setSelectedTracks([]);
      generatePairings(nextRoundTracks);
      setCurrentPairIndex(0);
    }

    setTracks(nextRoundTracks);
    setSelectedTracks(updatedSelectedTracks);
  };

  const playPreview = (previewUrl) => {
    if (audioRef.current) {
      audioRef.current.src = previewUrl;
      audioRef.current.play();
      setPlayingTrack(previewUrl);
    }
  };

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      setPlayingTrack(null);
    }
  };

  const currentPair = pairings[currentPairIndex];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Music Tournament - {getRoundLabel()}
      </h1>
      {currentPair ? (
        <div className="flex flex-col md:flex-row justify-center mb-6">
          {currentPair.map((track) => (
            <div
              key={track.id}
              className="flex-1 mx-2 p-4 bg-white shadow-md rounded-lg"
            >
              <img
                src={track.album.images[0]?.url}
                alt={track.album.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <p className="text-xl font-semibold mb-2">{track.name}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => handleSelection(track)}
              >
                Select
              </button>
              {track.preview_url && (
                <div className="mt-2">
                  <button
                    className={`px-4 py-2 bg-green-500 text-white rounded-md mr-2 ${
                      playingTrack === track.preview_url ? "bg-red-500" : ""
                    }`}
                    onClick={() =>
                      playingTrack === track.preview_url
                        ? stopPreview()
                        : playPreview(track.preview_url)
                    }
                  >
                    {playingTrack === track.preview_url ? "Stop" : "Play"}{" "}
                    Preview
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600">No more tracks to display</p>
      )}
      <audio ref={audioRef} />
      <button
        onClick={fetchTracks}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
      >
        Refresh Songs
      </button>
    </main>
  );
}
