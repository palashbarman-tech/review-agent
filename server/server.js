import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_MODEL = "gemini-3.6-flash";

app.post("/api/draft", async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY set nahi hai. server/.env file me apni key daalo (server/.env.example dekho).",
    });
  }

  try {
    // Frontend { system, messages: [{ role, content }] } bhejta hai (Anthropic-style shape).
    // Yahan usko Gemini ke generateContent shape me convert karte hain.
    const { system, messages } = req.body;
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
      return res.status(response.status).json({ error: data?.error?.message || "Gemini API error" });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: "Gemini se khaali response mila. Phir se try karo." });
    }

    // Frontend Anthropic-shape response expect karta hai: data.content = [{ type: "text", text }]
    res.json({ content: [{ type: "text", text }] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Draft server chal raha hai: http://localhost:${PORT}`);
});
