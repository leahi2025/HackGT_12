// Profile.jsx
import { useEffect, useState } from "react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const categories = [
    "Cardiology",
    "Orthopaedics",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Psychiatry",
    "General Medicine",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`http://localhost:3000/patients/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // Ensure categories is always an array
      setProfile({
        ...data,
        category_of_concern: data.category_of_concern || [],
      });

      setLoading(false);
    };
    fetchProfile();
  }, [userId, token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await fetch(`http://localhost:3000/patients/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
    alert("Profile updated!");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Your Profile</h2>

      <div>
        <label>Birthdate:</label>
        <input
          type="date"
          name="birthdate"
          value={profile.birthdate || ""}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Categories of Concern:</label>
        <div>
            {categories.map((cat) => (
            <label key={cat} style={{ marginRight: "10px" }}>
                <input
                type="radio"
                name="category_of_concern"
                value={cat}
                checked={profile.category_of_concern === cat}
                onChange={(e) =>
                    setProfile({ ...profile, category_of_concern: e.target.value })
                }
                />
                {cat}
            </label>
            ))}
        </div>
      </div>

      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
}

export default Profile;
