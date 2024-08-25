"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [categorySelected, setCategorySelected] = useState(false);

  const handleSelectCategory = () => {
    setCategorySelected(true);
    router.push("/tournament");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      {!categorySelected ? (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Select Category
          </h1>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
            onClick={handleSelectCategory}
          >
            Best Songs
          </button>
        </div>
      ) : (
        <p className="text-lg text-gray-600">Redirecting...</p>
      )}
    </main>
  );
}
