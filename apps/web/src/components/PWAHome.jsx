import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../shared/api/client';
import { 
  Sprout, 
  CloudSun, 
  TrendingUp, 
  BookOpen, 
  FileText, 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

export default function PWAHome({ onNavigate, farmerProfile }) {
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gapDays, setGapDays] = useState(68);

  const stateName = farmerProfile?.state || 'Uttar Pradesh';
  const districtName = farmerProfile?.district || 'Ghaziabad';

  useEffect(() => {
    const fetchHomeRecommendations = async () => {
      setLoading(true);
      try {
        const payload = {
          state_name: stateName,
          district_name: districtName,
          previous_crop: farmerProfile?.previousCrop || 'Wheat',
          harvest_date: '2026-04-25',
          next_crop: farmerProfile?.nextCrop || 'Paddy',
          next_sowing_date: '2026-07-02',
          irrigation_type: farmerProfile?.irrigation || 'Tube well',
          area_acres: parseFloat(farmerProfile?.landArea) || 2.0,
        };

        const res = await api.post('/gap-crop/recommend', payload);
        if (res?.data?.status === 'success' && res.data.top_recommendations) {
          setRecommendations(res.data.top_recommendations);
          if (res.data.calculated_gap_days) {
            setGapDays(res.data.calculated_gap_days);
          }
        }
      } catch (err) {
        console.warn('Home auto-recommendation load notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeRecommendations();
  }, [stateName, districtName, farmerProfile]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '4rem' }}>
      
      {/* ------------------------------------------------------------- HERO GREETING BANNER */}
      <div className="glass-card" style={{ 
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', 
        color: '#ffffff',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-success" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
              📍 {districtName}, {stateName}
            </span>
          </div>
          
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.2rem', lineHeight: 1.2 }}>
            {t('farmer_greeting_header')}
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#fef08a', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
            {t('good_day')}
          </p>

          <p style={{ fontSize: '0.875rem', color: '#a7f3d0', maxWidth: '520px', marginBottom: '1.25rem', lineHeight: 1.4 }}>
            {t('hero_sub')}
          </p>

          {/* Primary Hero CTA Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start' }}>
            <button 
              onClick={() => onNavigate('gap-crop')}
              className="btn btn-primary"
              style={{
                background: '#ffffff',
                color: '#047857',
                padding: '0.85rem 1.4rem',
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                border: 'none'
              }}
            >
              <Sprout size={20} color="#047857" />
              <span>{t('hero_cta')}</span>
              <ArrowRight size={18} color="#047857" />
            </button>
            <span style={{ fontSize: '0.75rem', color: '#d1fae5', fontStyle: 'italic', paddingLeft: '0.2rem' }}>
              {t('hero_cta_sub')}
            </span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-30px',
          opacity: 0.15,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <Sprout size={180} color="#ffffff" />
        </div>
      </div>

      {/* ------------------------------------------------------------- MY FIELD SUMMARY CARD */}
      <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <MapPin size={18} color="#059669" />
            <span>{t('my_field_summary')}</span>
          </h3>

          <button 
            onClick={() => onNavigate('my-field')}
            style={{ background: 'transparent', border: 'none', color: '#0284c7', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          >
            <span>{t('view_full_field')}</span>
            <ChevronRight size={15} />
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
          gap: '0.75rem',
          background: '#f8faf8',
          padding: '0.85rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.825rem'
        }}>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>{t('field_name')}</span>
            <strong style={{ color: '#0f172a' }}>Mera Khet #1</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>{t('area')}</span>
            <strong style={{ color: '#0f172a' }}>{farmerProfile?.landArea || '2.0'} Acres</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>{t('previous_crop')}</span>
            <strong style={{ color: '#059669' }}>{farmerProfile?.previousCrop || 'Wheat (गेहूं)'}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>{t('next_crop')}</span>
            <strong style={{ color: '#0284c7' }}>{farmerProfile?.nextCrop || 'Paddy (धान)'}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>{t('irrigation_facility')}</span>
            <strong style={{ color: '#0f172a' }}>{farmerProfile?.irrigation || 'Tube well'}</strong>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- MAIN SERVICE CARDS */}
      <div>
        <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.75rem' }}>
          {t('main_services')}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          
          {/* 1. Gap Crop Card (Priority Highlight) */}
          <div 
            onClick={() => onNavigate('gap-crop')}
            className="glass-card"
            style={{ 
              border: '2px solid #059669', 
              background: '#f0fdf4',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ background: '#059669', color: '#ffffff', padding: '0.5rem', borderRadius: '10px' }}>
                <Sprout size={22} />
              </div>
              <span className="badge badge-success" style={{ background: '#16a34a', color: '#ffffff', fontSize: '0.7rem' }}>RECOMMENDED</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#065f46', marginBottom: '0.25rem' }}>
              {t('gap_crop_card_title')}
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#166534', marginBottom: '0.75rem', lineHeight: 1.3 }}>
              {t('gap_crop_card_desc')}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>{t('gap_crop_card_cta')}</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* 2. Mausam Card */}
          <div 
            onClick={() => onNavigate('weather')}
            className="glass-card"
            style={{ cursor: 'pointer' }}
          >
            <div style={{ background: '#0284c7', color: '#ffffff', padding: '0.5rem', borderRadius: '10px', width: 'fit-content', marginBottom: '0.5rem' }}>
              <CloudSun size={22} />
            </div>
            <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem' }}>
              {t('weather_card_title')}
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: 1.3 }}>
              {t('weather_card_desc')}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>{t('weather_card_cta')}</span>
              <ChevronRight size={15} />
            </div>
          </div>

          {/* 3. Mandi Bhav Card */}
          <div 
            onClick={() => onNavigate('mandi')}
            className="glass-card"
            style={{ cursor: 'pointer' }}
          >
            <div style={{ background: '#d97706', color: '#ffffff', padding: '0.5rem', borderRadius: '10px', width: 'fit-content', marginBottom: '0.5rem' }}>
              <TrendingUp size={22} />
            </div>
            <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem' }}>
              {t('mandi_card_title')}
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: 1.3 }}>
              {t('mandi_card_desc')}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>{t('mandi_card_cta')}</span>
              <ChevronRight size={15} />
            </div>
          </div>

          {/* 4. Crop School Card */}
          <div 
            onClick={() => onNavigate('crop-school')}
            className="glass-card"
            style={{ cursor: 'pointer' }}
          >
            <div style={{ background: '#7c3aed', color: '#ffffff', padding: '0.5rem', borderRadius: '10px', width: 'fit-content', marginBottom: '0.5rem' }}>
              <BookOpen size={22} />
            </div>
            <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem' }}>
              {t('crop_school_card_title')}
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: 1.3 }}>
              {t('crop_school_card_desc')}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>{t('crop_school_card_cta')}</span>
              <ChevronRight size={15} />
            </div>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- PERSONALIZED RECOMMENDATIONS FEED */}
      <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={20} color="#059669" />
              <span>{t('recommendations_title')}</span>
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {districtName}, {stateName} • Available Window: <strong>{gapDays} {t('days')}</strong>
            </span>
          </div>

          <button 
            onClick={() => onNavigate('gap-crop')}
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
          >
            <span>{t('new_recommendation_cta')}</span>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
            <Sprout className="animate-spin" size={28} color="#059669" style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontSize: '0.85rem' }}>Loading recommendations...</p>
          </div>
        ) : recommendations && recommendations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recommendations.slice(0, 3).map((rec, idx) => (
              <div 
                key={rec.crop_code || idx}
                style={{
                  background: idx === 0 ? '#f0fdf4' : '#f8faf8',
                  border: idx === 0 ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', color: '#0f172a', margin: 0 }}>
                        {rec.crop_name}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Avadhi: {rec.duration_days} • Category: {rec.category}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
                      {rec.score} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/ 100</span>
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#16a34a' }}>
                    <CheckCircle2 size={14} />
                    <span>{(rec.reasons && rec.reasons[0]) || 'Fits duration window & soil rotation.'}</span>
                  </div>
                </div>

                {rec.source_provenance && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={13} />
                    <span>{t('official_source')} <strong>{rec.source_provenance}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
            <p>Select your farm harvest and sowing dates to view personalized crop recommendations.</p>
            <button onClick={() => onNavigate('gap-crop')} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              {t('gap_crop_card_cta')}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}