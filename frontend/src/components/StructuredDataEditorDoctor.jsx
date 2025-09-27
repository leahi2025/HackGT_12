import { useState, useEffect } from 'react'

const StructuredDataEditor = ({ structuredData, setStructuredData, isParsing }) => {
  const [editableStructuredData, setEditableStructuredData] = useState({})

  useEffect(() => {
    setEditableStructuredData(structuredData)
  }, [structuredData])

  const handleStructuredDataChange = (field, value) => {
    const updated = { ...editableStructuredData, [field]: value }
    setEditableStructuredData(updated)
    setStructuredData(updated)
  }

  return (
    <>
      {isParsing && (
        <p>Parsing transcript...</p>
      )} 
      <div className="structured-data-section">
        <h3>Extracted Patient Data</h3>
        
        <div className="data-fields">
          <div className="field-group">
            <label htmlFor="bloodPressure">Blood Pressure(doctor):</label>
            <input
              id="bloodPressure"
              type="text"
              value={editableStructuredData.bloodPressure || ''}
              onChange={(e) => handleStructuredDataChange('bloodPressure', e.target.value)}
              placeholder="e.g., 120/80"
            />
          </div>

          <div className="field-group">
            <label htmlFor="weight">Weight (lbs):</label>
            <input
              id="weight"
              type="number"
              value={editableStructuredData.weight || ''}
              onChange={(e) => handleStructuredDataChange('weight', parseFloat(e.target.value) || '')}
              placeholder="e.g., 165"
            />
          </div>

          <div className="field-group">
            <label htmlFor="heartRate">Heart Rate (bpm):</label>
            <input
              id="heartRate"
              type="number"
              value={editableStructuredData.heartRate || ''}
              onChange={(e) => handleStructuredDataChange('heartRate', parseFloat(e.target.value) || '')}
              placeholder="e.g., 72"
            />
          </div>

          <div className="field-group">
            <label htmlFor="temperature">Temperature (°F):</label>
            <input
              id="temperature"
              type="number"
              step="0.1"
              value={editableStructuredData.temperature || ''}
              onChange={(e) => handleStructuredDataChange('temperature', parseFloat(e.target.value) || '')}
              placeholder="e.g., 98.6"
            />
          </div>

          <div className="field-group">
            <label htmlFor="symptoms">Symptoms:</label>
            <input
              id="symptoms"
              type="text"
              value={editableStructuredData.symptoms?.join(', ') || ''}
              onChange={(e) => handleStructuredDataChange('symptoms', e.target.value.split(', ').filter(s => s.trim()))}
              placeholder="e.g., headache, fatigue"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default StructuredDataEditor