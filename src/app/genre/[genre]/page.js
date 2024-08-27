"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LazyLoadImage } from "react-lazy-load-image-component";

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

  const getPlaylistsByGenre = (genre) => {
    const genrePlaylists = {
      Pop: [{ id: "37i9dQZF1DX5KpP2LN299J", label: "Taylor Swift" }],
      Trends: [{ id: "37i9dQZF1DZ06evO4bwDxS", label: "Top Hits" }],
      Rock: [
        { id: "37i9dQZF1DWXRqgorJj26U", label: "Rock Classics" },
        { id: "37i9dQZF1DXcF6B6QPhFDv", label: "Alternative 90s" },
      ],
      HipHop: [
        { id: "37i9dQZF1DZ06evO3CRVnO", label: "Playboi Carti" },
        { id: "37i9dQZF1DZ06evO0vGf4I", label: "Travis Scott" },
        { id: "37i9dQZF1DZ06evO1XGbvi", label: "Kanye West" },
        { id: "37i9dQZF1DX7QOv5kjbU68", label: "Drake" },
        { id: "37i9dQZF1DZ06evO4gTUOY", label: "Eminem" },
        { id: "37i9dQZF1DZ06evO1IPOOk", label: "Jay-Z" },
        { id: "37i9dQZF1DZ06evO1Za1Q4", label: "Kendrick Lamar" },
        { id: "37i9dQZF1DZ06evO17QsVi", label: "2Pac" },
        { id: "37i9dQZF1DZ06evO359MM7", label: "50 Cent" },
        { id: "37i9dQZF1DZ06evO2crkgE", label: "Ice Cube" },
        { id: "37i9dQZF1DZ06evO3VkoW4", label: "Dr. Dre" },
        { id: "37i9dQZF1DZ06evO2ZpGiQ", label: "Lil Wayne" },
        { id: "37i9dQZF1DZ06evO2xmY3T", label: "Cardi B" },
        { id: "37i9dQZF1DZ06evO0AnZXW", label: "Juice Wrld" },
        { id: "37i9dQZF1DZ06evO1XGbvi", label: "XXXTENTACION" },
        { id: "37i9dQZF1DZ06evO1aBeik", label: "Future" },
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
        { id: "37i9dQZF1DZ06evO2ZTWSp", label: "Lizzo" },
        { id: "37i9dQZF1DZ06evO39qAJG", label: "The Notorious BIG" },
        { id: "37i9dQZF1DZ06evO02KO6k", label: "Big Sean" },
        { id: "37i9dQZF1DZ06evO0yY0jC", label: "Gucci Mane" },
        { id: "37i9dQZF1DZ06evO0BEOzm", label: "Megan Thee Stallion" },
        { id: "37i9dQZF1DZ06evO1aBeik", label: "Post Malone" },
        // { id: "37i9dQZF1DX186v583rmzp", label: "90s Hip-Hop" },
        // { id: "37i9dQZF1DX58gKmCfKS2T", label: "Most RAP" },
        // { id: "37i9dQZF1DX2XmsXL2WBQd", label: "80s Hip-Hop" },
        // { id: "37i9dQZF1DX1lHW2vbQwNN", label: "00s Hip-Hop" },
        // { id: "37i9dQZF1DX97h7ftpNSYT", label: "2010s Hip-Hop" },
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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 ">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : !categorySelected ? (
        <>
          <h1 className="text-3xl font-bold mb-6 text-center">
            Select Playlist for {genre}
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
            {playlists.map(({ id, label }) => (
              <div
                key={id}
                className="bg-slate-200 opacity-80 shadow-lg text-black rounded-md hover:bg-blue-600 mb-4 flex items-center flex-col cursor-pointer"
                onClick={() => handleSelectCategory(id)}
              >
                <div className="w-full">
                  <LazyLoadImage
                    src={
                      playlistImages[id] || "https://via.placeholder.com/300"
                    }
                    className="object-cover sm:w-[300px] sm:h-[300px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] xl:w-[300px] xl:h-[300px] 2xl:w-[300px] 2xl:h-[300px] w-full h-full rounded-t-md"
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
