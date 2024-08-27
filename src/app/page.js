"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSelectGenre = (genre) => {
    router.push(`/genre/${genre}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 ">
      <img src="/This-or-That.png" className="w-[500px]" />
      <h1 className="text-3xl font-bold mb-6 text-center">Select Genre</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <button
          className="p-12 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          onClick={() => handleSelectGenre("Pop")}
        >
          Pop
        </button>
        <div
          className="p-12 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          onClick={() => handleSelectGenre("Trends")}
        >
          Trends
        </div>
        <button
          className="p-12 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          onClick={() => handleSelectGenre("HipHop")}
        >
          American Hip-hop
        </button>
        <button
          className="p-12 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          onClick={() => handleSelectGenre("Polska")}
        >
          TO MY POLACY
        </button>
      </div>
    </main>
  );
}
