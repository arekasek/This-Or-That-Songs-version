"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSelectGenre = (genre) => {
    router.push(`/genre/${genre}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Select Genre</h1>
      <div className="flex space-x-4">
        <div
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          onClick={() => handleSelectGenre("Pop")}
        >
          Pop
        </div>
        <div
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          onClick={() => handleSelectGenre("Trends")}
        >
          Trends
        </div>
        <div
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          onClick={() => handleSelectGenre("HipHop")}
        >
          American Hip-hop
        </div>
        <div
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          onClick={() => handleSelectGenre("Polska")}
        >
          TO MY POLACY
        </div>
      </div>
    </main>
  );
}
