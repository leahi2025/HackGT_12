import { useState, useRef } from 'react'

const VoiceRecorder = ({ onAudioRecorded, isRecording, setIsRecording, currentRole, setCurrentRole }) => {
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioURL, setAudioURL] = useState('')
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioURL(audioUrl)
        onAudioRecorded(audioBlob)
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(timerRef.current)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleRoleChange = (role) => {
    if (!isRecording) {
      setCurrentRole(role)
    }
  }

  return (
    <div className="voice-recorder">
      <h2>Voice Recording</h2>
      
      <div className="role-toggle-container">
        <label className="role-toggle-label">Recording As:</label>
        <div className="role-toggle">
          <div 
            className={`role-option ${currentRole === 'nurse' ? 'active' : ''}`}
            onClick={() => handleRoleChange('nurse')}
          >
            Nurse
          </div>
          <div 
            className={`role-option ${currentRole === 'doctor' ? 'active' : ''}`}
            onClick={() => handleRoleChange('doctor')}
          >
            Doctor
          </div>
        </div>
        {isRecording && (
          <div className="role-indicator">
            <span className="role-icon">
              {currentRole === 'doctor' ? '👨‍⚕️' : '👩‍⚕️'}
            </span>
            Recording as {currentRole}
          </div>
        )}
      </div>
      
      <div className="recording-controls">
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`record-button ${isRecording ? 'recording' : ''}`}
        >
          <div className="record-icon">
            {isRecording ? '⏹️' : '🎙️'}
          </div>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        {isRecording && (
          <div className="recording-status">
            <div className="recording-indicator">🔴</div>
            <div className="recording-time">{formatTime(recordingTime)}</div>
          </div>
        )}
      </div>

      {audioURL && (
        <div className="audio-playback">
          <h3>Last Recording:</h3>
          <audio controls src={audioURL} />
        </div>
      )}
    </div>
  )
}

export default VoiceRecorder