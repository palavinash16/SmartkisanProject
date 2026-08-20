import React, { useState, useEffect } from 'react';
import { 
  Store, 
  MapPin, 
  TrendingUp, 
  Search, 
  Filter, 
  Bell, 
  ArrowUpRight, 
  ShieldCheck, 
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CROP_PILLS = [
  { code: 'Wheat', label: 'गेहूं', icon: '🌾' },
  { code: 'Moong', label: 'मूंग', icon: '🫘' },
  { code: 'Chana', label: 'चना', icon: '🧆' },
  { code: 'Paddy', label: 'धान', icon: '🌾' },
  { code: 'Mustard', label: 'सरसों', icon: '🌼' },
  { code: 'Sesame', label: 'तिल', icon: '🌱' },
];

export default function MandiPriceSearch({ farmerProfile, setActiveTab }) {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabSub, setActiveTabSub] = useState('nearby');
  const [selectedTrendPeriod, setSelectedTrendPeriod] = useState('7d');
  const [alertSet, setAlertSet] = useState(false);

  const district = farmerProfile?.district || 'गाज़ियाबाद';
  const state = farmerProfile?.state || 'उत्तर प्रदेश';

  const mandiList = [
    { name: 'गाज़ियाबाद APMC', distance: '5 km', agaman: '320', min: '2,100', modal: '2,350', max: '2,600', updated: '14 Aug 07:30 AM', isLocal: true },
    { name: 'हापुड़ APMC', distance: '18 km', agaman: '410', min: '2,200', modal: '2,420', max: '2,700', updated: '14 Aug 07:30 AM', isBest: true },
    { name: 'मेरठ APMC', distance: '38 km', agaman: '600', min: '2,050', modal: '2,300', max: '2,550', updated: '13 Aug 06:15 PM' },
    { name: 'बुलंदशहर APMC', distance: '42 km', agaman: '290', min: '2,150', modal: '2,360', max: '2,650', updated: '14 Aug 07:00 AM' },
    { name: 'मुजफ्फरनगर APMC', distance: '55 km', agaman: '350', min: '2,080', modal: '2,280', max: '2,520', updated: '13 Aug 05:50 PM' }
  ];

  const filteredMandis = mandiList.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === ''
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '5rem' }}>
      
      {/* Top Header Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(6, 20, 13, 0.95) 100%)', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-warning">Mandi Live</span>
              <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>🔄 14 Aug 2026, 07:30 AM</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', fontFamily: 'Hind, Noto Sans Devanagari, sans-serif' }}>{t('mandi_title')}</h2>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="#34d399" />
              <span>{district}, {state}</span>
            </div>
          </div>

          <button 
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.4)' }}
            onClick={() => setAlertSet(!alertSet)}
          >
            <Bell size={14} /> {alertSet ? '✓ Alert Active' : 'Set Price Alert'}
          </button>
        </div>
      </div>

      {/* Search Input & Filter */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input 
            type="text" 
            placeholder={t('mandi_search_ph')}
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%', fontSize: '0.9rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem' }}>
          <Filter size={16} /> <span>Filter</span>
        </button>
      </div>

      {/* Mandi Navigation Sub-Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '1rem', fontSize: '0.9rem' }}>
        <button 
          onClick={() => setActiveTabSub('nearby')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTabSub === 'nearby' ? '2px solid #10b981' : 'none',
            color: activeTabSub === 'nearby' ? '#34d399' : 'var(--text-muted)',
            fontWeight: activeTabSub === 'nearby' ? 700 : 500,
            padding: '0.5rem 0.5rem 0.75rem 0.5rem',
            cursor: 'pointer'
          }}
        >
          Nearby Mandis
        </button>
        <button 
          onClick={() => setActiveTabSub('my')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTabSub === 'my' ? '2px solid #10b981' : 'none',
            color: activeTabSub === 'my' ? '#34d399' : 'var(--text-muted)',
            fontWeight: activeTabSub === 'my' ? 700 : 500,
            padding: '0.5rem 0.5rem 0.75rem 0.5rem',
            cursor: 'pointer'
          }}
        >
          My Mandis
        </button>
        <button 
          onClick={() => setActiveTabSub('all')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTabSub === 'all' ? '2px solid #10b981' : 'none',
            color: activeTabSub === 'all' ? '#34d399' : 'var(--text-muted)',
            fontWeight: activeTabSub === 'all' ? 700 : 500,
            padding: '0.5rem 0.5rem 0.75rem 0.5rem',
            cursor: 'pointer'
          }}
        >
          All Mandis
        </button>
      </div>

      {/* Quick Crop Pills */}
      <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
        {CROP_PILLS.map((c) => (
          <button
            key={c.code}
            onClick={() => setSelectedCrop(c.code)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              border: selectedCrop === c.code ? '1.5px solid #10b981' : '1px solid var(--border-color)',
              background: selectedCrop === c.code ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 20, 13, 0.6)',
              color: selectedCrop === c.code ? '#34d399' : '#fff',
              fontSize: '0.85rem',
              fontWeight: selectedCrop === c.code ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Today Market Trend Banner */}
      <div className="glass-card" style={{ background: 'rgba(6, 20, 13, 0.8)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Market Trend ({selectedCrop})</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>
              ₹2,365 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/Qtl Avg</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>vs Yesterday</span>
              <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.95rem' }}>↗ + ₹45</div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('trend')}</span>
              <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.95rem' }}>↑ Upward</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandi Price Comparison Table */}
      <div className="glass-card">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr 1.2fr', fontSize: '0.75rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
          <span>{t('mandi')}</span>
          <span style={{ textAlign: 'right' }}>Arrival</span>
          <span style={{ textAlign: 'right' }}>{t('min_price')}</span>
          <span style={{ textAlign: 'right' }}>{t('modal_price')}</span>
          <span style={{ textAlign: 'right' }}>{t('max_price')}</span>
          <span style={{ textAlign: 'right' }}>{t('updated')}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredMandis.map((m, idx) => (
            <div 
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr 1.2fr',
                fontSize: '0.85rem',
                alignItems: 'center',
                padding: '0.6rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: m.isBest ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                border: m.isBest ? '1px solid rgba(251, 191, 36, 0.3)' : 'none'
              }}
            >
              <div>
                <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>{m.name}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.distance}</span>
              </div>
              <span style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{m.agaman}</span>
              <span style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{m.min}</span>
              <strong style={{ textAlign: 'right', color: m.isBest ? '#fbbf24' : '#34d399', fontSize: '1rem', fontFamily: 'Outfit' }}>{m.modal}</strong>
              <span style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{m.max}</span>
              <span style={{ textAlign: 'right', fontSize: '0.7rem', color: '#4ade80' }}>{m.updated}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
