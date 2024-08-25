import axios from "axios";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const playlistId = "748Q8znXiHWpL0uFZEMjR5";
  const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  try {
    const tokenResponse = await axios.post(
      tokenUrl,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;
    const playlistResponse = await axios.get(playlistUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        limit: 100,
      },
    });

    const tracks = playlistResponse.data.items;
    const shuffledTracks = tracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 16)
      .map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists,
        album: item.track.album,
        preview_url: item.track.preview_url,
        external_urls: item.track.external_urls,
      }));

    return new Response(JSON.stringify(shuffledTracks), {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching tracks from playlist:", error);
    return new Response("Failed to fetch tracks from playlist", {
      status: 500,
    });
  }
}
