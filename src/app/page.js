"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [categorySelected, setCategorySelected] = useState(false);
  const [playlistImages, setPlaylistImages] = useState({});

  useEffect(() => {
    const fetchPlaylistImages = async () => {
      try {
        const playlists = [
          "748Q8znXiHWpL0uFZEMjR5",
          "75rOUElI9brD4Rec0UtBgv",
          "37i9dQZEVXbLiRSasKsNU9",
          "37i9dQZF1DXcBWIGoYBM5M",
          "37i9dQZF1DZ06evO4bwDxS",
          "37i9dQZF1DX5KpP2LN299J",
          "37i9dQZF1DWTJ7xPn4vNaz",
          "37i9dQZF1DX4UtSsGT1Sbe",
          "37i9dQZF1DXbTxeAdrVG2l",
        ];

        const imagePromises = playlists.map(async (playlistId) => {
          try {
            const response = await fetch(
              `/api/spotify/playlistImage?playlistId=${playlistId}`
            );
            if (!response.ok) throw new Error("Failed to fetch playlist image");
            const data = await response.json();
            return { playlistId, image: data.image };
          } catch (error) {
            console.error(
              `Error fetching image for playlist ${playlistId}:`,
              error
            );
            return { playlistId, image: "https://via.placeholder.com/300" };
          }
        });

        const images = await Promise.all(imagePromises);
        const imagesMap = images.reduce((acc, { playlistId, image }) => {
          acc[playlistId] = image;
          return acc;
        }, {});

        setPlaylistImages(imagesMap);
      } catch (error) {
        console.error("Error fetching playlist images:", error);
      }
    };

    fetchPlaylistImages();
  }, []);

  const handleSelectCategory = async (playlistId) => {
    setCategorySelected(true);

    try {
      const response = await fetch(
        `/api/spotify/random?playlistId=${playlistId}`
      );
      if (!response.ok) throw new Error("Failed to fetch tracks");

      router.push(`/tournament?playlistId=${playlistId}`);
    } catch (err) {
      console.error("Error fetching tracks:", err);
      setCategorySelected(false);
    }
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
        {!categorySelected ? (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center">
              Select Category
            </h1>
            <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: "748Q8znXiHWpL0uFZEMjR5", label: "Best Songs" },
                { id: "75rOUElI9brD4Rec0UtBgv", label: "Polskie Piosenki" },
                { id: "37i9dQZEVXbLiRSasKsNU9", label: "TOP 50 - GLOBAL" },
                { id: "37i9dQZF1DXcBWIGoYBM5M", label: "TODAY'S HITS" },
                { id: "37i9dQZF1DZ06evO4bwDxS", label: "Sabrina Carpenter" },
                { id: "37i9dQZF1DX5KpP2LN299J", label: "Taylor Swift" },
                { id: "37i9dQZF1DWTJ7xPn4vNaz", label: "70's" },
                { id: "37i9dQZF1DX4UtSsGT1Sbe", label: "80's" },
                { id: "37i9dQZF1DXbTxeAdrVG2l", label: "90's" },
              ].map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4 flex items-center flex-col"
                  onClick={() => handleSelectCategory(playlist.id)}
                >
                  <div className="w-full cursor-pointer">
                    <img
                      src={
                        playlistImages[playlist.id] ||
                        "https://via.placeholder.com/300"
                      }
                      className="object-cover w-[200px] h-[200px] rounded-t-md"
                      alt={playlist.label}
                    />
                  </div>
                  {playlist.label}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-600">Redirecting...</p>
        )}
      </main>
    </>
  );
}
