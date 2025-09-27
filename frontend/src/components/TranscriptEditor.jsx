import { useState, useEffect } from 'react'

const TranscriptEditor = ({ transcript, setTranscript, structuredData, setStructuredData, onSave, isTranscribing }) => {
  const [editableTranscript, setEditableTranscript] = useState('')
  const [editableStructuredData, setEditableStructuredData] = useState({})

  useEffect(() => {
    setEditableTranscript(transcript)
  }, [transcript])

  useEffect(() => {
    setEditableStructuredData(structuredData)
  }, [structuredData])

  const handleTranscriptChange = (e) => {
    setEditableTranscript(e.target.value)
    setTranscript(e.target.value)
  }

  const handleStructuredDataChange = (field, value) => {
    const updated = { ...editableStructuredData, [field]: value }
    setEditableStructuredData(updated)
    setStructuredData(updated)
  }

  const handleSave = () => {
    if (editableTranscript.trim() || Object.keys(editableStructuredData).length > 0) {
      onSave()
      alert('Visit saved successfully!')
    } else {
      alert('Please record some audio or enter transcript data before saving.')
    }
  }

  return (
    <div className="transcript-editor">
      <h2>Transcript & Patient Data</h2>   
      {isTranscribing && (
        <p>Transcribing...</p>
      )}  
      <div className="transcript-section">
        <h3>Transcript</h3>
        <textarea
          value={editableTranscript}
          onChange={handleTranscriptChange}
          placeholder="Transcript will appear here after recording..."
          rows={6}
          className="transcript-textarea"
        />
      </div>
    
      <div className="structured-data-section">
        <h3>Extracted Patient Data</h3>
        
        <div className="data-fields">
          <div className="field-group">
            <label htmlFor="bloodPressure">Blood Pressure:</label>
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

      <div className="editor-actions">
        <button onClick={handleSave} className="save-button">
          Save Visit
        </button>
      </div>
    </div>
  )
}

export default TranscriptEditor