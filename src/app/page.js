"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSelectGenre = (genre) => {
    router.push(`/genre/${genre}`);
  };

  const handleSpotifyLogin = () => {
    router.push("/api/spotify/auth");
  };

  const Categories = [
    "Pop",
    "Daily Song Charts",
    "HipHop",
    "Poland",
    "Top of All Time",
    "2000s Hits",
  ];
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-white">
      <img src="/This-or-That.png" className="w-[500px]" />
      <h1 className="text-3xl font-bold mb-6 text-center">Select Genre</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {Categories.map((category, genre) => (
          <button
            key={category}
            className="p-12 text-white rounded-md cursor-pointer glass-effect-container flex items-center justify-center genre-button"
            onClick={() => handleSelectGenre(genre)}
          >
            {category}
          </button>
        ))}
      </div>
      <button
        onClick={handleSpotifyLogin}
        className="mt-6 p-3 bg-green-500 text-white rounded-md"
      >
        Login with Spotify
      </button>
    </main>
  );
}
