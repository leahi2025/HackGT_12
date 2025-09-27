import { useEffect, useState } from "react";

function PatientDashboard() {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    hcp: "",
    date: "",
    reason: "",
  });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // patient id

  // Fetch upcoming appointments
  const fetchUpcomingAppointments = async () => {
    try {
      const res = await fetch("http://localhost:3000/upcoming-appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUpcomingAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch past appointments
  const fetchPastAppointments = async () => {
    try {
      const res = await fetch("http://localhost:3000/previous-appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPastAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch patient records
  const fetchRecords = async () => {
    try {
      const res = await fetch("http://localhost:3000/doctor-records", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Schedule appointment
  const handleScheduleAppointment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient: userId,
          hcp: newAppointment.hcp,
          date: newAppointment.date,
          reason: newAppointment.reason,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Appointment scheduled!");
        setNewAppointment({ hcp: "", date: "", reason: "" });
        fetchUpcomingAppointments(); // refresh list
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUpcomingAppointments();
    fetchPastAppointments();
    fetchRecords();
  }, []);

  return (
    <div>
      <h1>Patient Dashboard</h1>

      {/* Upcoming Appointments */}
      <section>
        <h2>Upcoming Appointments</h2>
        <ul>
          {upcomingAppointments.map((appt) => (
            <li key={appt.id}>
              {appt.date} with {appt.hcp} — {appt.reason}
            </li>
          ))}
        </ul>
      </section>

      {/* Past Appointments */}
      <section>
        <h2>Past Appointments</h2>
        <ul>
          {pastAppointments.map((appt) => (
            <li key={appt.id}>
              {appt.date} with {appt.hcp} — {appt.reason}
            </li>
          ))}
        </ul>
      </section>

      {/* Records */}
      <section>
        <h2>Records</h2>
        <ul>
          {records.map((rec) => (
            <li key={rec.id}>
              <strong>{rec.date}</strong>: {rec.notes || "No notes"}
            </li>
          ))}
        </ul>
      </section>

      {/* Schedule Appointment */}
      <section>
        <h2>Schedule New Appointment</h2>
        <form onSubmit={handleScheduleAppointment}>
          <input
            type="text"
            placeholder="HCP ID"
            value={newAppointment.hcp}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, hcp: e.target.value })
            }
            required
          />
          <input
            type="datetime-local"
            value={newAppointment.date}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, date: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Reason"
            value={newAppointment.reason}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, reason: e.target.value })
            }
            required
          />
          <button type="submit">Schedule</button>
        </form>
      </section>
    </div>
  );
}

export default PatientDashboard;
