// PatientDashboard.jsx

const renderField = (label, value) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  let displayValue = value;
  if (Array.isArray(value)) {
    displayValue = value.join(", ");
  }

  return (
    <div>
      <strong>{label}:</strong> {displayValue}
    </div>
  );
};

export default function PatientDashboard({ visits }) {
  return (
    <div className="patient-dashboard">
      <h2>Patient Visits</h2>
      {visits.length === 0 ? (
        <p>No visits recorded yet.</p>
      ) : (
        visits.map((visit, index) => (
          <div key={index} className="visit-card">
            <div>
              <strong>Date:</strong>{" "}
              {visit.date ? new Date(visit.date).toLocaleDateString() : "—"}
            </div>

            {/* Structured data (works for nurse + doctor visits) */}
            {visit.structuredData && (
              <div className="structured-data">
                {renderField("Blood Pressure", visit.structuredData.bloodPressure || visit.structuredData.blood_pressure)}
                {renderField("Height", visit.structuredData.height)}
                {renderField("Weight", visit.structuredData.weight)}
                {renderField("Heart Rate", visit.structuredData.heartRate || visit.structuredData.heart_rate)}
                {renderField("Temperature", visit.structuredData.temperature)}

                {/* Doctor-specific fields */}
                {renderField("Chief Complaint", visit.structuredData.chiefComplaint)}
                {renderField("Present Illness", visit.structuredData.presentIllness)}
                {renderField("Past Illness", visit.structuredData.pastIllness)}
                {renderField("Symptoms", visit.structuredData.symptoms)}
                {renderField("Treatment Plan", visit.structuredData.treatment)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
