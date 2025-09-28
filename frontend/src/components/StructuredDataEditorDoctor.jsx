import { useState, useEffect } from 'react'

const StructuredDataEditorDoctor = ({ structuredData, setStructuredData, isParsing }) => {
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
            <label htmlFor="chiefComplaint">Chief Complaint</label>
            <textarea
              id="chiefComplaint"
              rows={4}
              value={editableStructuredData.chiefComplaint || ''}
              onChange={(e) => handleStructuredDataChange('chiefComplaint', e.target.value)}
              placeholder="Chief Complaint..."
            />
          </div>
          <div className="field-group">
            <label htmlFor="presentIllness">Present Illness History</label>
            <textarea
              id="presentIllness"
              rows={4}
              value={editableStructuredData.presentIllness || ''}
              onChange={(e) => handleStructuredDataChange('presentIllness', e.target.value)}
              placeholder="Present Illness History..."
            />
          </div>
          <div className="field-group">
            <label htmlFor="pastIllness">Past Illness History</label>
            <textarea
              id="pastIllness"
              rows={4}
              value={editableStructuredData.pastIllness || ''}
              onChange={(e) => handleStructuredDataChange('pastIllness', e.target.value)}
              placeholder="Past Illness History..."
            />
          </div>
          <div className="field-group">
            <label htmlFor="symptoms">Symptoms</label>
            <textarea
              id="symptoms"
              rows={4}
              value={editableStructuredData.symptoms || ''}
              onChange={(e) => handleStructuredDataChange('symptoms', e.target.value)}
              placeholder="Symptoms..."
            />
          </div>
          <div className="field-group">
            <label htmlFor="treatment">Treatment Plan</label>
            <textarea
              id="treatment"
              rows={4}
              value={editableStructuredData.treatment || ''}
              onChange={(e) => handleStructuredDataChange('treatment', e.target.value)}
              placeholder="Treatment Plan..."
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default StructuredDataEditorDoctor