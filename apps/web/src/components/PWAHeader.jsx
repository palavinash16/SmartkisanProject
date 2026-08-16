import React, { useState } from 'react';
import { Menu, Bell, MapPin, ChevronDown, Sprout, Globe, X } from 'lucide-react';

export default function PWAHeader({ 
  farmerProfile, 
  activeTab, 
  setActiveTab, 
  selectedLang, 
  setSelectedLang, 
  onOpenProfile 
}) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const notifications = [
    { title: 'हीट वेव अलर्ट', desc: 'अगले 2 दिनों तक तापमान अधिक रहेगा। सिंचाई बढ़ाएं।', time: '10 मिनट पहले', icon: '☀️' },
    { title: 'सरकारी योजना 14वीं किस्‍त', desc: 'पीएम किसान सम्मान निधि की 14वीं किस्‍त आपके खाते में जमा हो गई है।', time: '2 घंटे पहले', icon: '📢' },
    { title: 'मंडी भाव अपडेट', desc: 'हापुड़ एपीएमसी में मूंग के दाम में ₹250/क्विंटल की तेजी देखी गई।', time: 'आज सुबह 07:30', icon: '📈' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
    }}>
      {/* Primary Header Row */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem'
      }}>
        
        {/* Left Side: Hamburger Menu & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => setShowDrawer(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.25rem'
            }}
          >
            <Menu size={24} />
          </button>

          <div 
            onClick={() => setActiveTab('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#dcfce7',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sprout size={22} color="#059669" />
            </div>

            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#059669', lineHeight: 1.1 }}>
                SmartKisan
              </div>
              <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 700, letterSpacing: '-0.01em' }}>
                स्मार्ट किसान, समृद्ध किसान
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Notification Bell & Language Selector Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          
          {/* Notifications Button */}
          <button 
            onClick={() => setShowNotificationModal(true)}
            style={{
              position: 'relative',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0f172a'
            }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ffffff'
            }}>
              3
            </span>
          </button>

          {/* Language Selector Pill */}
          <div style={{
            background: '#047857',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.75rem',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
          onClick={() => {
            const nextLang = selectedLang === 'hi' ? 'en' : 'hi';
            setSelectedLang(nextLang);
          }}
          >
            <span>{selectedLang === 'hi' ? 'HI' : 'EN'}</span>
          </div>

        </div>

      </div>

      {/* Secondary Row: Active Location Bar */}
      <div style={{
        background: '#f8faf8',
        borderTop: '1px solid #f1f5f9',
        padding: '0.35rem 1rem',
        fontSize: '0.825rem',
        color: '#475569'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button 
            onClick={onOpenProfile}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0f172a',
              fontSize: '0.825rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <MapPin size={15} color="#059669" />
            <span>{farmerProfile?.village || 'गाज़ियाबाद'}, {farmerProfile?.district || 'गाज़ियाबाद'} ({farmerProfile?.state || 'उत्तर प्रदेश'})</span>
            <ChevronDown size={14} color="#64748b" />
          </button>
        </div>
      </div>

      {/* Drawer Menu */}
      {showDrawer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex'
        }}>
          <div style={{
            width: '280px',
            background: '#ffffff',
            height: '100%',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>SmartKisan Menu</div>
              <button onClick={() => setShowDrawer(false)} style={{ background: 'transparent', border: 'none', color: '#0f172a' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { setActiveTab('home'); setShowDrawer(false); }}>🏠 होम (Home)</button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { setActiveTab('my-field'); setShowDrawer(false); }}>🌾 मेरी खेती (My Field)</button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { setActiveTab('mandi-prices'); setShowDrawer(false); }}>🛒 बाज़ार मंडी (Mandi)</button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { setActiveTab('gap-crop'); setShowDrawer(false); }}>🌿 गैप फसल सुझाव (Gap Engine)</button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { setActiveTab('weather-advisory'); setShowDrawer(false); }}>🌤️ मौसम पूर्वानुमान (Weather)</button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { setActiveTab('crop-school'); setShowDrawer(false); }}>📚 फसल स्कूल (Crop School)</button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { onOpenProfile(); setShowDrawer(false); }}>👤 किसान प्रोफ़ाइल (Profile)</button>
            </div>
          </div>
          <div style={{ flex: 1 }} onClick={() => setShowDrawer(false)} />
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>कृषि समाचार एवं अलर्ट (Notifications)</h3>
              <button onClick={() => setShowNotificationModal(false)} style={{ background: 'transparent', border: 'none', color: '#0f172a' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map((n, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 700, fontSize: '0.9rem' }}>
                    <span>{n.icon}</span> <span>{n.title}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#334155', margin: '0.25rem 0' }}>{n.desc}</p>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
