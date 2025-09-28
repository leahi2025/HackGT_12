import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HCPDashboard() {
  const [upcoming, setUpcoming] = useState([]);
  const [previous, setPrevious] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcoming();
    fetchPrevious();
  }, []);

  if (loading) {
    return (
      <div className="medical-app">
        <header className="app-header">
          <h1>EchoHealth</h1>
          <p className="patient-info">Loading your dashboard...</p>
        </header>
        <div className="loading-container">
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-app">
      {/* Header */}
      <header className="app-header">
        <h1>EchoHealth - Doctor Dashboard</h1>
        <p className="patient-info">
          Welcome back - Managing your patient appointments
        </p>
      </header>

      {/* Dashboard Content */}
      <main className="hcp-dashboard-content">
        {/* Upcoming Appointments Section */}
        <section className="appointments-section upcoming-section">
          <div className="section-header">
            <h2>Upcoming Appointments</h2>
            <div className="appointments-count">
              {upcoming.length} scheduled
            </div>
          </div>
          
          <div className="appointments-list">
            {upcoming.length > 0 ? (
              upcoming.map((appt) => (
                <Link 
                  key={appt.id} 
                  to={`/appointments/${appt.id}`} 
                  className="appointment-card upcoming"
                >
                  <div className="appointment-header">
                    <div className="appointment-date">
                      <span className="date-primary">
                        {new Date(appt.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="date-time">
                        {new Date(appt.date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="appointment-status upcoming-status">
                      Scheduled
                    </div>
                  </div>
                  
                  <div className="appointment-details">
                    <div className="patient-info-card">
                      <span className="patient-icon">👤</span>
                      <span className="patient-name">{appt.patientName}</span>
                    </div>
                    
                    <div className="appointment-reason">
                      <span className="reason-icon">📋</span>
                      <span className="reason-text">{appt.reason}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-appointments">
                <div className="no-appointments-icon">📅</div>
                <h3>No upcoming appointments</h3>
                <p>Your schedule is clear for now.</p>
              </div>
            )}
          </div>
        </section>

        {/* Previous Appointments Section */}
        <section className="appointments-section previous-section">
          <div className="section-header">
            <h2>Recent Appointments</h2>
            <div className="appointments-count">
              {previous.length} completed
            </div>
          </div>
          
          <div className="appointments-list">
            {previous.length > 0 ? (
              previous.map((appt) => (
                <Link 
                  key={appt.id} 
                  to={`/appointments/${appt.id}`} 
                  className="appointment-card previous"
                >
                  <div className="appointment-header">
                    <div className="appointment-date">
                      <span className="date-primary">
                        {new Date(appt.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="date-time">
                        {new Date(appt.date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="appointment-status completed-status">
                      Completed
                    </div>
                  </div>
                  
                  <div className="appointment-details">
                    <div className="patient-info-card">
                      <span className="patient-icon">👤</span>
                      <span className="patient-name">{appt.patientName}</span>
                    </div>
                    
                    <div className="appointment-reason">
                      <span className="reason-icon">📋</span>
                      <span className="reason-text">{appt.reason}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-appointments">
                <div className="no-appointments-icon">📋</div>
                <h3>No recent appointments</h3>
                <p>Previous appointments will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HCPDashboard;
