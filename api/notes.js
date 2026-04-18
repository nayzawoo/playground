import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const REDIS_KEY = "tools_notes";

export default async function handler(req, res) {
  // CORS headers for local dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Edit-Password");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET — fetch notes (no password needed)
  if (req.method === "GET") {
    try {
      const data = await redis.get(REDIS_KEY);
      return res.status(200).json({ success: true, data: data || null });
    } catch (err) {
      return res.status(500).json({ success: false, error: "Failed to fetch from Redis" });
    }
  }

  // POST — save notes (password required)
  if (req.method === "POST") {
    const password = req.headers["x-edit-password"];
    const serverPassword = process.env.EDIT_PASSWORD;

    if (!serverPassword) {
      return res.status(500).json({ success: false, error: "Server password not configured" });
    }

    if (!password || password !== serverPassword) {
      return res.status(401).json({ success: false, error: "Invalid password" });
    }

    try {
      const body = req.body;
      if (!body || !body.tabs) {
        return res.status(400).json({ success: false, error: "Invalid payload" });
      }

      await redis.set(REDIS_KEY, JSON.stringify(body));
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: "Failed to save to Redis" });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
