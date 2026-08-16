import React, { useState, useEffect } from 'react';
import { 
  MANDI_PRICES_DETAILED, 
  DISTRICT_WEATHER_DATA,
  MANDI_PRICES
} from '../data/mockData';
import { 
  Sprout, 
  TrendingUp, 
  Mic, 
  FileText, 
  CloudSun, 
  Scan, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2,
  Cpu,
  BarChart3,
  Sparkles,
  Store,
  Clock,
  MapPin,
  User,
  Layers,
  Thermometer,
  Droplets,
  Wind,
  Edit3
} from 'lucide-react';

export default function DashboardOverview({ setActiveTab, farmerProfile, onEditProfile }) {
  // Live Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeDistrict = farmerProfile?.district || 'Karnal';
  const activeState = farmerProfile?.state || 'Haryana';
  const activeFarmerName = farmerProfile?.farmerName || 'Ramesh Kumar';

  // Weather for active district
  const localWeather = DISTRICT_WEATHER_DATA[activeDistrict] || DISTRICT_WEATHER_DATA['Khanna'];
  const localAdvisory = localWeather.advisories[0] || {
    headline: "⚠️ SKIP CHEMICAL SPRAY TODAY",
    action: "High humidity and rain probability detected in your location.",
    reason: "Precipitation risk over 75%."
  };

  // Filter Mandi rates for active state/district
  const localMandiPrices = MANDI_PRICES_DETAILED.filter(
    m => m.state === activeState || m.district === activeDistrict
  );
  const displayMandiPrices = localMandiPrices.length > 0 ? localMandiPrices.slice(0, 4) : MANDI_PRICES_DETAILED.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Real-Time Live Clock & Location Status Bar */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.5rem', background: 'linear-gradient(135deg, rgba(6,20,13,0.95) 0%, rgba(4,18,10,0.95) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#2dd4bf', fontWeight: 700, fontSize: '0.9rem' }}>
          <Clock size={18} className="pulse-active" />
          <span>LIVE TIME: {currentTime.toLocaleTimeString()} IST</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.4rem' }}>
            ({currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#ffffff', background: 'rgba(16, 185, 129, 0.15)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <MapPin size={14} color="#34d399" />
            <span>Farm Location: <strong>{activeDistrict}, {activeState}</strong></span>
          </div>

          <button 
            className="btn btn-outline" 
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
            onClick={onEditProfile}
          >
            <Edit3 size={14} /> Update Location / Profile
          </button>
        </div>
      </div>

      {/* Systematic 3-Step Farmer Onboarding Card */}
      <div className="glass-panel" style={{ padding: '1.75rem 2rem', background: 'linear-gradient(135deg, rgba(10,33,19,0.95) 0%, rgba(6,20,13,0.98) 100%)', border: '1px solid rgba(45, 212, 191, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <Sparkles size={14} /> Systematic Farmer Decision Intelligence System
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>
              Welcome back, <span style={{ background: 'linear-gradient(135deg, #34d399 0%, #2dd4bf 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{activeFarmerName}</span>! 🌾
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '750px' }}>
              Your field profile (<strong>{farmerProfile?.landAcres || '3.5'} Acres</strong> of <strong>{farmerProfile?.soilType || 'Alluvial'} Soil</strong> in {activeDistrict}) is active. Below is your live weather, market prices, and tailored yield advisor.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '220px' }}>
            <div style={{ background: 'rgba(6, 20, 13, 0.8)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>FARM HEALTH INDEX</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'Outfit' }}>
                88 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ 100 (Optimal)</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.2rem' }}>
                ✓ Irrigation: Ready • Moisture: Good
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Stepper Ribbon */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(16, 185, 129, 0.12)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>1</div>
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block' }}>Step 1: User & Field Info</strong>
              <span style={{ fontSize: '0.75rem', color: '#34d399' }}>{farmerProfile?.district}, {farmerProfile?.state} ({farmerProfile?.landAcres} Acres)</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(20, 184, 166, 0.12)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2dd4bf', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>2</div>
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block' }}>Step 2: Real-Time Live Telemetry</strong>
              <span style={{ fontSize: '0.75rem', color: '#2dd4bf' }}>Local Weather & APMC Mandi Rates</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(245, 158, 11, 0.12)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fbbf24', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>3</div>
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block' }}>Step 3: Tailored AI Decision</strong>
              <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>Gap Crops & Profit Simulator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Live Local Telemetry Matrix (Real Weather & Real Mandi Rates) */}
      <div className="grid-cols-2">
        
        {/* Real-Time Localized Weather Card */}
        <div className="glass-card" style={{ borderLeft: '4px solid #34d399' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '10px', color: '#34d399' }}>
                <CloudSun size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Local Weather Telemetry</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Location: <strong>{activeDistrict} District</strong>
                </span>
              </div>
            </div>

            <button className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setActiveTab('weather-advisory')}>
              View 5-Day Matrix →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem', background: 'rgba(6, 20, 13, 0.7)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Temp</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit' }}>{localWeather.tempCurrent}</div>
              <span style={{ fontSize: '0.7rem', color: '#34d399' }}>{localWeather.condition}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Humidity</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'Outfit' }}>{localWeather.humidity}</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rain: {localWeather.rainProb}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Wind</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'Outfit' }}>{localWeather.wind}</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Soil: {localWeather.soilMoisture}</span>
            </div>
          </div>

          {/* Action Advisory Pill */}
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <strong style={{ color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertTriangle size={15} /> {localAdvisory.headline}
            </strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {localAdvisory.action}
            </p>
          </div>
        </div>

        {/* Real-Time Local Mandi Rates Card */}
        <div className="glass-card" style={{ borderLeft: '4px solid #fbbf24' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.5rem', borderRadius: '10px', color: '#fbbf24' }}>
                <Store size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Local APMC Mandi Rates</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Filtered for: <strong>{activeState} / {activeDistrict}</strong>
                </span>
              </div>
            </div>

            <button className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setActiveTab('mandi-prices')}>
              Search All Mandis →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {displayMandiPrices.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  background: 'rgba(6, 20, 13, 0.7)', 
                  padding: '0.6rem 0.85rem', 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid var(--border-color)' 
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>{item.cropEn} ({item.cropHi})</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.mandi}, {item.district}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
                    ₹{item.modalPrice} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/qnt</span>
                  </span>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    color: item.trend === 'up' ? '#4ade80' : item.trend === 'down' ? '#f87171' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.1rem'
                  }}>
                    {item.trend === 'up' && <ArrowUpRight size={13} />}
                    {item.trend === 'down' && <ArrowDownRight size={13} />}
                    {item.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Step 3: Platform Modules Grid */}
      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 color="var(--primary)" /> Step 3: Tailored AI Platform Modules
        </h2>

        <div className="grid-cols-3">
          
          {/* Module 1 */}
          <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('gap-crop')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.65rem', borderRadius: '12px', color: '#34d399' }}>
                <Sprout size={22} />
              </div>
              <span className="badge badge-success">Gap Crop Advisor</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Gap Crop Engine</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Recommend high-profit crops (Summer Moong, Zaid Maize, Cucumber) during 30-90 day land gaps customized for {farmerProfile?.soilType || 'Alluvial'} soil.
            </p>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>Explore Engine →</span>
          </div>

          {/* Module 2 */}
          <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('profit-predictor')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.65rem', borderRadius: '12px', color: '#fbbf24' }}>
                <TrendingUp size={22} />
              </div>
              <span className="badge badge-warning">Yield & Profit</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Profit Predictor Engine</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Pre-sowing multi-model simulator comparing XGBoost, LightGBM, and Random Forest pre-filled for {farmerProfile?.landAcres || '3.5'} acres.
            </p>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-gold)' }}>Calculate Profit →</span>
          </div>

          {/* Module 3 */}
          <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('voice-assistant')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.65rem', borderRadius: '12px', color: '#60a5fa' }}>
                <Mic size={22} />
              </div>
              <span className="badge badge-info">AI Voice Chat</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Multilingual Voice Assistant</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Speak directly in Hindi, Bhojpuri, Awadhi, Punjabi, Marathi, or Bengali with Gemini RAG voice assistance.
            </p>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#60a5fa' }}>Start Voice Chat →</span>
          </div>

          {/* Module 4 */}
          <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('scheme-finder')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.65rem', borderRadius: '12px', color: '#c084fc' }}>
                <FileText size={22} />
              </div>
              <span className="badge badge-info">Govt Subsidies</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Government Schemes (RAG)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Automated scheme eligibility search matching PM-KISAN, PMFBY, KCC, and SMAM subsidies for {farmerProfile?.state || 'Haryana'}.
            </p>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#c084fc' }}>Check Schemes →</span>
          </div>

          {/* Module 5 */}
          <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('disease-detector')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '0.65rem', borderRadius: '12px', color: '#f87171' }}>
                <Scan size={22} />
              </div>
              <span className="badge badge-danger">CV Diagnostic</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>AI Leaf Disease Scanner</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Computer vision diagnosis using EfficientNet-B4 CNN for leaf spot detection, organic remedies, and chemical sprays.
            </p>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f87171' }}>Scan Crop Leaf →</span>
          </div>

          {/* Module 6 */}
          <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('system-architecture')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(20, 184, 166, 0.15)', padding: '0.65rem', borderRadius: '12px', color: '#2dd4bf' }}>
                <Cpu size={22} />
              </div>
              <span className="badge badge-info">Tech Architecture</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>System Architecture & SRS</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Inspect PostgreSQL PostGIS SQL schemas, FastAPI OpenAPI specs, and EfficientNet-B4 CNN model specs.
            </p>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2dd4bf' }}>View System Specs →</span>
          </div>

        </div>
      </div>

    </div>
  );
}
