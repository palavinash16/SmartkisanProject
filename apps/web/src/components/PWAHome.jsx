import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MANDI_PRICES } from '../data/mockData';
import { 
  Sprout, 
  Store, 
  MapPin, 
  ArrowRight, 
  ChevronRight, 
  TrendingUp, 
  Award, 
  Mic, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export default function PWAHome({ farmerProfile, setActiveTab }) {
  const { t } = useLanguage();

  return (
    <div style={{ paddingBottom: '5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Hero Welcome Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0e2216 0%, #06140d 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        color: '#ffffff',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <ShieldCheck size={14} /> SmartKisan Core Engine (Phase 1 Active)
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.25rem 0', fontFamily: 'Outfit' }}>
              {t('farmer_greeting_header')}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
              {t('hero_sub')}
            </p>
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            padding: '0.6rem',
            borderRadius: '12px',
            color: '#34d399'
          }}>
            <Sprout size={28} />
          </div>
        </div>

        {/* Quick Location & Farm Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginTop: '1rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.8rem',
          color: '#e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={15} color="#34d399" />
            <span><strong>{farmerProfile?.district || 'Gorakhpur'}, {farmerProfile?.state || 'Uttar Pradesh'}</strong></span>
          </div>
          <span>•</span>
          <div>
            <span>भूमि: <strong>{farmerProfile?.landArea || 2.0} {farmerProfile?.landUnit || 'Acres'}</strong></span>
          </div>
        </div>
      </div>

      {/* Feature Action Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
        
        {/* Card 1: ACTIVE PHASE 1 MODULE - Inter-Season Zaid Advisor */}
        <div 
          onClick={() => setActiveTab('gap-crop')}
          style={{
            background: 'linear-gradient(135deg, rgba(14,34,22,0.95) 0%, rgba(6,20,13,0.95) 100%)',
            border: '2px solid #10b981',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            minHeight: '125px',
            boxShadow: '0 0 15px rgba(16,185,129,0.2)'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                <Sprout size={20} />
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Phase 1 Active</span>
            </div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.2rem 0' }}>
              {t('nav_gap_crop')}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
              60-90 दिन में लाभदायी जायद फसल सलाहकार
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
            <span>शुरू करें</span> <ArrowRight size={14} />
          </div>
        </div>

        {/* Card 2: POSTPONED FUTURE FEATURE - Harvest Revenue Simulator */}
        <div 
          onClick={() => setActiveTab('profit-predictor')}
          style={{
            background: '#0e2216',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            minHeight: '125px',
            opacity: 0.9
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                <TrendingUp size={20} />
              </div>
              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Phase 5 Preview</span>
            </div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.2rem 0' }}>
              आय पूर्वाआनुमान (ML Simulator)
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
              लागत, पैदावार और मुनाफा कैलकुलेटर
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
            <span>पूर्वावलोकन (Preview)</span> <ArrowRight size={14} />
          </div>
        </div>

        {/* Card 3: POSTPONED FUTURE FEATURE - Kisan Vani Voice AI */}
        <div 
          onClick={() => setActiveTab('voice-assistant')}
          style={{
            background: '#0e2216',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            minHeight: '125px',
            opacity: 0.9
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.2)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                <Mic size={20} />
              </div>
              <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Phase 5 Preview</span>
            </div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.2rem 0' }}>
              {t('nav_voice')}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
              अपनी बोली में वॉइस सवाल-जवाब
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
            <span>पूर्वावलोकन (Preview)</span> <ArrowRight size={14} />
          </div>
        </div>

        {/* Card 4: POSTPONED FUTURE FEATURE - Kisan Yojana Mitra */}
        <div 
          onClick={() => setActiveTab('scheme-finder')}
          style={{
            background: '#0e2216',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            minHeight: '125px',
            opacity: 0.9
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.2)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                <Award size={20} />
              </div>
              <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Phase 5 Preview</span>
            </div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.2rem 0' }}>
              {t('nav_schemes')}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
              सरकारी योजनाएं व सब्सिडी RAG
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#c084fc', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
            <span>पूर्वावलोकन (Preview)</span> <ArrowRight size={14} />
          </div>
        </div>

      </div>

      {/* Live Mandi Ticker Section */}
      <div style={{ background: '#0e2216', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
            <Store size={18} />
            <span>{t('today_mandi_prices')}</span>
          </div>
          <button 
            onClick={() => setActiveTab('mandi-prices')}
            style={{ background: 'transparent', border: 'none', color: '#34d399', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <span>सभी देखें</span> <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {MANDI_PRICES.map((mandi, idx) => (
            <div key={idx} style={{ background: 'rgba(6,20,13,0.8)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '0.65rem 0.85rem', borderRadius: '8px', minWidth: '130px' }}>
              <span style={{ fontSize: '0.8rem', color: '#e2e8f0', display: 'block', fontWeight: 600 }}>{mandi.crop}</span>
              <strong style={{ fontSize: '0.95rem', color: '#34d399' }}>₹{mandi.price}</strong>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>{mandi.location}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
