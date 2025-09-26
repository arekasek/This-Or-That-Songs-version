import { Inter } from "next/font/google";
import "./globals.css";
import CursorGlow from "./components/CursorGlow";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "This or That | Music Game",
  description: "Music game with Spotify integration This or That | Music Game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.ico" />
      </head>
      <body className={inter.className}>
        <div
          className="min-h-screen h-auto flex items-center justify-center relative gradient-hero text-white"
          style={{
            backgroundImage: `url('/bg.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[hsl(0,0%,6%)]/90 backdrop-blur-sm z-0" />

          <CursorGlow />

          <div className="relative z-10 w-full h-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
