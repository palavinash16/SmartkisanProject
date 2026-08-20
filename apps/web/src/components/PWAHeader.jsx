import React, { useState } from 'react';
import { 
  Sprout, 
  Globe, 
  Menu, 
  MapPin, 
  Bell, 
  ChevronDown, 
  X, 
  ShieldCheck,
  User,
  Home,
  Store,
  BookOpen,
  Sparkles,
  TrendingUp,
  Mic,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../utils/translations';

export default function PWAHeader({ farmerProfile, activeTab, setActiveTab, selectedLang, setSelectedLang, onOpenProfile }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { lang, setLang } = useLanguage();

  const handleLanguageChange = (code) => {
    setSelectedLang(code);
    setLang(code);
  };

  const notifications = [
    { title: "मौसम चेतावनी: बारिश की संभावना", desc: "अगले 8 घंटे में 80% बारिश की संभावना। छिड़काव रोकें।", time: "10 मिनट पहले", icon: "⚠️" },
    { title: "नवीनतम मंडी भाव अपडेट", desc: "कर्नाल मंडी में धान का भाव ₹2,183/क्विंटल पहुंचा।", time: "1 घंटे पहले", icon: "📈" },
    { title: "पीएम-किसान किस्त अपडेट", desc: "17वीं किस्त जल्द खातों में भेजी जाएगी। ई-केवाईसी जांचें।", time: "3 घंटे पहले", icon: "📜" }
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, background: '#0e2216', borderBottom: '1px solid rgba(34, 197, 94, 0.25)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
      
      {/* Top Main Row */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        
        {/* Left: Drawer Trigger + Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button 
            onClick={() => setShowDrawer(true)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}
          >
            <Menu size={22} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)' }}>
              <Sprout size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit', color: '#ffffff', lineHeight: 1.1 }}>
                SmartKisan
              </div>
              <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 600 }}>किसान समृद्धि एआई</span>
            </div>
          </div>
        </div>

        {/* Right: PROMINENT MULTILINGUAL SELECTOR DROPDOWN & Bell */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          
          {/* Prominent Language Selector Dropdown */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            padding: '0.4rem 0.75rem', 
            borderRadius: 'var(--radius-full)', 
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.35)',
            cursor: 'pointer'
          }}>
            <Globe size={16} color="#ffffff" />
            <select
              value={selectedLang || lang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.825rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'Hind, Noto Sans Devanagari, sans-serif'
              }}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} style={{ background: '#0e2216', color: '#ffffff' }}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Button */}
          <button 
            onClick={() => setShowNotificationModal(true)}
            style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff'
            }}
          >
            <Bell size={18} />
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              3
            </span>
          </button>

        </div>

      </div>

      {/* Secondary Bar: Location & Profile Bar */}
      <div style={{ background: 'rgba(6, 20, 13, 0.7)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '0.35rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={onOpenProfile}
            style={{ background: 'transparent', border: 'none', color: '#34d399', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', padding: 0 }}
          >
            <MapPin size={15} color="#34d399" />
            <span>{farmerProfile?.village || 'गोरखपुर'}, {farmerProfile?.district || 'गोरखपुर'} ({farmerProfile?.state || 'उत्तर प्रदेश'})</span>
            <ChevronDown size={14} color="#94a3b8" />
          </button>

          <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>✓ 100% भाषा-अनुकूल एआई</span>
        </div>
      </div>

      {/* Drawer Menu */}
      {showDrawer && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 2000, display: 'flex' }}>
          <div style={{ width: '290px', background: '#0e2216', height: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit' }}>SmartKisan मेनू</div>
              <button onClick={() => setShowDrawer(false)} style={{ background: 'transparent', border: 'none', color: '#ffffff' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { setActiveTab('home'); setShowDrawer(false); }}><Home size={18} /> <span>होम (Home)</span></button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { setActiveTab('my-field'); setShowDrawer(false); }}><Sprout size={18} /> <span>मेरा खेत (My Field)</span></button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { setActiveTab('gap-crop'); setShowDrawer(false); }}><Sparkles size={18} /> <span>जायद फसल सलाहकार</span></button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { setActiveTab('profit-predictor'); setShowDrawer(false); }}><TrendingUp size={18} /> <span>फसल आय पूर्वानुमान</span></button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { setActiveTab('voice-assistant'); setShowDrawer(false); }}><Mic size={18} /> <span>किसान वाणी एआई</span></button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { setActiveTab('scheme-finder'); setShowDrawer(false); }}><FileText size={18} /> <span>किसान योजना मित्र</span></button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => { onOpenProfile(); setShowDrawer(false); }}><User size={18} /> <span>किसान प्रोफाइल सेटअप</span></button>
            </div>
          </div>
          <div style={{ flex: 1 }} onClick={() => setShowDrawer(false)} />
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%', background: '#0e2216', border: '1px solid rgba(34,197,94,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>कृषि सूचनाएं एवं अलर्ट</h3>
              <button onClick={() => setShowNotificationModal(false)} style={{ background: 'transparent', border: 'none', color: '#ffffff' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map((n, idx) => (
                <div key={idx} style={{ background: 'rgba(6,20,13,0.8)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
                    <span>{n.icon}</span> <span>{n.title}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: '0.25rem 0' }}>{n.desc}</p>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
