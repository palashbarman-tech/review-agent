const GEMINI_MODEL = "gemini-3.6-flash";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      error: "GEMINI_API_KEY set nahi hai. Vercel project Settings > Environment Variables me add karo.",
    });
    return;
  }

  try {
    // Frontend { system, messages: [{ role, content }] } bhejta hai (Anthropic-style shape).
    // Yahan usko Gemini ke generateContent shape me convert karte hain.
    const { system, messages } = req.body || {};
    const userText = messages?.map((m) => m.content).join("\n") || "";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: userText }] }],
          generationConfig: { maxOutputTokens: 300 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data?.error?.message || "Gemini API error" });
      return;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      res.status(502).json({ error: "Gemini se khaali response mila. Phir se try karo." });
      return;
    }

    // Frontend Anthropic-shape response expect karta hai: data.content = [{ type: "text", text }]
    res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
