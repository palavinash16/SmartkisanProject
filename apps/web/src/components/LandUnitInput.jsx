import React, { useState, useEffect } from 'react';
import { convertLandArea, LAND_UNITS } from '../utils/landConverter';
import { Calculator, ArrowRightLeft, Sparkles } from 'lucide-react';

export default function LandUnitInput({ valueInAcres, onChangeAcres, label = "Land Size / Field Area" }) {
  const [inputValue, setInputValue] = useState(valueInAcres || 3.5);
  const [selectedUnit, setSelectedUnit] = useState('acres');

  // Calculate live conversion metrics
  const converted = convertLandArea(inputValue, selectedUnit);

  // Sync back to parent when input value or unit changes
  useEffect(() => {
    if (onChangeAcres) {
      onChangeAcres(converted.acres);
    }
  }, [inputValue, selectedUnit]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calculator size={14} color="var(--primary)" /> {label}
        </label>
        <span style={{ fontSize: '0.75rem', color: '#2dd4bf', fontWeight: 600 }}>
          Unit Converter Active
        </span>
      </div>

      {/* Input & Unit Select Controls */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="number"
          step="0.1"
          className="form-input"
          style={{ flex: 1.5 }}
          placeholder="e.g. 5"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
        
        <select 
          className="form-select"
          style={{ flex: 1.2, fontWeight: 600, color: '#fbbf24' }}
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
        >
          {LAND_UNITS.map(u => (
            <option key={u.code} value={u.code} style={{ background: '#0a2113', color: '#fff' }}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      {/* Live Equivalent Conversion Badge */}
      <div style={{ 
        background: 'rgba(20, 184, 166, 0.12)', 
        padding: '0.5rem 0.75rem', 
        borderRadius: 'var(--radius-sm)', 
        border: '1px solid rgba(20, 184, 166, 0.3)',
        fontSize: '0.8rem',
        color: '#f8fafc',
        marginTop: '0.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowRightLeft size={13} color="#2dd4bf" />
          <span>Equiv: <strong>{converted.bigha} Bigha</strong> ({converted.biswa} Biswa)</span>
        </div>

        <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>
          = {converted.acres} Acres ({converted.hectare} Ha)
        </span>
      </div>
    </div>
  );
}
