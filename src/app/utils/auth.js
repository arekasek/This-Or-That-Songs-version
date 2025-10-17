"use client";

export const getSpotifyToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("spotify_token");
};

export const setSpotifyToken = (token) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("spotify_token", token);
};

export const handleSpotifyCallback = () => {
  if (typeof window === "undefined") return null;

  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  const token = params.get("access_token");

  if (token) {
    setSpotifyToken(token);
    window.history.replaceState({}, document.title, window.location.pathname);
    return token;
  }

  return null;
};
