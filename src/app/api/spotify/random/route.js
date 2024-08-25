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

    let allTracks = [];
    let nextUrl = playlistUrl;

    while (nextUrl) {
      const playlistResponse = await axios.get(nextUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      allTracks = allTracks.concat(playlistResponse.data.items);
      nextUrl = playlistResponse.data.next;
    }

    if (allTracks.length === 0) {
      return new Response("No tracks found in the playlist", { status: 404 });
    }

    const shuffledTracks = allTracks
      .map((item) => item.track) // Ensure we only have track objects
      .sort(() => 0.5 - Math.random());

    const topTracks = shuffledTracks.slice(0, 16).map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: track.album,
      preview_url: track.preview_url,
      external_urls: track.external_urls,
    }));

    return new Response(JSON.stringify(topTracks), {
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
