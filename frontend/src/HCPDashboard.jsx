import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HCPDashboard() {
  const [upcoming, setUpcoming] = useState([]);
  const [previous, setPrevious] = useState([]);
  const token = localStorage.getItem("token");
  const doctorId = localStorage.getItem("userId");

  // Fetch upcoming appointments
  const fetchUpcoming = async () => {
    try {
      const res = await fetch(`http://localhost:3000/upcoming-appointments/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // If your backend only returns patient IDs, fetch their names
      const dataWithNames = await Promise.all(
        data.map(async (appt) => {
          const patientRes = await fetch(`http://localhost:3000/patients/${appt.patient.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const patientData = await patientRes.json();
          return { ...appt, patientName: patientData.name };
        })
      );

      setUpcoming(dataWithNames);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch previous appointments
  const fetchPrevious = async () => {
    try {
      const res = await fetch(`http://localhost:3000/previous-appointments/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const dataWithNames = await Promise.all(
        data.map(async (appt) => {
          const patientRes = await fetch(`http://localhost:3000/patients/${appt.patient.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const patientData = await patientRes.json();
          return { ...appt, patientName: patientData.name };
        })
      );

      setPrevious(dataWithNames);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUpcoming();
    fetchPrevious();
  }, []);

  return (
    <div>
      <h1>Doctor Dashboard</h1>

      <section>
        <h2>Upcoming Appointments</h2>
        <ul>
          {upcoming.map((appt) => (
            <li key={appt.id}>
              <Link to={`/appointments/${appt.id}`}>
                {appt.date} — Patient {appt.patientName} ({appt.reason})
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Previous Appointments</h2>
        <ul>
          {previous.map((appt) => (
            <li key={appt.id}>
              <Link to={`/appointments/${appt.id}`}>
                {appt.date} — Patient {appt.patientName} ({appt.reason})
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default HCPDashboard;
