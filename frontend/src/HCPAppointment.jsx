import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./App.css";
import VoiceRecorder from "./components/VoiceRecorder";
import TranscriptEditor from "./components/TranscriptEditor";
import PatientDashboard from "./components/PatientDashboard";
import PatientTrends from "./components/PatientTrends";

function HCPAppointment() {
  const { id } = useParams(); // get appointment id from URL
  const [currentPatient, setCurrentPatient] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [dialogueTranscript, setDialogueTranscript] = useState("");
  const [isFormattingDialogue, setIsFormattingDialogue] = useState(false);
  const [structuredData, setStructuredData] = useState({});
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentRole, setCurrentRole] = useState("nurse");
  const [visits, setVisits] = useState([]);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const token = localStorage.getItem("token");

  // Fetch appointment data by id
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await fetch(`http://localhost:3000/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          // Set current patient info and visits
          setCurrentPatient({ id: data.patient.id, name: data.patient.name || "Unknown Patient" });

          setVisits([
            {
              id: data.id,
              patientId: data.patient,
              date: data.date,
              transcript: data.transcript || "",
              structuredData: data.structured_data || {},
              reason: data.reason,
            },
          ]);
        } else {
          console.error("Error fetching appointment:", data.error);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchAppointment();
  }, [id]);

  // keep your handleAudioRecorded and handleSaveVisit as is
  const handleAudioRecorded = async (audioBlob) => {
    // ... (your existing transcription code)
  };

  const handleSaveVisit = () => {
    const newVisit = {
      id: visits.length + 1,
      patientId: currentPatient.id,
      date: new Date().toISOString().split("T")[0],
      transcript: transcript,
      structuredData: structuredData,
      recordedBy: currentRole,
    };

    setVisits([newVisit, ...visits]);
    setTranscript("");
    setStructuredData({});
  };

  if (!currentPatient) return <div>Loading appointment...</div>;

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
          <PatientDashboard visits={visits.filter((v) => v.patientId === currentPatient.id)} />
          <PatientTrends visits={visits.filter((v) => v.patientId === currentPatient.id)} />
        </div>
      </div>
    </div>
  );
}

export default HCPAppointment;
