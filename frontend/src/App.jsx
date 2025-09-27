import { useState } from 'react'
import './App.css'
import VoiceRecorder from './components/VoiceRecorder'
import TranscriptEditor from './components/TranscriptEditor'
import PatientDashboard from './components/PatientDashboard'
import PatientTrends from './components/PatientTrends'

function App() {
  const [currentPatient, setCurrentPatient] = useState({ id: 1, name: 'John Doe' })
  const [transcript, setTranscript] = useState('')
  const [structuredData, setStructuredData] = useState({})
  const [isRecording, setIsRecording] = useState(false)
  const [visits, setVisits] = useState([
    {
      id: 1,
      patientId: 1,
      date: '2025-09-20',
      transcript: 'Patient reports blood pressure of 120/80, weight 165 pounds. Feeling well overall.',
      structuredData: { bloodPressure: '120/80', weight: 165 }
    },
    {
      id: 2,
      patientId: 1,
      date: '2025-09-15',
      transcript: 'Blood pressure reading 118/75, weight 163 pounds.',
      structuredData: { bloodPressure: '118/75', weight: 163 }
    }
  ])
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const handleAudioRecorded = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("model", "whisper-1");
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`, // set this in .env
      },
      body: formData
    });

    const data = await res.json();
    setTranscript(data.text);
    
    // Simulate API response
    setTimeout(() => {
      const mockStructuredData = {
        bloodPressure: '125/85',
        weight: 167,
        symptoms: ['headache']
      }
      setStructuredData(mockStructuredData)
    }, 2000)
  }

  const handleSaveVisit = () => {
    const newVisit = {
      id: visits.length + 1,
      patientId: currentPatient.id,
      date: new Date().toISOString().split('T')[0],
      transcript: transcript,
      structuredData: structuredData
    }
    
    setVisits([newVisit, ...visits])
    setTranscript('')
    setStructuredData({})
  }

  return (
    <div className="medical-app">
      <header className="app-header">
        <h1>Medical Voice Transcription System</h1>
        <div className="patient-info">
          <strong>Current Patient: {currentPatient.name}</strong>
        </div>
      </header>
      
      <div className="app-content">
        <div className="recording-section">
          <VoiceRecorder 
            onAudioRecorded={handleAudioRecorded}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
        </div>
        
        <div className="transcript-section">
          <TranscriptEditor 
            transcript={transcript}
            setTranscript={setTranscript}
            structuredData={structuredData}
            setStructuredData={setStructuredData}
            onSave={handleSaveVisit}
          />
        </div>
        
        <div className="dashboard-section">
          <PatientDashboard visits={visits.filter(v => v.patientId === currentPatient.id)} />
          <PatientTrends visits={visits.filter(v => v.patientId === currentPatient.id)} />
        </div>
      </div>
    </div>
  )
}

export default App
