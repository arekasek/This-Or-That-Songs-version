import axios from "axios";

export async function GET(request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const tokenUrl = "https://accounts.spotify.com/api/token";

  const urlParams = new URL(request.url).searchParams;
  const playlistId = urlParams.get("playlistId");

  if (!playlistId) {
    return new Response("Missing playlistId", { status: 400 });
  }

  const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;

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
    });

    const imageUrl =
      playlistResponse.data.images[0]?.url || "https://via.placeholder.com/300";

    return new Response(JSON.stringify({ image: imageUrl }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching playlist image:", error);
    return new Response("Failed to fetch playlist image", {
      status: 500,
    });
  }
}
