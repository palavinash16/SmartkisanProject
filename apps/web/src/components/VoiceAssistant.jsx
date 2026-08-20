import React, { useState } from 'react';
import { VOICE_SAMPLE_QUERIES } from '../data/mockData';
import { Mic, MicOff, Volume2, Globe, Sparkles, MessageSquare, Play, RefreshCw, Radio } from 'lucide-react';

export default function VoiceAssistant({ selectedLang, setSelectedLang }) {
  const [isRecording, setIsRecording] = useState(false);
  const [activeQuery, setActiveQuery] = useState(VOICE_SAMPLE_QUERIES[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [transcript, setTranscript] = useState(VOICE_SAMPLE_QUERIES[0].query);
  const [aiResponse, setAiResponse] = useState(VOICE_SAMPLE_QUERIES[0].answer);

  const handleSelectSample = (sample) => {
    setActiveQuery(sample);
    setTranscript(sample.query);
    setAiResponse(sample.answer);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const playVoiceResponse = () => {
    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      utterance.lang = activeQuery.code === 'hi' || activeQuery.code === 'bho' || activeQuery.code === 'awa' ? 'hi-IN' : activeQuery.code === 'pa' ? 'pa-IN' : activeQuery.code === 'bn' ? 'bn-IN' : 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 4000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', background: 'linear-gradient(135deg, rgba(14,34,22,0.95) 0%, rgba(6,20,13,0.95) 100%)', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.65rem', borderRadius: '14px', color: '#60a5fa', boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}>
            <Radio size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>Kisan Vani AI Voice Agronomist</h2>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>किसान वाणी एआई सलाहकार</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Hands-free regional voice intelligence supporting Hindi, Bhojpuri, Awadhi, Punjabi, Marathi, and Bengali.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem' }}>
        
        {/* Voice Recorder Controls */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Bhashini + Whisper STT Engine</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Tap the microphone and ask your farming question in your native dialect</p>
          </div>

          {/* Interactive Mic Button */}
          <div 
            onClick={toggleRecording}
            style={{ 
              width: '110px', 
              height: '110px', 
              borderRadius: '50%', 
              background: isRecording ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: isRecording ? '0 0 35px rgba(239, 68, 68, 0.6)' : '0 0 25px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.3s ease',
              marginBottom: '1.5rem'
            }}
          >
            {isRecording ? <MicOff size={44} color="#ffffff" /> : <Mic size={44} color="#ffffff" />}
          </div>

          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: isRecording ? '#f87171' : '#34d399' }}>
            {isRecording ? 'Listening to voice stream (Speak now...)' : 'Click to Speak (किसान बोलें)'}
          </span>

          {/* Regional Sample Prompts */}
          <div style={{ width: '100%', marginTop: '2rem', textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
              Sample Dialect Voice Prompts:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {VOICE_SAMPLE_QUERIES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="btn btn-outline"
                  style={{
                    justifyContent: 'flex-start',
                    fontSize: '0.825rem',
                    padding: '0.5rem 0.75rem',
                    borderColor: activeQuery.language === sample.language ? 'var(--primary)' : 'var(--border-color)',
                    background: activeQuery.language === sample.language ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                  }}
                >
                  <Globe size={14} color="var(--primary)" />
                  <span><strong>{sample.language}:</strong> "{sample.query.substring(0, 35)}..."</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* AI Voice Output Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.15rem' }}>Kisan Vani AI Agronomist Response</h3>
              </div>
              <span className="badge badge-success">Gemini 1.5 RAG Active</span>
            </div>

            {/* Farmer Voice Query */}
            <div style={{ background: 'rgba(6, 20, 13, 0.8)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                Farmer Audio Input ({activeQuery.language}):
              </span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>"{transcript}"</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                English Translation: {activeQuery.translated}
              </p>
            </div>

            {/* AI Response Card */}
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                  SmartKisan Decision Advisory
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Latency: 1.4s</span>
              </div>
              <p style={{ fontSize: '1.1rem', color: '#ffffff', lineHeight: 1.6 }}>{aiResponse}</p>
            </div>
          </div>

          {/* Audio Synthesizer Controls */}
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', background: 'rgba(6, 20, 13, 0.9)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button className="btn btn-gold" onClick={playVoiceResponse} disabled={isPlayingAudio}>
                {isPlayingAudio ? <RefreshCw size={18} className="pulse-active" /> : <Play size={18} />}
                <span>{isPlayingAudio ? 'Speaking Audio...' : 'Listen Audio Response (TTS)'}</span>
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Coqui / ElevenLabs Dialect Voice Synthesis</span>
            </div>
            
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[30, 60, 40, 80, 50, 90, 45, 70, 30].map((h, i) => (
                <div key={i} style={{ width: '3px', height: isPlayingAudio ? ${h}% : '8px', background: 'var(--primary)', borderRadius: '2px', transition: 'height 0.2s ease' }} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
