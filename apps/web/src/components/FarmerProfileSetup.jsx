import React, { useState } from 'react';
import { STATES_AND_DISTRICTS } from '../data/mockData';
import LandUnitInput from './LandUnitInput';
import { 
  User, 
  MapPin, 
  Sprout, 
  Droplets, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  Globe, 
  ArrowRight,
  Zap
} from 'lucide-react';

export const DEFAULT_DEMO_PROFILE = {
  farmerName: "Ramesh Kumar Patel",
  phoneNumber: "9876543210",
  language: "hi",
  state: "Haryana",
  district: "Karnal",
  village: "Nilokheri",
  landAcres: "3.5",
  soilType: "Alluvial",
  irrigation: "Tube Well + Drip",
  currentHarvest: "Wheat (Harvested April)",
  isProfileComplete: true
};

export default function FarmerProfileSetup({ farmerProfile, onSaveProfile, onClose }) {
  const [formData, setFormData] = useState(farmerProfile || DEFAULT_DEMO_PROFILE);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const availableDistricts = STATES_AND_DISTRICTS[formData.state] || [];

  const handleStateChange = (state) => {
    const districts = STATES_AND_DISTRICTS[state] || [];
    setFormData({
      ...formData,
      state,
      district: districts[0] || ''
    });
  };

  const handleQuickDemoLoad = () => {
    setFormData(DEFAULT_DEMO_PROFILE);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...formData,
      isProfileComplete: true
    };
    onSaveProfile(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(6, 20, 13, 0.95) 0%, rgba(4, 18, 10, 0.98) 100%)', maxWidth: '850px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(20, 184, 166, 0.15)', color: '#2dd4bf', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
            <Sparkles size={14} /> Step 1: Farmer & Field Profile Setup
          </div>
          <h2 style={{ fontSize: '1.6rem' }}>Configure Farmer & Land Details 🌾</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Systematically customizes weather warnings, Mandi prices, and crop yield simulations for your exact farm.
          </p>
        </div>

        <button 
          type="button"
          className="btn btn-gold" 
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
          onClick={handleQuickDemoLoad}
        >
          <Zap size={15} /> Load Demo Farmer Profile
        </button>
      </div>

      {savedSuccess ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <CheckCircle2 size={56} color="#34d399" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Profile Saved & Synchronized!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Your dashboard, weather alerts, and yield estimators are now tailored for <strong>{formData.farmerName}</strong> in <strong>{formData.district}, {formData.state}</strong>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: Farmer Personal Details */}
          <div style={{ background: 'rgba(10, 33, 19, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary-bright)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> Section A: Farmer User Information
            </h3>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Full Name (किसान का नाम)</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh Kumar Patel"
                  value={formData.farmerName}
                  onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number (मोबाइल नंबर)</label>
                <input 
                  type="tel"
                  className="form-input"
                  placeholder="10-digit mobile number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Dialect / Language</label>
                <select
                  className="form-select"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="bho">भोजपुरी (Bhojpuri)</option>
                  <option value="awa">अवधी (Awadhi)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Location Details */}
          <div style={{ background: 'rgba(10, 33, 19, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} /> Section B: Location & Mandi Region
            </h3>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">State (राज्य)</label>
                <select
                  className="form-select"
                  value={formData.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                >
                  {Object.keys(STATES_AND_DISTRICTS).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">District (ज़िला)</label>
                <select
                  className="form-select"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                >
                  {availableDistricts.map(dst => (
                    <option key={dst} value={dst}>{dst}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Village / Tehsil (गाँव / तहसील)</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. Nilokheri"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Field & Soil Info */}
          <div style={{ background: 'rgba(10, 33, 19, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sprout size={18} /> Section C: Field & Agronomic Parameters
            </h3>

            <div className="grid-cols-3">
              <div className="form-group">
                <LandUnitInput 
                  valueInAcres={formData.landAcres}
                  onChangeAcres={(acres) => setFormData({ ...formData, landAcres: acres })}
                  label="Total Land Area (क्षेत्रफल)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Soil Type (मिट्टी का प्रकार)</label>
                <select
                  className="form-select"
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                >
                  <option value="Alluvial">Alluvial Soil (जलोढ़ मिट्टी)</option>
                  <option value="Black Cotton">Black Cotton Soil (काली मिट्टी)</option>
                  <option value="Loamy">Loamy Soil (दोमट मिट्टी)</option>
                  <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
                  <option value="Clay-Loam">Clay-Loam Soil (चिकनी दोमट)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Irrigation Facility (सिंचाई सुविधा)</label>
                <select
                  className="form-select"
                  value={formData.irrigation}
                  onChange={(e) => setFormData({ ...formData, irrigation: e.target.value })}
                >
                  <option value="Tube Well + Drip">Tube Well + Drip Irrigation</option>
                  <option value="Canal Irrigated">Canal Water (नहर)</option>
                  <option value="Borewell Only">Borewell Only</option>
                  <option value="Rainfed (Monsoon Dependent)">Rainfed (वर्षा आधारित)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            {onClose && (
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
              Save Profile & Launch Application <ArrowRight size={18} />
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
