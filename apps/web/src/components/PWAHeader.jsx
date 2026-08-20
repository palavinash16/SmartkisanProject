import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelectorModal from './LanguageSelectorModal';
import { LANGUAGE_REGISTRY } from '../utils/languageRegistry';
import { 
  MapPin, 
  Globe, 
  Bell, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Sprout, 
  ShieldCheck,
  Check
} from 'lucide-react';

export default function PWAHeader({ farmerProfile, onOpenProfile, onNavigate }) {
  const { lang, setLang, t, isFirstLaunch, dismissFirstLaunch } = useLanguage();
  const [showLangModal, setShowLangModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const activeState = farmerProfile?.state || 'Uttar Pradesh';
  const activeLangObj = LANGUAGE_REGISTRY.find((l) => l.code === lang) || LANGUAGE_REGISTRY[0];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '0.65rem 1rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: '#ffffff',
            padding: '0.45rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sprout size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', margin: 0, lineHeight: 1.1 }}>
              SmartKisan
            </h1>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
              {t('app_subtitle')}
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          
          {/* Location Badge Button */}
          <button 
            onClick={onOpenProfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '0.35rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <MapPin size={14} color="#16a34a" />
            <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {farmerProfile?.district || 'Ghaziabad'}, {activeState.slice(0, 2).toUpperCase()}
            </span>
          </button>

          {/* Multilingual Selector Trigger Button */}
          <button 
            onClick={() => setShowLangModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              padding: '0.35rem 0.6rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Globe size={15} color="#059669" />
            <span>{activeLangObj.nativeName.split(' ')[0]}</span>
            <ChevronDown size={13} color="#64748b" />
          </button>

          {/* Notifications Button */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                padding: '0.4rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <Bell size={17} />
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                background: '#dc2626',
                color: '#ffffff',
                fontSize: '0.625rem',
                fontWeight: 800,
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>1</span>
            </button>

            {/* Notification Popup */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '115%',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-md)',
                width: '260px',
                zIndex: 110,
                padding: '0.75rem'
              }}>
                <h4 style={{ fontSize: '0.85rem', color: '#0f172a', margin: '0 0 0.5rem 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  Notifications (सूचनाएं)
                </h4>
                <div style={{ fontSize: '0.78rem', color: '#334155', background: '#f8faf8', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  🌱 <strong>Zaid Moong Window:</strong> Sowing window active in {farmerProfile?.district || 'Ghaziabad'} for Summer Moong!
                </div>
              </div>
            )}
          </div>

          {/* Profile Trigger Button */}
          <button 
            onClick={onOpenProfile}
            style={{
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '0.4rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <User size={17} />
          </button>

        </div>
      </div>

      {/* Language Selector Modal */}
      {(showLangModal || isFirstLaunch) && (
        <LanguageSelectorModal 
          currentState={activeState}
          currentLang={lang}
          onSelectLanguage={(code) => {
            setLang(code);
            setShowLangModal(false);
          }}
          onClose={() => {
            setShowLangModal(false);
            if (isFirstLaunch) dismissFirstLaunch();
          }}
          isFirstLaunch={isFirstLaunch}
        />
      )}
    </header>
  );
}