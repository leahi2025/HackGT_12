import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, 
}));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

app.listen(3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});


function getSupabaseWithAuth(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}



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


app.get("/patients", async (req, res) => {

  const supabase = getSupabaseWithAuth(req);
  if (!supabase) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await supabase.from("patients").select("*");

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.get("/patients/profile", async (req, res) => {

  const supabase = getSupabaseWithAuth(req);
  if (!supabase) return res.status(401).json({ error: "Unauthorized" });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return res.status(401).json({ error: "Invalid user" });

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .select("*")
    .eq("id", user.id)
    .single();

  if (patientError) return res.status(400).json({ error: patientError.message });
  if (!patient) return res.status(404).json({ error: "Patient profile not found" });

  res.json(patient);
});


app.get("/hcp", async (req, res) => {

  const supabase = getSupabaseWithAuth(req);
  if (!supabase) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await supabase.from("hcp").select("*");

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.get("/hcp/profile", async (req, res) => {

  const supabase = getSupabaseWithAuth(req);
  if (!supabase) return res.status(401).json({ error: "Unauthorized" });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return res.status(401).json({ error: "Invalid user" });

  const { data: hcp, error: hcpError } = await supabase
    .from("hcp")
    .select("*")
    .eq("id", user.id)
    .single();

  if (hcpError) return res.status(400).json({ error: hcpError.message });
  if (!hcp) return res.status(404).json({ error: "Patient profile not found" });

  res.json(hcp);
});

app.get("/records", async (req, res) => {

  const supabase = getSupabaseWithAuth(req);
  if (!supabase) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await supabase.from("records").select("*").order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);

});

app.get("/upcoming-appointments", async (req, res) => {

  const supabase = getSupabaseWithAuth(req);
  if (!supabase) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await supabase.from("appointments").select("*").filter('occurred','eq', false).order('date', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.get("/previous-appointments", async (req, res) => {

  const supabase = getSupabaseWithAuth(req);
  if (!supabase) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await supabase.from("appointments").select("*").filter('occurred','eq', true).order('date', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
