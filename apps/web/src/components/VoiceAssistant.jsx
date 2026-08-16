import React, { useState, useEffect, useRef } from 'react';
import { VOICE_SAMPLE_QUERIES } from '../data/mockData';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Globe, 
  Sparkles, 
  Send, 
  Play, 
  Square,
  Bot, 
  User, 
  Cpu, 
  Settings2,
  RefreshCw,
  MessageSquare
} from 'lucide-react';

const FREE_AI_MODELS = [
  { id: 'gemini-1.5-flash', name: 'Google Gemini 1.5 Flash (Free Agritech RAG)', provider: 'Google DeepMind', badge: 'Recommended' },
  { id: 'llama-3-70b', name: 'Meta Llama 3 70B (Agronomist Fine-Tuned)', provider: 'Meta AI', badge: 'High Accuracy' },
  { id: 'mistral-7b', name: 'Mistral 7B Agro-Advisor (Low Latency)', provider: 'Mistral AI', badge: 'Fastest' }
];

export default function VoiceAssistant({ selectedLang, setSelectedLang, farmerProfile }) {
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [autoVoiceover, setAutoVoiceover] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Chat message history initialized with sample query
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: VOICE_SAMPLE_QUERIES[0].query,
      translated: VOICE_SAMPLE_QUERIES[0].translated,
      lang: VOICE_SAMPLE_QUERIES[0].language,
      time: '03:45 AM'
    },
    {
      id: 2,
      sender: 'ai',
      text: VOICE_SAMPLE_QUERIES[0].answer,
      model: 'Google Gemini 1.5 Flash',
      time: '03:45 AM'
    }
  ]);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Web Speech Recognition if available in browser
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang === 'hi' || selectedLang === 'bho' || selectedLang === 'awa' ? 'hi-IN' : selectedLang === 'pa' ? 'pa-IN' : selectedLang === 'bn' ? 'bn-IN' : selectedLang === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcriptText = Array.from(event.results)
          .map(res => res[0].transcript)
          .join('');
        setInputText(transcriptText);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [selectedLang]);

  // Toggle Microphone Listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser window. You can type your question in the text box below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Play Text-to-Speech Voiceover
  const playVoiceover = (text, msgId) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech voiceover is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    if (speakingMsgId === msgId && isPlayingAudio) {
      setIsPlayingAudio(false);
      setSpeakingMsgId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang === 'hi' || selectedLang === 'bho' || selectedLang === 'awa' ? 'hi-IN' : selectedLang === 'pa' ? 'pa-IN' : selectedLang === 'bn' ? 'bn-IN' : selectedLang === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setSpeakingMsgId(msgId);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setSpeakingMsgId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Send message to AI Model
  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const newMsgId = Date.now();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage = {
      id: newMsgId,
      sender: 'user',
      text: query,
      time: nowTime
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Generate intelligent agronomic response based on query & farmerProfile context
    setTimeout(() => {
      const activeModelObj = FREE_AI_MODELS.find(m => m.id === selectedModel);
      let aiText = `आपकी समस्या के लिए सलाह (${farmerProfile?.district || 'Karnal'} क्षेत्र के लिए): `;
      
      const qLower = query.toLowerCase();
      if (qLower.includes('गेहूं') || qLower.includes('wheat')) {
        aiText = `गेहूं की फसल कटाई के बाद आप समर मूंग या ज़ैद मक्का लगा सकते हैं। ${farmerProfile?.district || 'Karnal'} में जलोढ़ मिट्टी (Alluvial soil) के लिए मूंग में ₹45,000 प्रति एकड़ का शुद्ध लाभ अनुमानित है।`;
      } else if (qLower.includes('रोग') || qLower.includes('disease') || qLower.includes('दवा') || qLower.includes('spray')) {
        aiText = `आज आपके इलाके (${farmerProfile?.district || 'Karnal'}) में आर्द्रता 82% और वर्षा की 75% संभावना है। कीटनाशक या फफूंदनाशक का छिड़काव आज न करें। अगले 24 घंटे के बाद ही बायो-फंगीसाइड ट्राइकोडरमा विरिडी का उपयोग करें।`;
      } else if (qLower.includes('योजना') || qLower.includes('scheme') || qLower.includes('पैसा')) {
        aiText = `आपके ${farmerProfile?.landAcres || '3.5'} एकड़ खेत के लिए PM-KISAN (₹6,000 वार्षिक) और Kisan Credit Card (4% ब्याज दर पर ₹3 लाख ऋण) योजनाएं 100% उपयुक्त हैं।`;
      } else {
        aiText = `SmartKisan AI Model (${activeModelObj?.name}): आपके ${farmerProfile?.landAcres || '3.5'} एकड़ खेत (${farmerProfile?.district || 'Karnal'}, ${farmerProfile?.state || 'Haryana'}) के लिए मिट्टी परीक्षण और संतुलित NPK (4:2:1) उर्वरक प्रयोग की सलाह दी जाती है।`;
      }

      const aiMsgId = newMsgId + 1;
      const aiMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: aiText,
        model: activeModelObj?.name || 'Google Gemini 1.5 Flash',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);

      if (autoVoiceover) {
        playVoiceover(aiText, aiMsgId);
      }
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Module Title Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', background: 'linear-gradient(135deg, rgba(14,34,22,0.95) 0%, rgba(6,20,13,0.95) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.65rem', borderRadius: '12px', color: '#60a5fa' }}>
              <Mic size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>Module 3: Advanced AI Voice & Chat Assistant 🎙️</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Multi-dialect Speech-to-Text (STT) + Free LLM Reasoning + Natural Text-to-Speech (TTS) Voiceover.
              </p>
            </div>
          </div>

          {/* Auto-Voiceover Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(6, 20, 13, 0.8)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <Volume2 size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Auto Voiceover:</span>
            <button 
              className={`btn ${autoVoiceover ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
              onClick={() => setAutoVoiceover(!autoVoiceover)}
            >
              {autoVoiceover ? 'ENABLED 🔊' : 'MUTED 🔇'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Model Config & Conversation Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 2fr', gap: '1.5rem' }}>
        
        {/* Left Side: Model Selector & Sample Prompts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* AI Model Selector Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-bright)' }}>
              <Cpu size={18} /> Free AI Model Engine
            </h3>

            <div className="form-group">
              <label className="form-label">Select Active AI Architecture</label>
              <select 
                className="form-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {FREE_AI_MODELS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ background: 'rgba(6, 20, 13, 0.7)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
              <div style={{ color: 'var(--text-muted)' }}>Registered Farm Context:</div>
              <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{farmerProfile?.farmerName} ({farmerProfile?.district}, {farmerProfile?.state})</strong>
              <div style={{ color: 'var(--primary)', marginTop: '0.2rem' }}>{farmerProfile?.landAcres} Acres • {farmerProfile?.soilType} Soil</div>
            </div>
          </div>

          {/* Sample Dialect Voice Prompts */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} color="#2dd4bf" /> Sample Native Queries
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {VOICE_SAMPLE_QUERIES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sample.query)}
                  className="btn btn-outline"
                  style={{
                    justifyContent: 'flex-start',
                    fontSize: '0.8rem',
                    padding: '0.5rem 0.75rem',
                    textAlign: 'left',
                    whiteSpace: 'normal'
                  }}
                >
                  <div>
                    <span style={{ color: '#fbbf24', fontWeight: 700, display: 'block', fontSize: '0.75rem' }}>{sample.language}:</span>
                    <span>"{sample.query}"</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Interactive AI Multi-Turn Chat Console */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '620px', padding: '1.25rem' }}>
          
          {/* Chat Messages Container */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  {msg.sender === 'user' ? (
                    <><span>{farmerProfile?.farmerName || 'Farmer'}</span> <User size={13} color="var(--primary)" /></>
                  ) : (
                    <><Bot size={13} color="#2dd4bf" /> <span>{msg.model}</span></>
                  )}
                  <span>• {msg.time}</span>
                </div>

                <div 
                  style={{ 
                    maxWidth: '85%', 
                    padding: '1rem 1.25rem', 
                    borderRadius: 'var(--radius-md)', 
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.3) 100%)' : 'rgba(10, 33, 19, 0.9)',
                    border: msg.sender === 'user' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                    color: '#ffffff',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <p style={{ fontSize: '0.975rem', lineHeight: 1.5 }}>{msg.text}</p>
                  
                  {msg.translated && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                      Translation: {msg.translated}
                    </p>
                  )}

                  {/* Play Voiceover Action Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button 
                      className="btn btn-outline"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderColor: speakingMsgId === msg.id ? '#fbbf24' : 'var(--border-color)' }}
                      onClick={() => playVoiceover(msg.text, msg.id)}
                    >
                      {speakingMsgId === msg.id && isPlayingAudio ? (
                        <><Square size={12} color="#fbbf24" /> Stop Voiceover</>
                      ) : (
                        <><Play size={12} color="var(--primary)" /> Listen Voiceover (TTS)</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Interactive Mic + Text Input Footer Bar */}
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            
            {/* Live Mic Button */}
            <button 
              className={`btn ${isListening ? 'btn-gold' : 'btn-primary'}`}
              style={{ padding: '0.75rem', borderRadius: '50%', width: '48px', height: '48px', flexShrink: 0 }}
              onClick={toggleListening}
              title={isListening ? "Listening... Click to stop" : "Click to speak voice input"}
            >
              {isListening ? <MicOff size={22} className="pulse-active" /> : <Mic size={22} />}
            </button>

            {/* Input Text Box */}
            <input 
              type="text" 
              className="form-input" 
              placeholder={isListening ? "Listening to your voice stream..." : "Ask AI Agronomist in Hindi, Punjabi, Bengali, English..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{ flex: 1, padding: '0.75rem 1rem' }}
            />

            {/* Send Button */}
            <button 
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.25rem' }}
              onClick={() => handleSendMessage()}
            >
              <Send size={18} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
