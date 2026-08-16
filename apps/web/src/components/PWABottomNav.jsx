import React from 'react';
import { Home, Sprout, Store, BookOpen, User, Sparkles } from 'lucide-react';

export default function PWABottomNav({ activeTab, setActiveTab, onOpenProfile }) {
  const items = [
    { id: 'home', label: 'होम', icon: Home },
    { id: 'my-field', label: 'मेरी खेती', icon: Sprout },
    { id: 'mandi-prices', label: 'बाज़ार', icon: Store },
    { id: 'gap-crop', label: 'सुझाव', icon: Sparkles, badge: 'गैप' },
    { id: 'crop-school', label: 'ज्ञान केंद्र', icon: BookOpen },
    { id: 'profile', label: 'प्रोफ़ाइल', icon: User },
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
                background: isActive ? '#dcfce7' : 'transparent',
                transition: 'all 0.2s ease'
              }}>
                <Icon size={20} color={isActive ? '#059669' : '#64748b'} />
                {item.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    background: '#059669',
                    color: '#ffffff',
                    fontSize: '0.55rem',
                    fontWeight: 800,
                    padding: '0.05rem 0.3rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>

              <span style={{
                fontSize: '0.7rem',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'Hind, Noto Sans Devanagari, sans-serif'
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
