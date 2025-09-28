const PatientDashboard = ({ nurseRecords = [] }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getLatestVitals = () => {
    if (!Array.isArray(nurseRecords) || nurseRecords.length === 0) return null
    const latestVisit = nurseRecords[0]
    return latestVisit.structuredData
  }

  const latestVitals = getLatestVitals()

  return (
    <div className="patient-dashboard">
      <h2>Patient Dashboard</h2>
      
      {latestVitals && (
        <div className="current-vitals">
          <h3>Latest Vitals</h3>
          <div className="vitals-grid">
            {latestVitals.bloodPressure && (
              <div className="vital-card">
                <div className="vital-label">Blood Pressure</div>
                <div className="vital-value">{latestVitals.bloodPressure}</div>
              </div>
            )}
            
            {latestVitals.weight && (
              <div className="vital-card">
                <div className="vital-label">Weight</div>
                <div className="vital-value">{latestVitals.weight} lbs</div>
              </div>
            )}
            
            {latestVitals.heartRate && (
              <div className="vital-card">
                <div className="vital-label">Heart Rate</div>
                <div className="vital-value">{latestVitals.heartRate} bpm</div>
              </div>
            )}
            
            {latestVitals.temperature && (
              <div className="vital-card">
                <div className="vital-label">Temperature</div>
                <div className="vital-value">{latestVitals.temperature}°F</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="visit-history">
      {nurseRecords.length === 0 ? (
        <p className="no-nurseRecords">No nurse records recorded yet.</p>
      ) : (
        <>
          <h3>Recent nurseRecords ({nurseRecords.length})</h3>
          <div className="nurseRecords-list">
            {nurseRecords.map((visit) => (
              <div key={visit.id} className="visit-card">
                <div className="visit-header">
                  <div className="visit-date">{formatDate(visit.created_at)}</div>
                  <div className="visit-id">Visit #{visit.id}</div>
                </div>
                <div className="visit-content">
                  <div className="visit-transcript">
                    <strong>Notes:</strong> {visit.transcript}
                  </div>
                  {visit.structuredData && Object.keys(visit.structuredData).length > 0 && (
                    <div className="visit-vitals">
                      <strong>Vitals:</strong>
                      <div className="vitals-summary">
                        {visit.structuredData.bloodPressure && (
                          <span className="vital-item">BP: {visit.structuredData.bloodPressure}</span>
                        )}
                        {visit.structuredData.weight && (
                          <span className="vital-item">Weight: {visit.structuredData.weight}lbs</span>
                        )}
                        {visit.structuredData.heartRate && (
                          <span className="vital-item">HR: {visit.structuredData.heartRate}bpm</span>
                        )}
                        {visit.structuredData.temperature && (
                          <span className="vital-item">Temp: {visit.structuredData.temperature}°F</span>
                        )}
                      </div>
                    </div>
                  )}
                  {visit.structuredData?.symptoms && visit.structuredData.symptoms.length > 0 && (
                    <div className="visit-symptoms">
                      <strong>Symptoms:</strong> {visit.structuredData.symptoms.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
  )
}

export default PatientDashboard