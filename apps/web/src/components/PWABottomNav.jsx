import React from 'react';
import { Home, Sprout, Sparkles, Store, CloudSun, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PWABottomNav({ activeTab, setActiveTab, onOpenProfile }) {
  const { t } = useLanguage();

  const items = [
    { id: 'home', label: t('nav_home'), icon: Home },
    { id: 'my-field', label: t('nav_my_field'), icon: Sprout },
    { id: 'gap-crop', label: t('nav_gap_crop'), icon: Sparkles, badge: t('nav_active') },
    { id: 'mandi-prices', label: t('nav_mandi'), icon: Store },
    { id: 'weather-advisory', label: t('nav_weather'), icon: CloudSun },
    { id: 'profile', label: t('nav_profile'), icon: User },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      padding: '0.35rem 0.5rem'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
      }}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'profile' && activeTab === 'profile-setup');

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'profile') {
                  onOpenProfile();
                } else {
                  setActiveTab(item.id);
                }
              }}
              style={{
                position: 'relative',
                background: 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                color: isActive ? '#059669' : '#64748b',
                cursor: 'pointer',
                padding: '0.35rem 0.5rem',
                minWidth: '54px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isActive ? '#ecfdf5' : 'transparent',
                transition: 'all 0.2s ease'
              }}>
                <Icon size={19} color={isActive ? '#059669' : '#64748b'} />
                {item.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: '0.55rem',
                    fontWeight: 800,
                    padding: '0.05rem 0.3rem',
                    borderRadius: '9999px'
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>

              <span style={{
                fontSize: '0.725rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#059669' : '#475569'
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
