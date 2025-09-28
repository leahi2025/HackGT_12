import { useEffect, useState } from "react";

function HCPProfile() {
  const [profile, setProfile] = useState({
    name: "",
    birthdate: "",
    clinic: "",
    specialty: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
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
      setMessage("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

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
        setMessage("Profile updated successfully!");
      } else {
        const err = await res.json();
        setMessage(err.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error occurred");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="medical-app">
        <header className="app-header">
          <h1>EchoHealth</h1>
          <p className="patient-info">Loading your profile...</p>
        </header>
        <div className="loading-container">
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-app">
      {/* Header */}
      <header className="app-header">
        <h1>EchoHealth - Doctor Profile</h1>
        <p className="patient-info">
          Manage your professional information and settings
        </p>
      </header>

      {/* Profile Content */}
      <main className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <h2>Professional Profile</h2>
            <p>Keep your information up to date for better patient care coordination</p>
          </div>

          <form onSubmit={handleSave} className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="field-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    value={profile.name || ""}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                    className="profile-input"
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="birthdate">Date of Birth</label>
                  <input
                    id="birthdate"
                    type="date"
                    value={profile.birthdate || ""}
                    onChange={(e) => setProfile({ ...profile, birthdate: e.target.value })}
                    className="profile-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Professional Information</h3>
              <div className="form-row">
                <div className="field-group">
                  <label htmlFor="clinic">Clinic/Hospital</label>
                  <input
                    id="clinic"
                    type="text"
                    value={profile.clinic || ""}
                    onChange={(e) => setProfile({ ...profile, clinic: e.target.value })}
                    placeholder="Enter your workplace"
                    className="profile-input"
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="specialty">Medical Specialty *</label>
                  <select
                    id="specialty"
                    value={profile.specialty || ""}
                    onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                    required
                    className="profile-select"
                  >
                    <option value="">--Select your specialty--</option>
                    {specialties.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                disabled={saving}
                className={`save-profile-button ${saving ? 'saving' : ''}`}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>

          {message && (
            <div className={`profile-message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default HCPProfile;
