"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Scrollbars } from "rc-scrollbars";
import { getPlaylistsByGenre } from "../../components/genrePlaylists";

export default function GenrePage({ params }) {
  const { genre } = params;
  const router = useRouter();
  const [categorySelected, setCategorySelected] = useState(false);
  const [playlistImages, setPlaylistImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylistImages = async () => {
      try {
        const playlists = getPlaylistsByGenre(genre);

        const imagePromises = playlists.map(({ id }) => {
          const url = `/api/spotify/playlistImage?playlistId=${id}`;
          return fetch(url)
            .then((response) => {
              if (!response.ok)
                throw new Error("Failed to fetch playlist image");
              return response.json();
            })
            .then((data) => ({ id, image: data.image }))
            .catch((error) => {
              console.error(`Error fetching image for playlist ${id}:`, error);
              return { id, image: "https://via.placeholder.com/300" };
            });
        });

        const images = await Promise.all(imagePromises);
        const imagesMap = images.reduce((acc, { id, image }) => {
          acc[id] = image;
          return acc;
        }, {});

        setPlaylistImages(imagesMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching playlist images:", error);
        setLoading(false);
      }
    };

    fetchPlaylistImages();
  }, [genre]);

  const handleSelectCategory = async (playlistId) => {
    setCategorySelected(true);

    try {
      router.push(`/tournament?playlistId=${playlistId}`);
    } catch (err) {
      console.error("Error fetching tracks:", err);
      setCategorySelected(false);
    }
  };

  const playlists = getPlaylistsByGenre(genre);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex items-center justify-center">
            <img src="/loading-gif.gif" className="w-[400px] absolute" />
          </div>
        </div>
      ) : !categorySelected ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-[1fr,_minmax(0,_4fr)] w-full h-full">
          <div className="bg-[#121212] p-12 rounded-3xl glass-effect-container h-1/4 hidden sm:block"></div>
          <div className="bg-[#121212] sm:p-12 p-4 rounded-3xl glass-effect-container h-[calc(100vh-6rem)] overflow-y-auto songs-container">
            <Scrollbars autoHide autoHideTimeout={1000} autoHideDuration={200}>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
                {playlists.map(({ id, label }) => (
                  <div
                    key={id}
                    className="glass-effect-container-md opacity-80 shadow-lg text-black rounded-md hover:opacity-100 p-2 mb-4 flex items-center flex-col cursor-pointer"
                    onClick={() => handleSelectCategory(id)}
                  >
                    <div className="w-full">
                      <LazyLoadImage
                        src={
                          playlistImages[id] ||
                          "https://via.placeholder.com/300"
                        }
                        className="object-cover w-full h-full rounded-t-md"
                        alt={label}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Scrollbars>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-600">Redirecting...</p>
      )}
    </main>
  );
}
