export async function GET(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return new Response(JSON.stringify({ error: "No token provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    let allTracks = [];
    let limit = 50;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch liked songs");

      const data = await response.json();
      allTracks = allTracks.concat(data.items.map((item) => item.track));

      offset += limit;
      if (data.items.length < limit) hasMore = false;
    }

    return new Response(JSON.stringify(allTracks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
