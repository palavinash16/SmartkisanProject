import React, { useState } from 'react';
import { STATES_AND_DISTRICTS } from '../data/mockData';
import LandUnitInput from './LandUnitInput';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../utils/translations';
import { User, MapPin, Sprout, Globe, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export const DEFAULT_DEMO_PROFILE = {
  name: 'राम सिंह पटेल (Ram Singh)',
  language: 'hi',
  state: 'Uttar Pradesh',
  district: 'Gorakhpur',
  village: 'चौरी चौरा (Chauri Chaura)',
  landAcres: 2.0,
  soilType: 'Alluvial',
  irrigation: 'Tube Well + Drip',
  farmerCategory: 'SMALL',
  primaryCrop: 'Wheat (गेहूं)'
};

export default function FarmerProfileSetup({ farmerProfile, onSaveProfile, onClose }) {
  const { lang, setLang } = useLanguage();
  const [formData, setFormData] = useState(farmerProfile || DEFAULT_DEMO_PROFILE);
  const [isSaved, setIsSaved] = useState(false);

  const districtsList = STATES_AND_DISTRICTS[formData.state] || STATES_AND_DISTRICTS['Uttar Pradesh'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    setLang(formData.language);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', background: '#0e2216', border: '1px solid rgba(34, 197, 94, 0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <div>
          <span className="badge badge-success" style={{ marginBottom: '0.35rem' }}>प्रोफाइल एवं भाषा सेटिंग</span>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>किसान प्रोफाइल एवं भाषा का चयन</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>अपनी भाषा चुनें ताकि पूरा ऐप आपकी स्थानीय भाषा में बदल जाए</p>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.65rem', borderRadius: '12px', color: '#34d399' }}>
          <User size={26} />
        </div>
      </div>

      {isSaved ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#4ade80' }}>
            <Check size={36} />
          </div>
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>प्रोफाइल सफलतापूर्वक सुरक्षित हो गई!</h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>ऐप आपकी चुनी गई भाषा में लोड हो रहा है...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Card 1: LANGUAGE SELECTION CARD */}
          <div style={{ background: 'rgba(6, 20, 13, 0.8)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#34d399', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} /> अपनी मनपसंद भाषा चुनें (Choose App Language)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {SUPPORTED_LANGUAGES.map((l) => {
                const isSelected = formData.language === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setFormData({ ...formData, language: l.code })}
                    style={{
                      background: isSelected ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.04)',
                      border: isSelected ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.1)',
                      color: isSelected ? '#ffffff' : '#e2e8f0',
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      fontSize: '0.9rem',
                      fontWeight: isSelected ? 700 : 500,
                      boxShadow: isSelected ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 2: Farmer Identity & Location */}
          <div style={{ background: 'rgba(6, 20, 13, 0.8)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--primary)" /> किसान पहचान व स्थान विवरण
            </h3>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">किसान का पूरा नाम:</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">गांव / कस्बा का नाम:</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">राज्य (State):</label>
                <select
                  className="form-select"
                  value={formData.state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    const defaultDist = STATES_AND_DISTRICTS[newState]?.[0] || 'Gorakhpur';
                    setFormData({ ...formData, state: newState, district: defaultDist });
                  }}
                >
                  {Object.keys(STATES_AND_DISTRICTS).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">जिला (District):</label>
                <select
                  className="form-select"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                >
                  {districtsList.map((dst) => (
                    <option key={dst} value={dst}>{dst}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Land & Soil Parameters */}
          <div style={{ background: 'rgba(6, 20, 13, 0.8)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sprout size={18} color="var(--accent-gold)" /> खेत एवं मिट्टी की जानकारी
            </h3>

            <div className="grid-cols-3">
              <div className="form-group">
                <LandUnitInput 
                  valueInAcres={formData.landAcres}
                  onChangeAcres={(acres) => setFormData({ ...formData, landAcres: acres })}
                  label="कुल कृषि योग्य भूमि:"
                />
              </div>

              <div className="form-group">
                <label className="form-label">मिट्टी का प्रकार (Soil Type):</label>
                <select
                  className="form-select"
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                >
                  <option value="Alluvial">जलोढ़ मिट्टी (Alluvial)</option>
                  <option value="Black Cotton">काली मिट्टी (Black Cotton)</option>
                  <option value="Loamy">दोमट मिट्टी (Loamy)</option>
                  <option value="Sandy Loam">बलुई दोमट (Sandy Loam)</option>
                  <option value="Clay-Loam">चिकनी दोमट (Clay-Loam)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">सिंचाई की व्यवस्था:</label>
                <select
                  className="form-select"
                  value={formData.irrigation}
                  onChange={(e) => setFormData({ ...formData, irrigation: e.target.value })}
                >
                  <option value="Tube Well + Drip">ट्यूबवेल + ड्रिप सिंचाई</option>
                  <option value="Canal Irrigated">नहर द्वारा सिंचाई</option>
                  <option value="Borewell Only">केवल बोरवेल</option>
                  <option value="Rainfed (Monsoon Dependent)">वर्षा आधारित (मानसून)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            {onClose && (
              <button type="button" className="btn btn-outline" onClick={onClose}>
                रद्द करें (Cancel)
              </button>
            )}
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
              सुरक्षित करें और ऐप खोलें <ArrowRight size={18} />
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
