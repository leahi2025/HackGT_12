import { useEffect, useState } from "react";

function HCPDashboard() {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // HCP ID

  // Fetch appointments for this doctor
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`http://localhost:3000/upcoming-appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <h2>Appointments with You</h2>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            {appt.date} — Patient {appt.patient} ({appt.reason})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HCPDashboard;
