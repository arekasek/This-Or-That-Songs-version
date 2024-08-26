import axios from "axios";

export async function GET(request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const tokenUrl = "https://accounts.spotify.com/api/token";

  const urlParams = new URL(request.url).searchParams;
  const playlistId = urlParams.get("playlistId") || "748Q8znXiHWpL0uFZEMjR5";
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
        limit: 1,
      },
    });

    const totalTracks = playlistResponse.data.total;

    let allTracks = [];
    let nextUrl = playlistUrl;
    let limit = 100;
    let offset = 0;

    while (nextUrl) {
      const playlistResponse = await axios.get(nextUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          limit: limit,
          offset: offset,
        },
      });

      const tracks = playlistResponse.data.items.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists,
        album: item.track.album,
        preview_url: item.track.preview_url,
        external_urls: item.track.external_urls,
      }));

      allTracks = [...allTracks, ...tracks];
      nextUrl = playlistResponse.data.next;
      offset += limit;
      if (offset >= totalTracks) break;
    }

    return new Response(JSON.stringify(allTracks), {
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
