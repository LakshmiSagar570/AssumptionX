export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return Response.json([], { status: 200 });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  // If Supabase isn't configured yet, return empty array gracefully
  if (!url || !key) return Response.json([], { status: 200 });

  try {
    const res = await fetch(
      `${url}/rest/v1/analyses?user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc&limit=50&select=id,idea,risk_level,created_at,result`,
      {
        headers: {
          "apikey": key,
          "Authorization": `Bearer ${key}`,
        },
      }
    );

    if (!res.ok) return Response.json([], { status: 200 });
    const data = await res.json();
    return Response.json(Array.isArray(data) ? data : []);
  } catch {
    return Response.json([], { status: 200 });
  }
}