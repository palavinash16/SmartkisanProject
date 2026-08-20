import React, { useState } from 'react';
import { STATES_AND_DISTRICTS } from '../data/mockData';
import LandUnitInput from './LandUnitInput';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../utils/translations';
import { User, MapPin, Sprout, Globe, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export const DEFAULT_DEMO_PROFILE = {
  name: 'Ram Singh (राम सिंह)',
  language: 'hi',
  state: 'Uttar Pradesh',
  district: 'Ghaziabad',
  village: 'Chauri Chaura',
  landAcres: 2.0,
  soilType: 'Alluvial',
  irrigation: 'Tube well',
  farmerCategory: 'SMALL',
  previousCrop: 'Wheat',
  nextCrop: 'Paddy'
};

export default function FarmerProfileSetup({ farmerProfile, onSaveProfile, onClose }) {
  const { lang, setLang, t } = useLanguage();
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
    }, 1200);
  };

  return (
    <div className="glass-card" style={{ maxWidth: '750px', margin: '0 auto', padding: '1.5rem', background: '#ffffff', border: '1px solid #cbd5e1', boxShadow: 'var(--shadow-md)' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
        <div>
          <span className="badge badge-success" style={{ marginBottom: '0.25rem' }}>Kisan Profile Setup</span>
          <h2 style={{ fontSize: '1.35rem', color: '#0f172a', margin: 0 }}>किसान प्रोफाइल और खेत विवरण</h2>
          <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>अपनी भाषा, राज्य और खेत की सिंचाई सुविधा चुनें।</p>
        </div>
        <div style={{ background: '#ecfdf5', padding: '0.65rem', borderRadius: '12px', color: '#059669' }}>
          <User size={24} />
        </div>
      </div>

      {isSaved ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#16a34a' }}>
            <Check size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>प्रोफाइल सफलतापूर्वक सेव हो गई!</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>आपकी जानकारी अपडेट कर दी गई है...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            
            {/* Language Choice */}
            <div className="form-group">
              <label className="form-label">{t('select_language')}:</label>
              <select 
                className="form-select"
                value={formData.language}
                onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Farmer Name */}
            <div className="form-group">
              <label className="form-label">किसान का नाम (Farmer Name):</label>
              <input 
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            
            {/* State */}
            <div className="form-group">
              <label className="form-label">राज्य (State):</label>
              <select 
                className="form-select"
                value={formData.state}
                onChange={(e) => {
                  const st = e.target.value;
                  const dists = STATES_AND_DISTRICTS[st] || [];
                  setFormData((prev) => ({ ...prev, state: st, district: dists[0] || '' }));
                }}
              >
                {Object.keys(STATES_AND_DISTRICTS).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="form-group">
              <label className="form-label">जिला (District):</label>
              <select 
                className="form-select"
                value={formData.district}
                onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
              >
                {districtsList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            
            {/* Irrigation */}
            <div className="form-group">
              <label className="form-label">{t('irrigation_facility')}:</label>
              <select 
                className="form-select"
                value={formData.irrigation}
                onChange={(e) => setFormData((prev) => ({ ...prev, irrigation: e.target.value }))}
              >
                <option value="Tube well">Tube well (ट्यूबवेल)</option>
                <option value="Borewell">Borewell (बोरवेल)</option>
                <option value="Canal">Canal (नहर)</option>
                <option value="Drip">Drip (ड्रिप सिंचाई)</option>
                <option value="Rainfed">Rainfed (वर्षा आधारित)</option>
              </select>
            </div>

            {/* Previous Crop */}
            <div className="form-group">
              <label className="form-label">{t('previous_crop')}:</label>
              <input 
                type="text"
                className="form-input"
                value={formData.previousCrop}
                onChange={(e) => setFormData((prev) => ({ ...prev, previousCrop: e.target.value }))}
              />
            </div>
          </div>

          <LandUnitInput 
            state={formData.state}
            valueAcres={formData.landAcres}
            onChangeAcres={(acres) => setFormData((prev) => ({ ...prev, landAcres: acres }))}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            {onClose && (
              <button type="button" onClick={onClose} className="btn btn-outline">
                {t('close')}
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>{t('save')} Profile</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}