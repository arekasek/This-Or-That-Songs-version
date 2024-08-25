import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  try {
    const tokenRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/spotify/auth`
    );
    if (!tokenRes.ok) {
      throw new Error("Failed to fetch access token");
    }
    const { access_token } = await tokenRes.json();

    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=10`;
    const response = await axios.get(searchUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const topTracks = response.data.tracks.items.slice(0, 5);
    return new Response(JSON.stringify(topTracks), { status: 200 });
  } catch (error) {
    console.error("Error searching tracks:", error.message);
    return new Response("Failed to search tracks", { status: 500 });
  }
}
