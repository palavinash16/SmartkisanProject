import React, { useState } from 'react';
import { ML_MODEL_COMPARISON } from '../data/mockData';
import LandUnitInput from './LandUnitInput';
import { TrendingUp, Cpu, DollarSign, Calculator, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProfitPredictor({ farmerProfile }) {
  const [selectedCrop, setSelectedCrop] = useState('Paddy (धान)');
  const [landArea, setLandArea] = useState(farmerProfile?.landAcres ? parseFloat(farmerProfile.landAcres) : 3.5);
  const [selectedModel, setSelectedModel] = useState('XGBoost Regressor (Selected Primary)');
  const [inputCostFactor, setInputCostFactor] = useState(1.0);

  // Dynamic calculations based on inputs
  const cropData = {
    'Paddy (धान)': { baseYield: 24, pricePerQnt: 2183, costPerAcre: 18500 },
    'Wheat (गेहूं)': { baseYield: 21, pricePerQnt: 2275, costPerAcre: 16200 },
    'Summer Moong (मूंग)': { baseYield: 6.5, pricePerQnt: 8550, costPerAcre: 6500 },
    'Tomato (टमाटर)': { baseYield: 120, pricePerQnt: 1850, costPerAcre: 42000 },
    'Mustard (सरसों)': { baseYield: 11, pricePerQnt: 5650, costPerAcre: 12500 }
  }[selectedCrop];

  const predictedYield = (cropData.baseYield * landArea * (selectedModel.includes('XGBoost') ? 1.05 : selectedModel.includes('Random Forest') ? 0.98 : 1.01)).toFixed(1);
  const totalCost = Math.round(cropData.costPerAcre * landArea * inputCostFactor);
  const totalRevenue = Math.round(predictedYield * cropData.pricePerQnt);
  const netProfit = totalRevenue - totalCost;
  const breakEvenYield = (totalCost / cropData.pricePerQnt).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', background: 'linear-gradient(135deg, rgba(14,34,22,0.9) 0%, rgba(6,20,13,0.9) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.5rem', borderRadius: '10px', color: '#fbbf24' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Module 2: Profit Prediction Engine</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Machine Learning pre-sowing profit simulator comparing XGBoost, Random Forest, LightGBM, and Deep Neural Networks.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem' }}>
        
        {/* Input Form Controls */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calculator size={18} color="var(--accent-gold)" /> Pre-Sowing Parameters
          </h3>

          <div className="form-group">
            <label className="form-label">Select Crop:</label>
            <select className="form-select" value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
              <option value="Paddy (धान)">Paddy (धान)</option>
              <option value="Wheat (गेहूं)">Wheat (गेहूं)</option>
              <option value="Summer Moong (मूंग)">Summer Moong (मूंग)</option>
              <option value="Tomato (टमाटर)">Tomato (टमाटर)</option>
              <option value="Mustard (सरसों)">Mustard (सरसों)</option>
            </select>
          </div>

          <div className="form-group">
            <LandUnitInput 
              valueInAcres={landArea}
              onChangeAcres={(acres) => setLandArea(acres)}
              label="Land Size Converter (एकड़ / बीघा / बिस्वा)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">ML Model Selection:</label>
            <select className="form-select" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
              {ML_MODEL_COMPARISON.models.map((m, idx) => (
                <option key={idx} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Fertilizer/Labor Inflation Multiplier:</span>
              <strong style={{ color: '#fbbf24' }}>{inputCostFactor.toFixed(2)}x</strong>
            </label>
            <input 
              type="range" 
              min="0.8" 
              max="1.5" 
              step="0.05"
              value={inputCostFactor} 
              onChange={(e) => setInputCostFactor(Number(e.target.value))}
              style={{ accentColor: '#fbbf24', cursor: 'pointer', width: '100%' }}
            />
          </div>

        </div>

        {/* Financial Forecast Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(14,34,22,0.95) 0%, rgba(6,20,13,0.95) 100%)', border: '1px solid var(--border-glow)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Estimated Financial Summary ({selectedCrop})
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(6, 20, 13, 0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Cost</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f87171', fontFamily: 'Outfit' }}>
                  ₹{totalCost.toLocaleString()}
                </div>
              </div>

              <div style={{ background: 'rgba(6, 20, 13, 0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expected Gross Revenue</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'Outfit' }}>
                  ₹{totalRevenue.toLocaleString()}
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Net Profit (Estimated)</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', fontFamily: 'Outfit' }}>
                  ₹{netProfit.toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-main)', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div><strong style={{ color: 'var(--primary)' }}>Yield Prediction:</strong> {predictedYield} Quintals</div>
              <div><strong style={{ color: 'var(--accent-gold)' }}>Break-even Yield:</strong> {breakEvenYield} Quintals</div>
              <div><strong style={{ color: '#60a5fa' }}>Confidence Score:</strong> 94.2%</div>
            </div>
          </div>

          {/* Machine Learning Model Comparison Matrix */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="var(--primary)" /> Machine Learning Model Evaluation Matrix
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ML_MODEL_COMPARISON.models.map((m, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    padding: '0.85rem 1rem', 
                    borderRadius: 'var(--radius-sm)', 
                    background: selectedModel === m.name ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 20, 13, 0.5)',
                    border: selectedModel === m.name ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    alignItems: 'center',
                    gap: '1rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedModel(m.name)}
                >
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>{m.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.pros}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>R² Accuracy</span>
                    <strong style={{ fontSize: '0.85rem', color: '#4ade80' }}>{(m.r2Score * 100).toFixed(1)}%</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>MAE Error</span>
                    <span style={{ fontSize: '0.85rem', color: '#fff' }}>{m.mae}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${m.status.includes('Recommended') ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>
                      {m.status.includes('Recommended') ? 'Production Ready' : 'Candidate'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
