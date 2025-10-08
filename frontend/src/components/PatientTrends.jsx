import React, { useEffect, useState } from 'react'

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

        // Normalize snake_case → camelCase
        const normalized = data.map(record => ({
          ...record,
          structuredData: {
            weight: record.weight,
            bloodPressure: record.blood_pressure,
            heartRate: record.heart_rate,
            temperature: record.temperature,
            height: record.height
          },
          date: record.created_at // align with chart expectations
        }))

        setNurseRecords(normalized)
      } catch (err) {
        console.error('Error fetching nurse records:', err)
        setNurseRecords([])
      }
    }

    fetchRecords()
  }, [patient, token])

  // ---- Chart data prep (from first file) ----
  const filteredRecords = nurseRecords
    .filter(rec =>
      rec.structuredData &&
      rec.structuredData[selectedMetric] !== undefined &&
      rec.structuredData[selectedMetric] !== null
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const chartData = filteredRecords.map(rec => ({
    date: rec.date,
    value: rec.structuredData[selectedMetric]
  }))

  // ---- Chart component (from first file) ----
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

    // Coerce values to numbers where possible (ignore non-numeric values)
    const processed = data.map(d => {
      const raw = d.value
      const numeric = typeof raw === 'number' ? raw : (typeof raw === 'string' ? parseFloat(String(raw).replace(/,/g, '').trim()) : NaN)
      return { ...d, numeric }
    }).filter(d => !Number.isNaN(d.numeric))

    if (processed.length === 0) {
      return <div className="no-data">No numeric data available for {metric}</div>
    }

    const values = processed.map(d => d.numeric)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = (maxValue - minValue) || 1

    const chartWidth = 700
    const chartHeight = 400
    const chartPadding = 60

    const pointPositions = processed.map((point, index) => {
      // center single point; otherwise distribute evenly
      const t = processed.length === 1 ? 0.5 : (index / (processed.length - 1))
      const x = chartPadding + t * (chartWidth - 2 * chartPadding)
      const y = chartHeight - chartPadding - ((point.numeric - minValue) / range) * (chartHeight - 2 * chartPadding)
      return { x, y, ...point }
    })

    return (
      <div className="simple-chart" style={{ position: "relative", width: chartWidth, height: chartHeight }}>
        <svg
          className="chart-lines"
          width={chartWidth}
          height={chartHeight}
          style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
        >
          {pointPositions.map((point, index) => {
            if (index === 0) return null
            const prev = pointPositions[index - 1]
            return (
              <line
                key={index}
                x1={prev.x}
                y1={prev.y}
                x2={point.x}
                y2={point.y}
                stroke="#007bff"
                strokeWidth="2"
              />
            )
          })}
        </svg>
        {pointPositions.map((point, index) => (
          <div
            key={index}
            className="chart-point"
            style={{
              position: "absolute",
              left: point.x - 6,
              top: point.y - 6,
              width: 12,
              height: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
            title={`${new Date(point.date).toLocaleDateString()}: ${point.value}`}
          >
            <div className="point-dot" style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#007bff",
              border: "2px solid #fff"
            }}></div>
            <div className="point-value" style={{ fontSize: 12 }}>{point.value}</div>
            <div className="point-date" style={{ fontSize: 10 }}>{new Date(point.date).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    )
  }

  // ---- Metric labels + availability ----
  const allMetrics = ['weight', 'bloodPressure', 'heartRate', 'temperature', 'height']
  const getMetricLabel = (metric) => {
    const labels = {
      weight: 'Weight (lbs)',
      bloodPressure: 'Blood Pressure',
      heartRate: 'Heart Rate (bpm)',
      temperature: 'Temperature (°F)',
      height: 'Height (in)'
    }
    return labels[metric] || metric
  }

  const metricsWithData = allMetrics.filter(metric =>
    nurseRecords.some(record =>
      record.structuredData &&
      record.structuredData[metric] !== undefined &&
      record.structuredData[metric] !== null
    )
  )

  return (
    <div className="patient-trends">
      <h2>Patient Trends</h2>

      {metricsWithData.length === 0 ? (
        <p className="no-trends">
          No trend data available. Record some nurse records with vitals to see trends.
        </p>
      ) : (
        <>
          <div className="trend-controls">
            <label htmlFor="metric-select">Select Metric:</label>
            <select
              id="metric-select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              {allMetrics.map(metric => (
                <option
                  key={metric}
                  value={metric}
                  disabled={!metricsWithData.includes(metric)}
                >
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
