import React, { useState, useEffect } from 'react';
import PWAHeader from './components/PWAHeader';
import PWABottomNav from './components/PWABottomNav';
import PWAHome from './components/PWAHome';
import MyFieldIntegration from './components/MyFieldIntegration';
import GapCropEngine from './components/GapCropEngine';
import MandiPriceSearch from './components/MandiPriceSearch';
import WeatherAdvisory from './components/WeatherAdvisory';
import CropSchool from './components/CropSchool';
import DashboardOverview from './components/DashboardOverview';
import FarmerProfileSetup, { DEFAULT_DEMO_PROFILE } from './components/FarmerProfileSetup';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLang, setSelectedLang] = useState('hi');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Initialize farmer profile from localStorage or fallback to demo profile
  const [farmerProfile, setFarmerProfile] = useState(() => {
    const saved = localStorage.getItem('smartkisan_farmer_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_DEMO_PROFILE;
      }
    }
    return DEFAULT_DEMO_PROFILE;
  });

  const handleSaveProfile = (updatedProfile) => {
    setFarmerProfile(updatedProfile);
    localStorage.setItem('smartkisan_farmer_profile', JSON.stringify(updatedProfile));
    if (updatedProfile.language) {
      setSelectedLang(updatedProfile.language);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#06140d',
      color: 'var(--text-main)',
      fontFamily: 'Hind, Noto Sans Devanagari, sans-serif'
    }}>
      
      {/* Sticky PWA Top Header */}
      <PWAHeader 
        farmerProfile={farmerProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {/* Main Page Body Container */}
      <main style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '1rem',
        boxSizing: 'border-box'
      }}>
        {activeTab === 'profile-setup' ? (
          <FarmerProfileSetup 
            farmerProfile={farmerProfile}
            onSaveProfile={handleSaveProfile}
            onClose={() => setActiveTab('home')}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <PWAHome 
                farmerProfile={farmerProfile}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'my-field' && (
              <MyFieldIntegration 
                farmerProfile={farmerProfile}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'gap-crop' && (
              <GapCropEngine 
                farmerProfile={farmerProfile}
              />
            )}
            {activeTab === 'mandi-prices' && (
              <MandiPriceSearch 
                farmerProfile={farmerProfile}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'weather-advisory' && (
              <WeatherAdvisory 
                farmerProfile={farmerProfile}
              />
            )}
            {activeTab === 'crop-school' && (
              <CropSchool />
            )}
            {activeTab === 'dashboard' && (
              <DashboardOverview 
                setActiveTab={setActiveTab}
                farmerProfile={farmerProfile}
                onEditProfile={() => setShowProfileModal(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Persistent Profile Edit Modal */}
      {showProfileModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <FarmerProfileSetup 
              farmerProfile={farmerProfile}
              onSaveProfile={handleSaveProfile}
              onClose={() => setShowProfileModal(false)}
            />
          </div>
        </div>
      )}

      {/* Fixed PWA Bottom Navigation Bar */}
      <PWABottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setShowProfileModal(true)}
      />

    </div>
  );
}
