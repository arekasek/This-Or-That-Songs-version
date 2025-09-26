export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: "No token provided" });

  try {
    let allTracks = [];
    let limit = 50;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Spotify API error:", text);
        throw new Error("Failed to fetch liked songs");
      }

      const data = await response.json();
      allTracks = allTracks.concat(data.items.map((item) => item.track));

      offset += limit;
      if (data.items.length < limit) hasMore = false;
    }

    res.status(200).json(allTracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
