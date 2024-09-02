import React from "react";

const SpotifyPlayer = ({ trackId }) => {
  if (!trackId) return null;

  return (
    <div className="w-full">
      <iframe
        className="w-full"
        title="Spotify Player"
        style={{ height: "375px", margin: "0", padding: "0" }}
        allowFullScreen="true"
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
        width="100%"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default SpotifyPlayer;
