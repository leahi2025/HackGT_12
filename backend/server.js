import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch"; // required for server-side fetch in Node.js

dotenv.config();

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.listen(3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});


app.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
          // store role in user_metadata on the auth user
          data: { role }
        }
    });

    if (error) return res.status(400).json({ error: error.message });

    res.json({ user: data.user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(401).json({ error: error.message });

    res.json({ user: data.user, session: data.session });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/session", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // your real API key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-transcribe", // can be parameterized
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ error: "Failed to create session" });
    }

    res.json(data); // returns ephemeral token + session config
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error creating session" });
  }
});