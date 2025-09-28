import './App.css';

function App() {
  return (
    <div className="medical-app">
      {/* Header Section */}
      <header className="app-header">
        <h1>EchoHealth</h1>
        <p className="patient-info">
          Intelligent Healthcare Transcription & EMR Data Management
        </p>
      </header>

      {/* Main Content */}
      <main className="landing-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h2>Transform Voice to Structured Medical Records</h2>
            <p className="hero-description">
              Streamline your healthcare documentation process with AI-powered voice transcription 
              that automatically converts clinical conversations into structured EMR data.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h3>Key Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎤</div>
              <h4>Voice Recording</h4>
              <p>High-quality audio capture optimized for medical consultations and clinical notes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h4>AI Transcription</h4>
              <p>Advanced speech-to-text technology trained on medical terminology and contexts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h4>EMR Integration</h4>
              <p>Automatically structure transcripts into standardized electronic medical record formats.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Real-time Processing</h4>
              <p>Instant transcription and data extraction to keep pace with your workflow.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h4>HIPAA Compliant</h4>
              <p>Secure, encrypted processing that meets healthcare privacy and security standards.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Data Analytics</h4>
              <p>Generate insights and reports from your structured medical data.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <h3>How It Works</h3>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Record</h4>
                <p>Start recording your patient consultation or clinical notes using our intuitive interface.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Transcribe</h4>
                <p>Our AI automatically converts your speech to text with medical accuracy and context.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Structure</h4>
                <p>The system extracts and organizes relevant information into structured EMR fields.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Review & Save</h4>
                <p>Review the generated data, make any necessary edits, and save to your EMR system.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;