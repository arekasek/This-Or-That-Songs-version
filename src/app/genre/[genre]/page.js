"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GenrePage({ params }) {
  const { genre } = params;
  const router = useRouter();
  const [categorySelected, setCategorySelected] = useState(false);
  const [playlistImages, setPlaylistImages] = useState({});

  useEffect(() => {
    const fetchPlaylistImages = async () => {
      try {
        const playlists = getPlaylistsByGenre(genre);

        const imagePromises = playlists.map(async ({ id }) => {
          try {
            const response = await fetch(
              `/api/spotify/playlistImage?playlistId=${id}`
            );
            if (!response.ok) throw new Error("Failed to fetch playlist image");
            const data = await response.json();
            return { id, image: data.image };
          } catch (error) {
            console.error(`Error fetching image for playlist ${id}:`, error);
            return { id, image: "https://via.placeholder.com/300" };
          }
        });

        const images = await Promise.all(imagePromises);
        const imagesMap = images.reduce((acc, { id, image }) => {
          acc[id] = image;
          return acc;
        }, {});

        setPlaylistImages(imagesMap);
      } catch (error) {
        console.error("Error fetching playlist images:", error);
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

  const getPlaylistsByGenre = (genre) => {
    const genrePlaylists = {
      Pop: [
        { id: "37i9dQZF1DZ06evO4bwDxS", label: "Sabrina Carpenter" },
        { id: "37i9dQZF1DX5KpP2LN299J", label: "Taylor Swift" },
      ],
      Trends: [
        { id: "37i9dQZF1DZ06evO4bwDxS", label: "Top Hits" },
        { id: "37i9dQZF1DXcBWIGoYBM5M", label: "Today's Hits" },
      ],
      Rock: [
        { id: "37i9dQZF1DWXRqgorJj26U", label: "Rock Classics" },
        { id: "37i9dQZF1DXcF6B6QPhFDv", label: "Alternative 90s" },
      ],
      HipHop: [
        { id: "37i9dQZF1DZ06evO3CRVnO", label: "Playboi Carti" },
        { id: "37i9dQZF1DZ06evO0vGf4I", label: "Travis Scott" },
        { id: "37i9dQZF1DZ06evO3nMr04", label: "Kanye West" },
        { id: "37i9dQZF1DX7QOv5kjbU68", label: "Drake" },
        { id: "37i9dQZF1DZ06evO4gTUOY", label: "Eminem" },
        { id: "37i9dQZF1DZ06evO1XGbvi", label: "Jay-Z" },
        { id: "37i9dQZF1DZ06evO1IPOOk", label: "Kendrick Lamar" },
        { id: "37i9dQZF1DZ06evO17QsVi", label: "2Pac" },
        { id: "37i9dQZF1DZ06evO1Za1Q4", label: "50 Cent" },
        { id: "37i9dQZF1DZ06evO2crkgE", label: "Ice Cube" },
        { id: "37i9dQZF1DZ06evO3VkoW4", label: "Dr. Dre" },
        { id: "37i9dQZF1DZ06evO2ZpGiQ", label: "Lil Wayne" },
        { id: "37i9dQZF1DZ06evO2xmY3T", label: "Cardi B" },
        { id: "37i9dQZF1DZ06evO2O09Hg", label: "Juice Wrld" },
        { id: "37i9dQZF1DZ06evO0AnZXW", label: "XXXTENTACION" },
        { id: "37i9dQZF1DZ06evO133u6s", label: "Future" },
        { id: "37i9dQZF1DZ06evO3K21mU", label: "J Cole" },
        { id: "37i9dQZF1DZ06evO33svt5", label: "Doja Cat" },
        { id: "37i9dQZF1DZ06evO06Ki7m", label: "Metro Boomin" },
        { id: "37i9dQZF1DZ06evO152G0U", label: "21 Savage" },
        { id: "37i9dQZF1DZ06evO359MM7", label: "Lil Baby" },
        { id: "37i9dQZF1DZ06evO2NufN6", label: "Mac Miller" },
        { id: "37i9dQZF1DZ06evO04kFZs", label: "Pop Smoke" },
        { id: "37i9dQZF1DZ06evO2T8209", label: "Tyler, The Creator" },
        { id: "37i9dQZF1DZ06evO1kxsTC", label: "Lil Peep" },
        { id: "37i9dQZF1DZ06evO15CHq8", label: "SuicideboyS" },
        { id: "37i9dQZF1DZ06evO2B3mUC", label: "DaBaby" },
        { id: "37i9dQZF1DZ06evO0yI3tK", label: "Wiz Khalifa" },
        { id: "37i9dQZF1DZ06evO3oLcOc", label: "Tyga" },
        { id: "37i9dQZF1DZ06evO471fR6", label: "Trippie Redd" },
        { id: "37i9dQZF1DZ06evO0yVwSk", label: "A$AP Rocky" },
        { id: "37i9dQZF1DZ06evO1iznkj", label: "Gunna" },
        { id: "37i9dQZF1DZ06evO2oTcyc", label: "Kodak Black" },
        { id: "37i9dQZF1DZ06evO3TbKzu", label: "Polo G" },
        { id: "37i9dQZF1DZ06evO04TCIU", label: "Kid Cudi" },
        { id: "37i9dQZF1DZ06evO07bvXy", label: "Flo Rida" },
        { id: "37i9dQZF1DZ06evO4aKvZe", label: "Childish Gambino" },
        { id: "37i9dQZF1DZ06evO4jkBCE", label: "Snoop Dogg" },
        { id: "37i9dQZF1DZ06evO4k5U2c", label: "Rae Sremmurd" },
        { id: "37i9dQZF1DZ06evO2ZTWSp", label: "Lizzo" },
        { id: "37i9dQZF1DZ06evO39qAJG", label: "The Notorious BIG" },
        { id: "37i9dQZF1DZ06evO02KO6k", label: "Big Sean" },
        { id: "37i9dQZF1DZ06evO0yY0jC", label: "Gucci Mane" },
        { id: "37i9dQZF1DZ06evO0BEOzm", label: "Megan Thee Stallion" },
        { id: "37i9dQZF1DZ06evO1aBeik", label: "Post Malone" },
        { id: "37i9dQZF1DX186v583rmzp", label: "90s Hip-Hop" },
        { id: "37i9dQZF1DX58gKmCfKS2T", label: "Most RAP" },
        { id: "37i9dQZF1DX2XmsXL2WBQd", label: "80s Hip-Hop" },
        { id: "37i9dQZF1DX1lHW2vbQwNN", label: "00s Hip-Hop" },
        { id: "37i9dQZF1DX97h7ftpNSYT", label: "2010s Hip-Hop" },
      ],

      Polska: [
        { id: "37i9dQZF1DX49bSMRljsho", label: "Hot Hity" },
        { id: "37i9dQZF1DX8J2l55TrZk6", label: "Hity wszechczasów" },
        { id: "37i9dQZF1DWWC8p2yKdFrw", label: "Polska 80s" },
        { id: "37i9dQZF1DX1leCUq7he50", label: "Polska 90s" },
        { id: "37i9dQZF1DX5qXEz970M38", label: "Polska 00s" },
        { id: "37i9dQZF1DX7bSIS915wSM", label: "Polska 2010s" },
        { id: "37i9dQZF1DX7P3ukP665LS", label: "Imprezowe Hity" },
        { id: "37i9dQZF1DWXz9uZQKizRS", label: "Alternatywne Hity" },
        { id: "1leWKIMy3rLDi36t8iIjmK", label: "HITY NA MAXXXA" },
        { id: "6gqxyeKeBBelKMQbgVOVHa", label: "PRZEBOJE ZETKA" },
        { id: "37i9dQZF1DWU3YMWyCwNtr", label: "Nowości DISCO POLO" },
        { id: "37i9dQZF1DX6gb9mP6Vy34", label: "Hity Disco Polo" },
        { id: "37i9dQZF1DXahkpBcruHaS", label: "LEGENDY DISCO POLO" },
        { id: "37i9dQZF1DWSWubjQuAKF1", label: "GEN-Z POLSKA" },
      ],
    };

    const playlists = genrePlaylists[genre] || [];

    return playlists.sort((a, b) => a.label.localeCompare(b.label));
  };

  const playlists = getPlaylistsByGenre(genre);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      {!categorySelected ? (
        <>
          <h1 className="text-3xl font-bold mb-6 text-center">
            Select Playlist for {genre}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {playlists.map(({ id, label }) => (
              <div
                key={id}
                className="bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4 flex items-center flex-col"
                onClick={() => handleSelectCategory(id)}
              >
                <div className="w-full cursor-pointer">
                  <img
                    src={
                      playlistImages[id] || "https://via.placeholder.com/300"
                    }
                    className="object-cover w-[200px] h-[200px] rounded-t-md"
                    alt={label}
                  />
                </div>
                <p className="text-center p-2">{label}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-lg text-gray-600">Redirecting...</p>
      )}
    </main>
  );
}
