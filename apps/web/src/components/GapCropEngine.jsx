import React, { useState } from 'react';
import { api, ApiError } from '../shared/api/client';
import { useLanguage } from '../context/LanguageContext';
import LandUnitInput from './LandUnitInput';
import { STATES_AND_DISTRICTS } from '../data/mockData';
import { 
  Sprout, 
  Calendar, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  ArrowRight, 
  RotateCcw,
  Info,
  Droplets,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function GapCropEngine({ farmerProfile }) {
  const { t } = useLanguage();

  // 6-step form state
  const [formData, setFormData] = useState({
    state_name: farmerProfile?.state || 'Uttar Pradesh',
    district_name: farmerProfile?.district || 'Ghaziabad',
    previous_crop: farmerProfile?.previousCrop || 'Wheat',
    harvest_date: '2026-04-25',
    next_crop: farmerProfile?.nextCrop || 'Paddy',
    next_sowing_date: '2026-07-02',
    irrigation_type: farmerProfile?.irrigation || 'Tube well',
    area_acres: parseFloat(farmerProfile?.landArea) || 2.0,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [expandedBreakdown, setExpandedBreakdown] = useState(null);

  const PREVIOUS_CROPS = [
    'Wheat',
    'Mustard',
    'Potato',
    'Paddy',
    'Sugarcane',
    'Gram (Chana)',
    'Barley',
    'Vegetables'
  ];

  const IRRIGATION_TYPES = [
    'Tube well',
    'Borewell',
    'Canal',
    'Drip',
    'Sprinkler',
    'Rainfed'
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.state_name || !formData.district_name) {
      setError(t('error_validation'));
      return false;
    }
    if (!formData.harvest_date || !formData.next_sowing_date) {
      setError(t('error_validation'));
      return false;
    }
    if (new Date(formData.harvest_date) >= new Date(formData.next_sowing_date)) {
      setError(t('error_date_range'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    setLoadingStep(1);
    const stepTimer1 = setTimeout(() => setLoadingStep(2), 400);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 800);

    try {
      const payload = {
        state_name: formData.state_name,
        district_name: formData.district_name,
        previous_crop: formData.previous_crop,
        harvest_date: formData.harvest_date,
        next_crop: formData.next_crop,
        next_sowing_date: formData.next_sowing_date,
        irrigation_type: formData.irrigation_type,
        area_acres: parseFloat(formData.area_acres) || 2.0,
      };

      const res = await api.post('/gap-crop/recommend', payload);
      if (res?.data) {
        setResult(res.data);
      } else {
        throw new Error('Response payload invalid');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.messageLocalized || err.message || t('error_network'));
      } else {
        setError(t('error_network'));
      }
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '4rem' }}>
      
      {/* ------------------------------------------------------------- MODULE HEADER */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        color: '#ffffff',
        padding: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.65rem', borderRadius: '12px', color: '#ffffff' }}>
            <Sprout size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#ffffff', margin: 0 }}>
                {t('gap_crop_card_title')}
              </h2>
              <span className="badge badge-success" style={{ background: '#dcfce7', color: '#15803d' }}>Phase 1 Core Engine</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a7f3d0', margin: '0.2rem 0 0 0' }}>
              {t('gap_crop_card_desc')}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- MAIN CONTENT AREA */}
      {!result ? (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} color="#059669" /> {t('gap_form_title')}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
              Step {currentStep} of 6
            </span>
          </div>

          {/* Inline Error Alert */}
          {error && (
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fca5a5', 
              color: '#b91c1c', 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}>
              <AlertTriangle size={18} color="#dc2626" />
              <span>{error}</span>
            </div>
          )}

          {/* Progressive 6-Step Form Controls */}
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Location */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={18} color="#059669" /> {t('step_1_location')}
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Rajya (State):</label>
                    <select 
                      className="form-select"
                      value={formData.state_name}
                      onChange={(e) => {
                        const st = e.target.value;
                        const dists = STATES_AND_DISTRICTS[st] || [];
                        setFormData((prev) => ({ ...prev, state_name: st, district_name: dists[0] || '' }));
                      }}
                    >
                      {Object.keys(STATES_AND_DISTRICTS).map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Zila (District):</label>
                    <select 
                      className="form-select"
                      value={formData.district_name}
                      onChange={(e) => handleInputChange('district_name', e.target.value)}
                    >
                      {(STATES_AND_DISTRICTS[formData.state_name] || ['Ghaziabad']).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-primary" onClick={() => setCurrentStep(2)}>
                    <span>{t('btn_next')}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Previous Crop */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#0f172a' }}>
                  {t('step_2_prev_crop')}
                </h4>
                
                <div className="form-group">
                  <label className="form-label">{t('previous_crop')}:</label>
                  <select 
                    className="form-select"
                    value={formData.previous_crop}
                    onChange={(e) => handleInputChange('previous_crop', e.target.value)}
                  >
                    {PREVIOUS_CROPS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(1)}>{t('btn_prev')}</button>
                  <button type="button" className="btn btn-primary" onClick={() => setCurrentStep(3)}>{t('btn_next')} <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {/* Step 3: Harvest Date */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#0f172a' }}>
                  {t('step_3_harvest_date')}
                </h4>
                
                <div className="form-group">
                  <label className="form-label">Harvest Date (YYYY-MM-DD):</label>
                  <input 
                    type="date"
                    className="form-input"
                    value={formData.harvest_date}
                    onChange={(e) => handleInputChange('harvest_date', e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(2)}>{t('btn_prev')}</button>
                  <button type="button" className="btn btn-primary" onClick={() => setCurrentStep(4)}>{t('btn_next')} <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {/* Step 4: Next Sowing Date */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#0f172a' }}>
                  {t('step_4_sowing_date')}
                </h4>
                
                <div className="form-group">
                  <label className="form-label">Next Planned Sowing Date (YYYY-MM-DD):</label>
                  <input 
                    type="date"
                    className="form-input"
                    value={formData.next_sowing_date}
                    onChange={(e) => handleInputChange('next_sowing_date', e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(3)}>{t('btn_prev')}</button>
                  <button type="button" className="btn btn-primary" onClick={() => setCurrentStep(5)}>{t('btn_next')} <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {/* Step 5: Irrigation */}
            {currentStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#0f172a' }}>
                  {t('step_5_irrigation')}
                </h4>
                
                <div className="form-group">
                  <label className="form-label">{t('irrigation_facility')}:</label>
                  <select 
                    className="form-select"
                    value={formData.irrigation_type}
                    onChange={(e) => handleInputChange('irrigation_type', e.target.value)}
                  >
                    {IRRIGATION_TYPES.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(4)}>{t('btn_prev')}</button>
                  <button type="button" className="btn btn-primary" onClick={() => setCurrentStep(6)}>{t('btn_next')} <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {/* Step 6: Land Area & Final Submit */}
            {currentStep === 6 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#0f172a' }}>
                  {t('step_6_area')}
                </h4>
                
                <LandUnitInput 
                  state={formData.state_name}
                  valueAcres={formData.area_acres}
                  onChangeAcres={(acres) => handleInputChange('area_acres', acres)}
                />

                <div style={{ 
                  background: '#f0fdf4', 
                  border: '1px solid #bbf7d0', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '0.85rem',
                  fontSize: '0.825rem',
                  color: '#166534'
                }}>
                  <strong style={{ display: 'block', marginBottom: '0.2rem' }}>✓ Summary:</strong>
                  <span>{formData.district_name}, {formData.state_name} • Prev: {formData.previous_crop} • Harvest: {formData.harvest_date} → Sowing: {formData.next_sowing_date}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(5)}>{t('btn_prev')}</button>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                  >
                    {loading ? (
                      <>
                        <Sprout className="animate-spin" size={18} />
                        <span>Analysis In Progress...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>{t('btn_submit_crop')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>

          {/* Animated Loading State */}
          {loading && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1.25rem', 
              background: '#ecfdf5', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid #a7f3d0',
              textAlign: 'center'
            }}>
              <Sprout className="animate-spin" size={32} color="#059669" style={{ margin: '0 auto 0.5rem auto' }} />
              <h4 style={{ color: '#047857', fontSize: '1rem', margin: '0 0 0.5rem 0' }}>
                Analyzing verified agricultural suitability for your field...
              </h4>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.8rem', color: '#065f46' }}>
                <span style={{ fontWeight: loadingStep >= 1 ? 700 : 400 }}>✓ Gap Duration Check</span>
                <span style={{ fontWeight: loadingStep >= 2 ? 700 : 400 }}>{loadingStep >= 2 ? '✓ Regional Suitability' : '• Regional Suitability'}</span>
                <span style={{ fontWeight: loadingStep >= 3 ? 700 : 400 }}>{loadingStep >= 3 ? '✓ Scoring Ranking' : '• Scoring Ranking'}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ------------------------------------------------------------- RESULT VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Result Header & Controls */}
          <div className="glass-card" style={{ background: '#f8faf8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span className="badge badge-success" style={{ marginBottom: '0.35rem' }}>
                  {result.status === 'success' ? '✓ Recommendation Available' : '⚠️ No Suitable Crop Found'}
                </span>
                <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: 0 }}>
                  {t('recommendations_title')}
                </h3>
              </div>

              <button 
                onClick={() => setResult(null)}
                className="btn btn-outline"
                style={{ fontSize: '0.825rem' }}
              >
                <RotateCcw size={15} />
                <span>{t('try_again_cta')}</span>
              </button>
            </div>

            {/* Gap Summary Bar */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '1.25rem', 
              marginTop: '1rem', 
              paddingTop: '0.85rem', 
              borderTop: '1px solid #e2e8f0',
              fontSize: '0.85rem',
              color: '#334155'
            }}>
              <div>
                <span style={{ color: '#64748b' }}>{t('available_gap')} </span>
                <strong style={{ color: '#059669', fontSize: '1rem' }}>{result.calculated_gap_days} {t('days')}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Location: </span>
                <strong>{result.location_context?.district_name}, {result.location_context?.state_name}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Precedence Resolution: </span>
                <strong style={{ color: '#0284c7' }}>{result.location_context?.resolution_level}</strong>
              </div>
            </div>
          </div>

          {/* Successful Recommendations List */}
          {result.status === 'success' && result.top_recommendations?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.top_recommendations.map((rec, idx) => (
                <div 
                  key={rec.crop_code || idx}
                  className="glass-card"
                  style={{
                    border: idx === 0 ? '2px solid #059669' : '1px solid #e2e8f0',
                    background: idx === 0 ? '#f0fdf4' : '#ffffff',
                    boxShadow: idx === 0 ? '0 6px 20px rgba(5, 150, 105, 0.12)' : 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: idx === 0 ? '#059669' : '#e2e8f0',
                        color: idx === 0 ? '#ffffff' : '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                            {rec.crop_name}
                          </h4>
                          {rec.scientific_name && (
                            <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                              ({rec.scientific_name})
                            </span>
                          )}

                        {rec.weather_risk && (
                          <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span className="badge" style={{
                              background: rec.weather_risk === 'HIGH' ? '#fef2f2' : rec.weather_risk === 'MODERATE' ? '#fef3c7' : '#f0fdf4',
                              border: rec.weather_risk === 'HIGH' ? '1px solid #fca5a5' : rec.weather_risk === 'MODERATE' ? '1px solid #fde68a' : '1px solid #bbf7d0',
                              color: rec.weather_risk === 'HIGH' ? '#991b1b' : rec.weather_risk === 'MODERATE' ? '#b45309' : '#16a34a',
                              fontSize: '0.72rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px'
                            }}>
                              🌤️ {t('weather_risk_label')}: {t('weather_risk_' + (rec.weather_risk || 'unknown').toLowerCase())}
                            </span>
                            {rec.weather_source && (
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                ({t('source_label')}: {rec.weather_source}{rec.weather_is_stale ? ' Cached' : ''})
                              </span>
                            )}
                          </div>
                        )}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                          Avadhi: <strong>{rec.duration_days}</strong> • Category: {rec.category} • Sinchai: {rec.water_requirement} Water
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>
                        {rec.score} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ 100</span>
                      </div>
                      <button 
                        onClick={() => setExpandedBreakdown(expandedBreakdown === idx ? null : idx)}
                        style={{ background: 'transparent', border: 'none', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}
                      >
                        <span>Score Breakdown</span>
                        {expandedBreakdown === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Score Breakdown Toggle Panel */}
                  {expandedBreakdown === idx && rec.score_breakdown && (
                    <div style={{ 
                      marginTop: '0.75rem', 
                      background: '#ffffff', 
                      border: '1px solid #cbd5e1', 
                      borderRadius: 'var(--radius-sm)', 
                      padding: '0.75rem',
                      fontSize: '0.8rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '0.5rem'
                    }}>
                      <div>Gap Fit: <strong>{rec.score_breakdown.gap_duration_fit} / 40</strong></div>
                      <div>Compatibility: <strong>{rec.score_breakdown.crop_compatibility} / 20</strong></div>
                      <div>Regional: <strong>{rec.score_breakdown.regional_suitability} / 15</strong></div>
                      <div>Irrigation: <strong>{rec.score_breakdown.irrigation_suitability} / 10</strong></div>
                      <div>Nutrient Rotation: <strong>{rec.score_breakdown.nutrient_rotation_benefit} / 15</strong></div>
                    </div>
                  )}

                  {/* Reasons Section */}
                  <div style={{ marginTop: '0.85rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}>
                      {t('why_recommended')}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {(rec.reasons || []).map((r, rIdx) => (
                        <div key={rIdx} style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CheckCircle2 size={15} color="#16a34a" />
                          <span>{r.replace(/^[✓\s]+/, '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rotational Impact */}
                  {rec.estimated_nutrient_impact && (
                    <div style={{ marginTop: '0.75rem', padding: '0.65rem', background: '#ecfdf5', borderRadius: '6px', border: '1px solid #a7f3d0', fontSize: '0.8rem', color: '#065f46' }}>
                      <strong>{t('rotational_benefit')} </strong>
                      {rec.estimated_nutrient_impact}
                    </div>
                  )}

                  {/* Economics & Source */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>{t('expected_yield')} </span>
                      <strong style={{ color: '#0f172a' }}>{rec.expected_yield || '4-5 qtl/acre'}</strong>
                    </div>
                    {rec.source_provenance && (
                      <div style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ShieldCheck size={15} />
                        <span>{t('official_source')} <strong>{rec.source_provenance}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Scientific Disclaimer */}
              <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '0.5rem' }}>
                * {result.disclaimer || "Estimated nutrient impact is based on crop profile rotation models and is NOT a measured soil test."}
              </div>
            </div>
          ) : (
            /* ------------------------------------------------------------- NO SUITABLE CROP FALLBACK VIEW */
            <div className="glass-card" style={{ background: '#fffbe6', border: '1px solid #ffe58f', textAlign: 'center', padding: '2rem 1.5rem' }}>
              <AlertTriangle size={36} color="#d97706" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', color: '#b45309', margin: '0 0 0.5rem 0' }}>
                {t('no_suitable_crop_title')}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#78350f', maxWidth: '550px', margin: '0 auto 1.25rem auto' }}>
                {t('no_suitable_crop_desc')} ({result.calculated_gap_days} {t('days')}).
              </p>

              {result.rejected_summary?.length > 0 && (
                <div style={{ maxWidth: '500px', margin: '0 auto 1.25rem auto', textAlign: 'left', background: '#ffffff', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #fde68a', fontSize: '0.825rem' }}>
                  <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.4rem' }}>{t('rejection_reasons_title')}</strong>
                  {result.rejected_summary.map((rej, rIdx) => (
                    <div key={rIdx} style={{ color: '#78350f', marginBottom: '0.25rem' }}>
                      • <strong>{rej.crop_name}:</strong> {rej.reason}
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={() => setResult(null)}
                className="btn btn-primary"
              >
                <RotateCcw size={16} />
                <span>{t('try_again_cta')}</span>
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}