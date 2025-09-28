import { useEffect, useState } from "react";

function HCPProfile() {
  const [profile, setProfile] = useState({
    name: "",
    birthdate: "",
    clinic: "",
    specialty: "",
  });
  const token = localStorage.getItem("token");
  const doctorId = localStorage.getItem("userId"); // HCP ID

  const specialties = [
    "Cardiology",
    "Orthopaedics",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Psychiatry",
    "General Medicine",
  ];

  // Fetch doctor profile
  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:3000/hcp/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data) setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/hcp/${doctorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        alert("Profile updated!");
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Doctor Profile</h1>
      <form onSubmit={handleSave}>
        <label>
          Full Name:
          <input
            type="text"
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </label>
        <br />

        <label>
          Birthdate:
          <input
            type="date"
            value={profile.birthdate || ""}
            onChange={(e) => setProfile({ ...profile, birthdate: e.target.value })}
          />
        </label>
        <br />

        <label>
          Clinic:
          <input
            type="text"
            value={profile.clinic || ""}
            onChange={(e) => setProfile({ ...profile, clinic: e.target.value })}
          />
        </label>
        <br />

        <label>
          Specialty:
          <select
            value={profile.specialty || ""}
            onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
          >
            <option value="">--Select Specialty--</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <br />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default HCPProfile;
