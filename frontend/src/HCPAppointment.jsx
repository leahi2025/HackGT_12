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
  const [nurseRecords, setNurseRecords] = useState([]);
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

  useEffect(() => {
    // Fetch nurse records for the current patient
    const fetchNurseRecords = async () => {
      try {
        const res = await fetch(`http://localhost:3000/nurse-records?patientId=${currentPatient.id}`);
        if (!res.ok) throw new Error('Failed to fetch nurse records');
        const data = await res.json();
        setNurseRecords(data);
      } catch (err) {
        console.error('Error fetching nurse records:', err);
        setNurseRecords([]);
      }
    };
    fetchNurseRecords();
  }, [currentPatient]);

  // keep your handleAudioRecorded and handleSaveVisit as is
  const handleAudioRecorded = async (audioBlob) => {
    setIsTranscribing(true)
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("model", "whisper-1");

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData
    });

    const data = await res.json();
    setTranscript(data.text);
    setIsTranscribing(false)
    console.log("Transcription result:", data.text);

    const nursePrompt = `
Extract the following metrics from this medical transcript of a conversation between a nurse and a patient:
- Blood Pressure
- Height
- Heart Rate
- Weight
- Temperature

Rules:
- Only include metrics that are explicitly stated with a numeric value (e.g., "120/80", "70 kilograms", "98.6 degrees").
- Ignore qualitative phrases (e.g., "high fever", "low blood pressure", "normal weight") if no number is provided.
- All metrics must be numeric. If a number cannot be determined, do not include that metric.
- Do not guess or infer values.

Return as JSON with keys: bloodPressure (using "/" instead of "over"), height, heartRate, weight, temperature.
If a metric is not present with a numeric value, exclude it from the JSON.

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
  const capitalizedRole = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
  const dialoguePrompt = `
You are a strict formatter. Your job is ONLY to reformat a transcript into dialogue.

Rules:
- Do NOT invent or add new words. Output ONLY the transcript content.
- Split the transcript into separate dialogue lines when there is a clear turn or sentence boundary.
- Label each line as "Patient:" or "Doctor:" if obvious, otherwise use "Unclear:".
- If the transcript contains multiple sentences from different people in a single line, split them into separate dialogue turns.
- Never collapse the entire transcript into one line.

Examples:
Transcript: "Hi"
Output:
Unclear: Hi

Transcript: "I have chest pain. How long have you had it? Two days."
Output:
Patient: I have chest pain.
Doctor: How long have you had it?
Patient: Two days.
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


  const handleSaveVisit = async () => {
    if (!currentPatient) return;

    const newVisit = {
      patient: currentPatient.id,
      transcript: transcript,
      structuredData: structuredData,
      appointment: id, // tie visit to appointment
    };

    // Update local state
    setVisits([newVisit, ...visits]);
    setTranscript("");
    setStructuredData({});

    try {
      // Check if nurse record exists for this appointment
      const resCheck = await fetch(
        `http://localhost:3000/nurse-records?appointmentId=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const existingRecords = await resCheck.json();
      const userId = localStorage.getItem("userId");
      if (resCheck.ok && existingRecords.length > 0) {
        // Record exists → update it
        const recordId = existingRecords[0].id;
        
        const resUpdate = await fetch(`http://localhost:3000/nurse-records/${recordId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            transcript: newVisit.transcript,
            height: newVisit.structuredData.height ? parseFloat(newVisit.structuredData.height) : null,
            weight: newVisit.structuredData.weight ? parseFloat(newVisit.structuredData.weight) : null,
            blood_pressure: newVisit.structuredData.bloodPressure, // as text
            heart_rate: newVisit.structuredData.heartRate ? parseInt(newVisit.structuredData.heartRate) : null,
            temperature: newVisit.structuredData.temperature ? parseFloat(newVisit.structuredData.temperature) : null,
            appointment: parseInt(id), // keep as string UUID if your DB uses UUIDs
            patient: currentPatient.id, 
            hcp: userId
          }),
        });

        if (!resUpdate.ok) {
          const errData = await resUpdate.json();
          console.error("Failed to update nurse record:", errData);
        } else {
          console.log("Nurse record updated successfully");
        }
      } else {
        // Record does not exist → create new
        const resCreate = await fetch("http://localhost:3000/nurse-records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            transcript: newVisit.transcript,
            height: newVisit.structuredData.height ? parseFloat(newVisit.structuredData.height) : null,
            weight: newVisit.structuredData.weight ? parseFloat(newVisit.structuredData.weight) : null,
            blood_pressure: newVisit.structuredData.bloodPressure, // as text
            heart_rate: newVisit.structuredData.heartRate ? parseInt(newVisit.structuredData.heartRate) : null,
            temperature: newVisit.structuredData.temperature ? parseFloat(newVisit.structuredData.temperature) : null,
            appointment: parseInt(id), // keep as string UUID if your DB uses UUIDs
            patient: currentPatient.id, 
            hcp: userId
          }),
        });

        if (!resCreate.ok) {
          const errData = await resCreate.json();
          console.error("Failed to create nurse record:", errData);
        } else {
          console.log("Nurse record created successfully");
        }
      }
    } catch (err) {
      console.error("Error saving nurse record:", err);
    }
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
            dialogueTranscript={dialogueTranscript}
            isFormattingDialogue={isFormattingDialogue}
          />
        </div>
        
        <div className="dashboard-section">
          <PatientDashboard visits={visits.filter(v => v.patientId === currentPatient.id)} />
          
        </div>
        <div className='trends-section'>
<PatientTrends visits={visits.filter(v => v.patientId === currentPatient.id)} />
        </div>
      </div>
    </div>
  )
}

export default HCPAppointment
