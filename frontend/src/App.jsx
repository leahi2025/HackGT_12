import { useState } from 'react'
import './App.css'
import VoiceRecorder from './components/VoiceRecorder'
import TranscriptEditor from './components/TranscriptEditor'
import PatientDashboard from './components/PatientDashboard'
import PatientTrends from './components/PatientTrends'

function App() {
  const [currentPatient, setCurrentPatient] = useState({ id: 1, name: 'John Doe' })
  const [transcript, setTranscript] = useState('')
  const [dialogueTranscript, setDialogueTranscript] = useState('')
  const [isFormattingDialogue, setIsFormattingDialogue] = useState(false)
  const [structuredData, setStructuredData] = useState({})
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentRole, setCurrentRole] = useState('nurse') // Change default to nurse
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
    setIsTranscribing(true)
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
    setIsTranscribing(false)

    const nursePrompt = `
Extract the following metrics from this medical transcript of a conversation between a nurse and a patient:
- Blood Pressure
- Height
- Heart Rate
- Weight
- Temperature

Return as JSON with keys: bloodPressure (using a / instead of "over"), height, heartRate, weight, temperature. If any metric is not mentioned, don't include it in the json response

Transcript:
"${data.text}"`.trim();
const doctorPrompt = `
Extract the following information from this medical transcript of a conversation between a doctor and a patient:
- Chief Complaint
- Present Illness History
- Past Illness History
- Symptoms
- Treatment Plan

Return as JSON with keys: chiefComplaint, presentIllness, pastIllness, symptoms, treatment. If any information is not mentioned, don't include it in the json response

Transcript:
"${data.text}"`.trim();
    setIsParsing(true)
  const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: currentRole == 'nurse' ? nursePrompt : doctorPrompt}],
      max_tokens: 150,
      temperature: 0,
    }),
  });

  const gptData = await gptRes.json();
  setIsParsing(false)
  let extracted = {};
  try {
    const text = gptData.choices[0].message.content;
    console.log("GPT raw response:", text);
    extracted = JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse GPT response:", gptData);
    extracted = {};
  }
  setStructuredData(extracted);

  setIsFormattingDialogue(true);
  const dialoguePrompt = `
Format the following medical transcript as a dialogue between a Patient and a Nurse. The patient's name is ${currentPatient.name}.
Label each line with "${currentPatient.name}:" or "Nurse:" as appropriate. If the speaker is unclear, make your best guess.

Transcript:
"${data.text}"`.trim();
  const dialogueRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: dialoguePrompt }],
      max_tokens: 300,
      temperature: 0,
    }),
  });

  const dialogueData = await dialogueRes.json(); // 15. Parse the GPT response for dialogue
  let formattedDialogue = '';
  try {
    formattedDialogue = dialogueData.choices[0].message.content.trim(); // 16. Extract the dialogue text
  } catch (e) {
    formattedDialogue = data.text; // 17. Fallback to original transcript if error
  }
  setDialogueTranscript(formattedDialogue); // 18. Save the dialogue to state
  console.log(formattedDialogue);
  setIsFormattingDialogue(false);
}

  const handleSaveVisit = () => {
    const newVisit = {
      id: visits.length + 1,
      patientId: currentPatient.id,
      date: new Date().toISOString().split('T')[0],
      transcript: transcript,
      structuredData: structuredData,
      recordedBy: currentRole // Include role in visit data
    }
    
    setVisits([newVisit, ...visits])
    setTranscript('')
    setStructuredData({})
  }

  return (
    <div className="medical-app">
      <header className="app-header">
        <h1>EchoHealth Voice Transcription System</h1>
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
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
          />
        </div>
        
        <div className="transcript-section">
          <TranscriptEditor 
            transcript={transcript}
            setTranscript={setTranscript}
            structuredData={structuredData}
            setStructuredData={setStructuredData}
            onSave={handleSaveVisit}
            isTranscribing={isTranscribing}
            isParsing={isParsing}
            currentRole={currentRole}
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
