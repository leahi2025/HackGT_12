import { useState, useEffect } from 'react'
import StructuredDataEditorNurse from './StructuredDataEditorNurse'
import StructuredDataEditorDoctor from './StructuredDataEditorDoctor'

const TranscriptEditor = ({ transcript, setTranscript, structuredData, setStructuredData, onSave, isTranscribing, isParsing,currentRole }) => {
  const [editableTranscript, setEditableTranscript] = useState('')

  useEffect(() => {
    setEditableTranscript(transcript)
  }, [transcript])

  const handleTranscriptChange = (e) => {
    setEditableTranscript(e.target.value)
    setTranscript(e.target.value)
  }

  const handleSave = () => {
    if (editableTranscript.trim() || Object.keys(structuredData).length > 0) {
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
      {currentRole == 'nurse' && (
        <StructuredDataEditorNurse
          structuredData={structuredData}
          setStructuredData={setStructuredData}
          isParsing={isParsing}
        />
      )}

      {currentRole == 'doctor' && (
        <StructuredDataEditorDoctor
          structuredData={structuredData}
          setStructuredData={setStructuredData}
          isParsing={isParsing}
        />
      )}
      <div className="editor-actions">
        <button onClick={handleSave} className="save-button">
          Save Visit
        </button>
      </div>
    </div>
  )
}

export default TranscriptEditor