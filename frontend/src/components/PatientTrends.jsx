import { useEffect, useState } from 'react'

const PatientTrends = ({ patient }) => {
  const [nurseRecords, setNurseRecords] = useState([])
  const [selectedMetric, setSelectedMetric] = useState('weight')
  const token = localStorage.getItem("token")

  // Fetch nurse records for this patient
  useEffect(() => {
    if (!patient) return

    const fetchRecords = async () => {
      try {
        const res = await fetch(`http://localhost:3000/nurse-records?patient=${patient}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to fetch nurse records')
        const data = await res.json()
        console.log(data)
        const normalized = data.map(record => ({
          ...record,
          structuredData: {
            weight: record.weight,
            bloodPressure: record.blood_pressure,
            heartRate: record.heart_rate,
            temperature: record.temperature,
            height: record.height
          }
        }))
        console.log('Normalized records:', normalized)
        setNurseRecords(normalized)
      } catch (err) {
        console.error('Error fetching nurse records:', err)
        setNurseRecords([])
      }
    }

    fetchRecords()
  }, [patient])

  const getChartData = (metric) => {
    if (!Array.isArray(nurseRecords)) return []
    const data = nurseRecords
      .filter(record => record.structuredData && record.structuredData[metric])
      .map(record => ({
        date: record.created_at,
        value: metric === 'bloodPressure' 
          ? record.structuredData[metric]
          : parseFloat(record.structuredData[metric])
      }))
      .reverse() // Show oldest to newest
    return data
  }

  const chartData = getChartData(selectedMetric)

  // --- SimpleChart component remains exactly the same ---
  const SimpleChart = ({ data, metric }) => {
    if (data.length === 0) {
      return <div className="no-data">No data available for {metric}</div>
    }

    if (metric === 'bloodPressure') {
      return (
        <div className="bp-chart">
          {data.map((point, index) => (
            <div key={index} className="bp-point">
              <div className="bp-date">{new Date(point.date).toLocaleDateString()}</div>
              <div className="bp-value">{point.value}</div>
            </div>
          ))}
        </div>
      )
    }

    const values = data.map(d => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = maxValue - minValue || 1

    return (
      <div className="simple-chart">
        <div className="chart-container">
          {data.map((point, index) => {
            const height = ((point.value - minValue) / range) * 200 + 20
            const left = (index / (data.length - 1 || 1)) * 100
            
            return (
              <div
                key={index}
                className="chart-point"
                style={{
                  left: `${left}%`,
                  bottom: `${height}px`
                }}
                title={`${new Date(point.date).toLocaleDateString()}: ${point.value}`}
              >
                <div className="point-dot"></div>
                <div className="point-value">{point.value}</div>
                <div className="point-date">{new Date(point.date).toLocaleDateString()}</div>
              </div>
            )
          })}
          <svg className="chart-lines">
            {data.map((point, index) => {
              if (index === 0) return null
              const prevPoint = data[index - 1]
              const x1 = ((index - 1) / (data.length - 1 || 1)) * 100
              const y1 = ((prevPoint.value - minValue) / range) * 200 + 20
              const x2 = (index / (data.length - 1 || 1)) * 100
              const y2 = ((point.value - minValue) / range) * 200 + 20
              
              return (
                <line
                  key={index}
                  x1={`${x1}%`}
                  y1={`${240 - y1}px`}
                  x2={`${x2}%`}
                  y2={`${240 - y2}px`}
                  stroke="#007bff"
                  strokeWidth="2"
                />
              )
            })}
          </svg>
        </div>
      </div>
    )
  }

  const getMetricLabel = (metric) => {
    const labels = {
      weight: 'Weight (lbs)',
      bloodPressure: 'Blood Pressure',
      heartRate: 'Heart Rate (bpm)',
      temperature: 'Temperature (°F)'
    }
    return labels[metric] || metric
  }

  const availableMetrics = ['weight', 'bloodPressure', 'heartRate', 'temperature']
    .filter(metric => nurseRecords.some(record => record.structuredData && record.structuredData[metric]))

  return (
    <div className="patient-trends">
      <h2>Patient Trends</h2>
      
      {availableMetrics.length === 0 ? (
        <p className="no-trends">No trend data available. Record some nurse records with vitals to see trends.</p>
      ) : (
        <>
          <div className="trend-controls">
            <label htmlFor="metric-select">Select Metric:</label>
            <select
              id="metric-select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              {availableMetrics.map(metric => (
                <option key={metric} value={metric}>
                  {getMetricLabel(metric)}
                </option>
              ))}
            </select>
          </div>

          <div className="trend-chart">
            <h3>{getMetricLabel(selectedMetric)} Over Time</h3>
            <SimpleChart data={chartData} metric={selectedMetric} />
          </div>

          <div className="trend-summary">
            <h4>Summary</h4>
            {chartData.length > 0 && (
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-label">Latest:</span>
                  <span className="stat-value">
                    {selectedMetric === 'bloodPressure' 
                      ? chartData[chartData.length - 1].value 
                      : `${chartData[chartData.length - 1].value} ${getMetricLabel(selectedMetric).split('(')[1]?.replace(')', '') || ''}`
                    }
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Total Records:</span>
                  <span className="stat-value">{chartData.length}</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PatientTrends;
