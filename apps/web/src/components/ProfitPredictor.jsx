import React, { useState } from 'react';
import { ML_MODEL_COMPARISON } from '../data/mockData';
import { TrendingUp, Cpu, DollarSign, Calculator, Layers, AlertCircle, CheckCircle2, BarChart2 } from 'lucide-react';

export default function ProfitPredictor() {
  const [selectedCrop, setSelectedCrop] = useState('Paddy (धान)');
  const [landArea, setLandArea] = useState(3.0);
  const [selectedModel, setSelectedModel] = useState('XGBoost Regressor (Selected Primary)');
  const [inputCostFactor, setInputCostFactor] = useState(1.0);

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
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', background: 'linear-gradient(135deg, rgba(14,34,22,0.95) 0%, rgba(6,20,13,0.95) 100%)', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.65rem', borderRadius: '14px', color: '#fbbf24', boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>Harvest Revenue Simulator & Financial Intelligence</h2>
              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>आय एवं वित्तीय विश्लेषण</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Pre-sowing financial forecasting comparing XGBoost, Random Forest, LightGBM, and Deep Neural Networks.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem' }}>
        
        {/* Input Form Controls */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Calculator size={18} color="var(--accent-gold)" /> Pre-Sowing Inputs
          </h3>

          <div className="form-group">
            <label className="form-label">Target Crop:</label>
            <select className="form-select" value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
              <option value="Paddy (धान)">Paddy (धान)</option>
              <option value="Wheat (गेहूं)">Wheat (गेहूं)</option>
              <option value="Summer Moong (मूंग)">Summer Moong (मूंग)</option>
              <option value="Tomato (टमाटर)">Tomato (टमाटर)</option>
              <option value="Mustard (सरसों)">Mustard (सरसों)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cultivable Land (Acres):</span>
              <strong style={{ color: 'var(--primary)' }}>{landArea} Acres</strong>
            </label>
            <input 
              type="range" 
              min="0.5" 
              max="15" 
              step="0.5"
              value={landArea} 
              onChange={(e) => setLandArea(Number(e.target.value))}
              style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">AI Forecasting Model:</label>
            <select className="form-select" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
              {ML_MODEL_COMPARISON.models.map((m, idx) => (
                <option key={idx} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Input Inflation Index (Labor & Fertilizer):</span>
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
              Financial Yield & Revenue Summary ({selectedCrop})
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(6, 20, 13, 0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Input Cost</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171', fontFamily: 'Outfit' }}>
                  ₹{totalCost.toLocaleString()}
                </div>
              </div>

              <div style={{ background: 'rgba(6, 20, 13, 0.6)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Projected Gross Revenue</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'Outfit' }}>
                  ₹{totalRevenue.toLocaleString()}
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Net Farm Profit</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'Outfit' }}>
                  ₹{netProfit.toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-main)', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div><strong style={{ color: 'var(--primary)' }}>Yield Forecast:</strong> {predictedYield} Quintals</div>
              <div><strong style={{ color: 'var(--accent-gold)' }}>Break-Even Yield:</strong> {breakEvenYield} Quintals</div>
              <div><strong style={{ color: '#60a5fa' }}>AI Model Confidence:</strong> 94.2%</div>
            </div>
          </div>

          {/* Machine Learning Model Comparison Matrix */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="var(--primary)" /> Machine Learning Benchmark Matrix
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
                    <span className={adge } style={{ fontSize: '0.65rem' }}>
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
