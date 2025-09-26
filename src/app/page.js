"use client";
import { useRouter } from "next/navigation";
import { MdLibraryMusic } from "react-icons/md";
import { LuTrophy } from "react-icons/lu";
import { MdPeople } from "react-icons/md";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { FaMusic } from "react-icons/fa6";
export default function Home() {
  const router = useRouter();

  // const handleSelectGenre = (genre) => {
  //   router.push(`/genre/${genre}`);
  // };

  const handleSpotifyLogin = () => {
    window.location.href = "/api/spotify/auth";
  };

  // const Categories = [
  //   "Pop",
  //   "Daily Song Charts",
  //   "HipHop",
  //   "Poland",
  //   "Top of All Time",
  //   "2000s Hits",
  // ];
  return (
    <main
      className="min-h-screen h-auto flex items-center justify-center relative gradient-hero text-white"
      style={{
        backgroundImage: `url('/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[hsl(0,0%,6%)]/90 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto p-6">
        <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-[var(--primary)] shadow-lg">
                <MdLibraryMusic className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-2xl sm:text-5xl font-bold text-foreground tracking-tight">
                MusicBrackets
              </h1>
            </div>

            <h2 className="sm:text-xl text-lg lg:text-2xl text-muted-foreground leading-relaxed text-[var(--text-primary)]">
              Turn music discovery into a tournament
            </h2>

            <p className="text-muted-foreground sm:text-base text-sm max-w-md mx-auto lg:mx-0 text-[var(--text-primary)]">
              Create epic battles between your favorite songs. Watch them
              compete, survive, and discover your ultimate winner.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start ">
            <div className="flex items-center gap-2 px-4 py-2 bg-card/30 backdrop-blur-sm rounded-full border border-white/10">
              <div className="w-4 h-4 text-[var(--primary)]">
                <LuTrophy />
              </div>
              <span className="text-sm text-white ">Tournament Style</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/30 backdrop-blur-sm rounded-full border border-white/10">
              <div className="w-4 h-4 text-[var(--primary)]">
                <MdPeople />
              </div>
              <span className="text-sm text-white">Your Playlists</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/30 backdrop-blur-sm rounded-full border border-white/10">
              <div className="w-4 h-4 text-[var(--primary)]">
                <HiOutlineLightningBolt />
              </div>
              <span className="text-sm text-white">Instant Setup</span>
            </div>
          </div>
        </div>

        <div
          className="flex-shrink-0 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="p-8 w-full max-w-sm bg-card/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  Ready to Play?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Connect your Spotify to create your first music tournament
                </p>
              </div>

              <button
                onClick={handleSpotifyLogin}
                className="primary-shadow text-black font-semibold w-full group bg-[var(--primary)] rounded-lg px-5 py-3 hover:bg-green-700 transition flex items-center justify-center gap-4"
              >
                <FaMusic className="w-4 h-4" />
                Connect with Spotify
              </button>

              <div className="space-y-2 text-[var(--text-primary-lighter)]">
                <p className="text-xs text-muted-foreground opacity-70">
                  Free to use • No credit card required
                </p>
                <p className="text-xs text-muted-foreground opacity-50">
                  We only access your public playlists and liked songs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
