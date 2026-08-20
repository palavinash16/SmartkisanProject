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
import { useLanguage } from '../context/LanguageContext';

export default function DashboardOverview({ setActiveTab, farmerProfile, onEditProfile }) {
  const { t } = useLanguage();
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
            <span>Location: <strong>{activeDistrict}, {activeState}</strong></span>
          </div>

          <button 
            className="btn btn-outline" 
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
            onClick={onEditProfile}
          >
            <Edit3 size={14} /> Update Profile
          </button>
        </div>
      </div>

      {/* Systematic 3-Step Farmer Onboarding Card */}
      <div className="glass-panel" style={{ padding: '1.75rem 2rem', background: 'linear-gradient(135deg, rgba(10,33,19,0.95) 0%, rgba(6,20,13,0.98) 100%)', border: '1px solid rgba(45, 212, 191, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <Sparkles size={14} /> Farmer Decision Intelligence System
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>
              {t('greeting')}, <span style={{ background: 'linear-gradient(135deg, #34d399 0%, #2dd4bf 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{activeFarmerName}</span>! 🌾
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '750px' }}>
              Your field profile (<strong>{farmerProfile?.landAcres || '3.5'} Acres</strong> of <strong>{farmerProfile?.soilType || 'Alluvial'} Soil</strong> in {activeDistrict}) is active.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '220px' }}>
            <div style={{ background: 'rgba(6, 20, 13, 0.8)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>FARM HEALTH INDEX</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'Outfit' }}>
                88 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ 100 (Optimal)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Step 2: Live Local Telemetry Matrix */}
      <div className="grid-cols-2">
        
        {/* Weather Card */}
        <div className="glass-card" style={{ borderLeft: '4px solid #34d399' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '10px', color: '#34d399' }}>
                <CloudSun size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>{t('nav_weather')}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Location: <strong>{activeDistrict} District</strong>
                </span>
              </div>
            </div>

            <button className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setActiveTab('weather-advisory')}>
              {t('view_full_weather')} →
            </button>
          </div>
        </div>

        {/* Mandi Rates Card */}
        <div className="glass-card" style={{ borderLeft: '4px solid #fbbf24' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.5rem', borderRadius: '10px', color: '#fbbf24' }}>
                <Store size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>{t('today_mandi_prices')}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Filtered for: <strong>{activeState} / {activeDistrict}</strong>
                </span>
              </div>
            </div>

            <button className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setActiveTab('mandi-prices')}>
              {t('view_all_mandi')} →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
