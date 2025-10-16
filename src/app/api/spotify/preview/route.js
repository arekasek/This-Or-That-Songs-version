import spotifyPreviewFinder from "spotify-preview-finder";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const trackUri = searchParams.get("trackUri");

  if (!trackUri) {
    return new Response(JSON.stringify({ error: "No trackUri provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const result = await spotifyPreviewFinder(trackUri, null, 1);

    const previewUrls =
      result?.results?.[0]?.previewUrls?.filter(Boolean) || [];

    return new Response(JSON.stringify({ previewUrls }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("preview finder error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
