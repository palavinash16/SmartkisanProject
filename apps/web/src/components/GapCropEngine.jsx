import React, { useState } from 'react';
import { GAP_CROPS_DATABASE } from '../data/mockData';
import { Sprout, Calendar, ShieldCheck, DollarSign, Leaf, Zap, Award, Sparkles, TrendingUp } from 'lucide-react';

export default function GapCropEngine() {
  const [gapDays, setGapDays] = useState(65);
  const [landSize, setLandSize] = useState(2.0);
  const [soilType, setSoilType] = useState('Alluvial');
  const [irrigation, setIrrigation] = useState('BOREWELL');
  const [previousCrop, setPreviousCrop] = useState('Wheat');

  const filteredCrops = GAP_CROPS_DATABASE.filter(crop => crop.duration <= gapDays + 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Module Title Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', background: 'linear-gradient(135deg, rgba(14,34,22,0.95) 0%, rgba(6,20,13,0.95) 100%)', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.65rem', borderRadius: '14px', color: '#34d399', boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' }}>
            <Sprout size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>Inter-Season Rotation & Zaid Crop Advisor</h2>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>जायद एवं अंतर-फसल समृद्धि</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Maximize land productivity and revenue during 30–90 day idle windows between Rabi harvest and Kharif sowing.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.2fr', gap: '1.5rem' }}>
        
        {/* Interactive Parameter Controls */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Zap size={18} color="var(--primary)" /> Farm Rotation Parameters
          </h3>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Available Rotation Window:</span>
              <strong style={{ color: 'var(--primary)' }}>{gapDays} Days</strong>
            </label>
            <input 
              type="range" 
              min="40" 
              max="90" 
              value={gapDays} 
              onChange={(e) => setGapDays(Number(e.target.value))}
              style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>40 Days (Short)</span>
              <span>65 Days (Zaid Standard)</span>
              <span>90 Days (Extended)</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cultivable Area (Acres):</span>
              <strong style={{ color: 'var(--accent-gold)' }}>{landSize} Acres</strong>
            </label>
            <input 
              type="range" 
              min="0.5" 
              max="10" 
              step="0.5"
              value={landSize} 
              onChange={(e) => setLandSize(Number(e.target.value))}
              style={{ accentColor: 'var(--accent-gold)', cursor: 'pointer', width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Soil Classification:</label>
            <select className="form-select" value={soilType} onChange={(e) => setSoilType(e.target.value)}>
              <option value="Alluvial">Alluvial Soil (जलोढ़ मिट्टी)</option>
              <option value="Loamy">Loamy Soil (दोमट मिट्टी)</option>
              <option value="Black Cotton">Black Cotton Soil (काली मिट्टी)</option>
              <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Irrigation System:</label>
            <select className="form-select" value={irrigation} onChange={(e) => setIrrigation(e.target.value)}>
              <option value="BOREWELL">Tubewell / Borewell (Assured)</option>
              <option value="CANAL">Canal Water (Seasonal)</option>
              <option value="DRIP">Drip / Micro-Irrigation</option>
              <option value="RAIN_FED">Rainfed (Monsoon Dependent)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Preceding Harvested Crop:</label>
            <select className="form-select" value={previousCrop} onChange={(e) => setPreviousCrop(e.target.value)}>
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Mustard">Mustard (सरसों)</option>
              <option value="Potato">Potato (आलू)</option>
            </select>
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            <span style={{ color: '#34d399', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>💡 Soil Regeneration Strategy:</span>
            Rotational pulses add atmospheric nitrogen to soil, reducing chemical fertilizer cost for the upcoming Kharif Paddy crop.
          </div>
        </div>

        {/* AI Recommendations Output Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award color="var(--accent-gold)" /> Recommended High-Value Rotational Crops ({filteredCrops.length} Matches)
            </h3>
            <span className="badge badge-success">AI Suitability Score Active</span>
          </div>

          {filteredCrops.map((crop, index) => {
            const totalInvestment = Math.round(crop.investmentPerAcre * landSize);
            const totalGross = Math.round(crop.grossRevenue * landSize);
            const totalNet = Math.round(crop.netProfit * landSize);
            const roiPercent = Math.round((totalNet / totalInvestment) * 100);

            return (
              <div key={crop.id} className="glass-card" style={{ border: index === 0 ? '2px solid #10b981' : '1px solid var(--border-color)', position: 'relative' }}>
                
                {index === 0 && (
                  <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.85rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}>
                    🏆 #1 Recommended High-Profit Crop
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.35rem' }}>{crop.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={15} color="var(--primary)" /> Maturity Window: <strong style={{ color: '#fff' }}>{crop.duration} Days</strong> | 
                      Optimal Period: {crop.bestGapWindow}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Projected Net Profit ({landSize} Acres):</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', fontFamily: 'Outfit' }}>
                      ₹{totalNet.toLocaleString()}
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Expected ROI: +{roiPercent}%</span>
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', background: 'rgba(6, 20, 13, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Cost</span>
                    <strong style={{ fontSize: '0.95rem', color: '#f87171' }}>₹{totalInvestment.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Expected Yield</span>
                    <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{(crop.expectedYieldPerAcre * landSize).toFixed(1)} Quintals</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Market MSP / Price</span>
                    <strong style={{ fontSize: '0.95rem', color: '#fbbf24' }}>₹{crop.marketPricePerQuintal}/qnt</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Risk Index</span>
                    <strong style={{ fontSize: '0.95rem', color: crop.riskScore < 25 ? '#4ade80' : '#fbbf24' }}>{crop.riskScore}/100 (Optimal)</strong>
                  </div>
                </div>

                {/* Nitrogen & Soil Benefits */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4ade80', background: 'rgba(34, 197, 94, 0.12)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <Leaf size={16} />
                  <span><strong>Soil Health & Bio-Nutrient Impact:</strong> {crop.nitrogenFixation}</span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
