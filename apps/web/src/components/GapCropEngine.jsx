import React, { useState, useEffect } from 'react';
import {
  Sprout, Calendar, ShieldCheck, DollarSign, Leaf, Zap, HelpCircle,
  CheckCircle2, CloudSun, TrendingUp, AlertTriangle, Info, RefreshCw, Layers
} from 'lucide-react';
import LandUnitInput from './LandUnitInput';

export default function GapCropEngine({ farmerProfile }) {
  // Form State
  const [previousCrop, setPreviousCrop] = useState('Wheat');
  const [harvestDate, setHarvestDate] = useState('2026-04-25');
  const [nextCrop, setNextCrop] = useState('Paddy');
  const [nextSowingDate, setNextSowingDate] = useState('2026-07-02');
  const [irrigation, setIrrigation] = useState('Tube well');
  const [stateName, setStateName] = useState(farmerProfile?.state || 'Uttar Pradesh');
  const [districtName, setDistrictName] = useState(farmerProfile?.district || 'Ghaziabad');
  const [areaAcres, setAreaAcres] = useState(
    farmerProfile?.landAcres ? parseFloat(farmerProfile.landAcres) : 2.0
  );

  // UI State
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  // Client-side Gap Days preview calculation
  const calculatePreviewGap = () => {
    if (!harvestDate || !nextSowingDate) return 0;
    const h = new Date(harvestDate);
    const s = new Date(nextSowingDate);
    const diffTime = s - h;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const previewGapDays = calculatePreviewGap();

  // Validate & Submit Form to API
  const handleFindGapCrops = async (e) => {
    if (e) e.preventDefault();
    setValidationError('');

    // Client-side validations (Phase 1 §19)
    if (!previousCrop) {
      setValidationError('Please select or enter the previous crop.');
      return;
    }
    if (!harvestDate) {
      setValidationError('Please enter a valid harvest date.');
      return;
    }
    if (!nextSowingDate) {
      setValidationError('Please enter the next planned sowing date.');
      return;
    }

    const hDate = new Date(harvestDate);
    const sDate = new Date(nextSowingDate);
    if (hDate > sDate) {
      setValidationError('Harvest date cannot be after the next sowing date.');
      return;
    }

    if (previewGapDays <= 0) {
      setValidationError('Harvest date must be before the next sowing date (gap must be at least 1 day).');
      return;
    }

    if (!areaAcres || areaAcres <= 0) {
      setValidationError('Land area must be greater than 0 acres.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/v1/gap-crop/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previous_crop: previousCrop,
          harvest_date: harvestDate,
          next_crop: nextCrop,
          next_sowing_date: nextSowingDate,
          irrigation_type: irrigation,
          state_name: stateName,
          district_name: districtName,
          area_acres: areaAcres
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error?.message || 'Failed to fetch recommendations from server.');
      }

      const resJson = await response.json();
      setApiResponse(resJson.data);
    } catch (err) {
      console.warn('API fetch failed or endpoint unavailable; running local client fallback logic.', err);
      // Fallback local calculation if backend is unreachable during static preview
      runLocalRecommendationFallback();
    } finally {
      setLoading(false);
    }
  };

  // Local fallback if API connection drops
  const runLocalRecommendationFallback = () => {
    const gap = previewGapDays;
    if (gap < 45) {
      setApiResponse({
        status: 'no_suitable_crop',
        message: 'No suitable gap crop was found for the available period and conditions.',
        gap_days: gap,
        suggestion: 'Consider changing the planned sowing date or consult a local agricultural expert.'
      });
      return;
    }

    setApiResponse({
      status: 'success',
      calculated_gap_days: gap,
      disclaimer: 'Estimated nutrient impact is based on crop profile rotation models and is NOT a measured soil test.',
      top_recommendations: [
        {
          rank: 1,
          crop_code: 'summer_moong',
          crop_name: 'Summer Moong',
          hindi_name: 'ग्रीष्मकालीन मूंग',
          scientific_name: 'Vigna radiata',
          category: 'Pulse',
          duration_days: '60-65 Days',
          water_requirement: 'Low',
          suitability_status: 'High',
          rotation_benefit: 'Favorable',
          estimated_nutrient_impact: `Previous ${previousCrop} cultivation may have a relatively high nitrogen demand; this Summer Moong recommendation receives a favorable rotation benefit based on its crop profile.`,
          expected_yield: '4.5 qtl/acre',
          projected_profit_per_acre: '₹22,000 - ₹30,000 / Acre',
          projected_profit_total: Math.round(26000 * areaAcres),
          score: 98.5,
          score_breakdown: {
            gap_duration_fit: 40.0,
            crop_compatibility: 20.0,
            regional_suitability: 13.5,
            irrigation_suitability: 10.0,
            nutrient_rotation_benefit: 15.0,
            total: 98.5
          },
          reasons: [
            `✓ Fits ${gap}-day gap window (60-65 days required)`,
            `✓ Favorable cereal-legume rotation after ${previousCrop}`,
            '✓ Provides a favorable leguminous rotation benefit',
            `✓ Suitable for ${irrigation} irrigation in ${districtName}`,
            '✓ Favorable regional season suitability'
          ],
          warnings: [],
          source_provenance: 'Demo/seed data — requires source verification'
        },
        {
          rank: 2,
          crop_code: 'urad',
          crop_name: 'Summer Urad',
          hindi_name: 'ग्रीष्मकालीन उड़द',
          scientific_name: 'Vigna mungo',
          category: 'Pulse',
          duration_days: '65-70 Days',
          water_requirement: 'Medium',
          suitability_status: 'High',
          rotation_benefit: 'Favorable',
          estimated_nutrient_impact: `Provides favorable nitrogen fixing capacity after ${previousCrop}.`,
          expected_yield: '4.0 qtl/acre',
          projected_profit_per_acre: '₹18,000 - ₹25,000 / Acre',
          projected_profit_total: Math.round(21000 * areaAcres),
          score: 91.0,
          score_breakdown: {
            gap_duration_fit: 35.0,
            crop_compatibility: 20.0,
            regional_suitability: 12.0,
            irrigation_suitability: 9.0,
            nutrient_rotation_benefit: 15.0,
            total: 91.0
          },
          reasons: [
            `✓ Fits ${gap}-day window`,
            `✓ Good crop rotation after ${previousCrop}`,
            '✓ Leguminous nitrogen-fixing profile',
            `✓ Supported by ${irrigation}`
          ],
          warnings: [],
          source_provenance: 'Demo/seed data — requires source verification'
        }
      ]
    });
  };

  // Run initial fetch on mount
  useEffect(() => {
    handleFindGapCrops();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '5rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: '#dcfce7', padding: '0.6rem', borderRadius: '10px', color: '#059669' }}>
            <Sprout size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>
              Phase 1 — Gap Crop Recommendation Engine
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
              Identify suitable short-duration gap crops to grow between previous harvest and next sowing.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.25rem' }}>
        
        {/* Input Form Controls */}
        <form className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }} onSubmit={handleFindGapCrops}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            <Zap size={18} color="#059669" /> Farmer Field Inputs
          </h3>

          {/* Validation Alert */}
          {validationError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', color: '#dc2626', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} />
              <span>{validationError}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
              1. Previous Harvested Crop
            </label>
            <select className="form-select" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} value={previousCrop} onChange={(e) => setPreviousCrop(e.target.value)}>
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Mustard">Mustard (सरसों)</option>
              <option value="Potato">Potato (आलू)</option>
              <option value="Paddy">Paddy / Rice (धान)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
              2. Previous Crop Harvest Date
            </label>
            <input type="date" className="form-control" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} />
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
              3. Next Planned Main Crop
            </label>
            <select className="form-select" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} value={nextCrop} onChange={(e) => setNextCrop(e.target.value)}>
              <option value="Paddy">Paddy / Rice (धान)</option>
              <option value="Sugarcane">Sugarcane (गन्ना)</option>
              <option value="Wheat">Wheat (गेहूं)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
              4. Next Crop Sowing Date
            </label>
            <input type="date" className="form-control" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} value={nextSowingDate} onChange={(e) => setNextSowingDate(e.target.value)} />
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
              5. Irrigation Facility
            </label>
            <select className="form-select" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} value={irrigation} onChange={(e) => setIrrigation(e.target.value)}>
              <option value="Tube well">Tube well / Borewell</option>
              <option value="Canal">Canal Irrigation</option>
              <option value="Rainfed">Rainfed (बारानी)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>State</label>
                <input type="text" className="form-control" style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} value={stateName} onChange={(e) => setStateName(e.target.value)} />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>District</label>
                <input type="text" className="form-control" style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} value={districtName} onChange={(e) => setDistrictName(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <LandUnitInput 
              valueInAcres={areaAcres}
              onChangeAcres={(acres) => setAreaAcres(acres)}
              label="Farm Area (Acres)"
            />
          </div>

          <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <div style={{ color: '#059669', fontWeight: 700 }}>
              Calculated Gap: {previewGapDays} Days
            </div>
            <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.2rem' }}>
              Window: {harvestDate} → {nextSowingDate}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sprout size={18} />}
            Find Best Gap Crops
          </button>
        </form>

        {/* Results Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* No Suitable Crop Case (Phase 1 §15) */}
          {apiResponse?.status === 'no_suitable_crop' && (
            <div className="glass-card" style={{ background: '#fff1f2', border: '1.5px solid #f43f5e', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#be123c', marginBottom: '0.75rem' }}>
                <AlertTriangle size={28} />
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>No Suitable Gap Crop Found</h3>
              </div>
              <p style={{ color: '#881337', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                {apiResponse.message}
              </p>
              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #fecdd3', fontSize: '0.85rem', color: '#9f1239' }}>
                <strong>Available Window:</strong> {apiResponse.gap_days} Days<br />
                <strong>Recommendation:</strong> {apiResponse.suggestion}
              </div>
            </div>
          )}

          {/* Success Recommendations */}
          {apiResponse?.status === 'success' && apiResponse?.top_recommendations?.length > 0 && (
            <>
              {/* Summary Bar */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.85rem 1.25rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Available Gap Duration:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', marginLeft: '0.5rem' }}>
                    {apiResponse.calculated_gap_days} Days
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '20px' }}>
                  Showing Top {apiResponse.top_recommendations.length} Recommendations
                </div>
              </div>

              {/* Disclaimer Notice (Phase 1 §11 & §24) */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.775rem', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Info size={16} color="#2563eb" />
                <span>{apiResponse.disclaimer}</span>
              </div>

              {/* Render Top Recommendations */}
              {apiResponse.top_recommendations.map((item, idx) => (
                <div
                  key={item.crop_code || idx}
                  className="glass-card"
                  style={{
                    background: '#ffffff',
                    border: idx === 0 ? '2px solid #059669' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    position: 'relative'
                  }}
                >
                  {/* Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: idx === 0 ? '#dcfce7' : '#f1f5f9',
                          color: idx === 0 ? '#15803d' : '#475569',
                          marginBottom: '0.35rem'
                        }}
                      >
                        #{item.rank} Ranked Candidate ({item.score} / 100 Score)
                      </span>
                      <h4 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0.1rem 0' }}>
                        {item.crop_name} ({item.hindi_name})
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                        Duration: {item.duration_days} • {item.category} • Yield: {item.expected_yield}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', background: '#f0fdf4', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Est. Net Profit ({areaAcres} Acres):</span>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>
                        ₹{item.projected_profit_total?.toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#16a34a' }}>{item.projected_profit_per_acre}</span>
                    </div>
                  </div>

                  {/* Estimated Nutrient Impact Box */}
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#334155', marginBottom: '0.85rem' }}>
                    <strong style={{ color: '#0f172a' }}>Estimated Nutrient & Rotation Impact:</strong> {item.estimated_nutrient_impact}
                  </div>

                  {/* Reasons Summary */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.4rem', fontSize: '0.8rem', color: '#15803d' }}>
                    {item.reasons?.map((reason, rIdx) => (
                      <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                  {/* Warnings if any */}
                  {item.warnings?.length > 0 && (
                    <div style={{ marginTop: '0.5rem', color: '#b45309', fontSize: '0.775rem' }}>
                      {item.warnings.map((w, wIdx) => (
                        <div key={wIdx}>⚠️ {w}</div>
                      ))}
                    </div>
                  )}

                  {/* Provenance Tag */}
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed #e2e8f0', fontSize: '0.7rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Source: {item.source_provenance}</span>
                    <span>Water: {item.water_requirement}</span>
                  </div>
                </div>
              ))}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
