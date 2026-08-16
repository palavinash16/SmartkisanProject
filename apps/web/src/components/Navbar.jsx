import React from 'react';
import { 
  Sprout, 
  Store, 
  CloudSun, 
  BookOpen, 
  MapPin, 
  LayoutDashboard, 
  Globe, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const LANGUAGES = [
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'bho', label: 'भोजपुरी (Bhojpuri)' },
  { code: 'awa', label: 'अवधी (Awadhi)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'en', label: 'English' }
];

export default function Navbar({ activeTab, setActiveTab, selectedLang, setSelectedLang }) {
  const navItems = [
    { id: 'my-field', label: 'My Field (Integration)', icon: MapPin },
    { id: 'gap-crop', label: 'Module 1: Gap Engine', icon: Sprout },
    { id: 'mandi-prices', label: 'Module 2: Mandi Intelligence', icon: Store },
    { id: 'weather-advisory', label: 'Module 3: Weather Advisory', icon: CloudSun },
    { id: 'crop-school', label: 'Module 4: Crop School', icon: BookOpen },
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  ];

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('my-field')}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <Sprout size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #ffffff 0%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SmartKisan
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Modular MVP v1.0</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Farmer Agricultural Decision-Support System
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto', padding: '0.25rem 0' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Language Selector & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(6, 20, 13, 0.6)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <Globe size={16} color="var(--primary)" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)'
              }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} style={{ background: '#0e2216', color: '#fff' }}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#4ade80', background: 'rgba(34, 197, 94, 0.1)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <ShieldCheck size={14} />
            <span>Modules Online</span>
          </div>
        </div>

      </div>
    </header>
  );
}
