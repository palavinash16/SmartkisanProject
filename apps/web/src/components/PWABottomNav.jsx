import React from 'react';
import { Home, Sprout, Mic, FileText, User, Sparkles } from 'lucide-react';

export default function PWABottomNav({ activeTab, setActiveTab, onOpenProfile }) {
  const items = [
    { id: 'home', label: 'होम', icon: Home },
    { id: 'my-field', label: 'मेरा खेत', icon: Sprout },
    { id: 'gap-crop', label: 'जायद फसल', icon: Sparkles, badge: 'लाभदायी' },
    { id: 'voice-assistant', label: 'किसान वाणी', icon: Mic },
    { id: 'scheme-finder', label: 'योजना मित्र', icon: FileText },
    { id: 'profile', label: 'प्रोफाइल', icon: User },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: '#0e2216',
      borderTop: '1px solid rgba(34, 197, 94, 0.2)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.35)',
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
                color: isActive ? '#34d399' : '#94a3b8',
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
                background: isActive ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                transition: 'all 0.2s ease'
              }}>
                <Icon size={20} color={isActive ? '#34d399' : '#94a3b8'} />
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
                color: isActive ? '#34d399' : '#cbd5e1'
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
