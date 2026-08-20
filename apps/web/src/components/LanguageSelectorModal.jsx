import React, { useState } from 'react';
import { 
  LANGUAGE_REGISTRY, 
  getRecommendedLanguagesForState, 
  searchLanguages 
} from '../utils/languageRegistry';
import { Search, Globe, Check, Star, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LanguageSelectorModal({ 
  currentState = 'Uttar Pradesh', 
  currentLang = 'hi', 
  onSelectLanguage, 
  onClose,
  isFirstLaunch = false
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCode, setSelectedCode] = useState(currentLang);

  const recommendedList = getRecommendedLanguagesForState(currentState);
  const filteredLanguages = searchLanguages(searchQuery);

  const handleApply = (code) => {
    setSelectedCode(code);
    onSelectLanguage(code);
    if (onClose) onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        position: 'relative'
      }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.45rem', borderRadius: '10px' }}>
              <Globe size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>
                अपनी भाषा चुनें / Choose Language
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {isFirstLaunch ? 'SmartKisan mein aapka swagat hai!' : 'Location-aware local language selector'}
              </span>
            </div>
          </div>

          {!isFirstLaunch && onClose && (
            <button 
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Live Search Input */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem', fontSize: '0.9rem' }}
            placeholder="🔍 भाषा खोजें / Search language (e.g. Hindi, Tamil, ਪੰਜਾਬੀ)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Scrollable Language List */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Section 1: Recommended for Location (Only when not searching) */}
          {!searchQuery && (
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Star size={14} color="#059669" fill="#059669" />
                <span>आपके क्षेत्र के लिए सुझाई गई ({currentState}) / Recommended</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                {recommendedList.map((lang) => {
                  const isSelected = selectedCode === lang.code;
                  return (
                    <button 
                      key={`rec_${lang.code}`}
                      onClick={() => handleApply(lang.code)}
                      style={{
                        textAlign: 'left',
                        padding: '0.65rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '2px solid #059669' : '1px solid #cbd5e1',
                        background: isSelected ? '#f0fdf4' : '#f8faf8',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.1rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                          {lang.nativeName}
                        </span>
                        {isSelected && <Check size={16} color="#059669" />}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {lang.englishName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: All Languages */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
              {searchQuery ? `खोज परिणाम (${filteredLanguages.length})` : 'सभी भाषाएँ / All Languages'}
            </div>

            {filteredLanguages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>
                कोई भाषा नहीं मिली / No language found matching "{searchQuery}"
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {filteredLanguages.map((lang) => {
                  const isSelected = selectedCode === lang.code;
                  return (
                    <button 
                      key={lang.code}
                      onClick={() => handleApply(lang.code)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                        background: isSelected ? '#ecfdf5' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: isSelected ? '#059669' : '#0f172a' }}>
                            {lang.nativeName}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            ({lang.englishName})
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                          Script: {lang.script} {lang.status === 'PARTIAL' ? '• English fallback' : ''}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {lang.status === 'SUPPORTED' ? (
                          <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>VERIFIED</span>
                        ) : (
                          <span style={{ fontSize: '0.65rem', background: '#f1f5f9', color: '#64748b', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>ENGLISH FALLBACK</span>
                        )}
                        {isSelected && <Check size={18} color="#059669" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          {!isFirstLaunch && onClose && (
            <button onClick={onClose} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
              बंद करें / Close
            </button>
          )}
          <button 
            onClick={() => handleApply(selectedCode)}
            className="btn btn-primary"
            style={{ fontSize: '0.875rem' }}
          >
            <span>जारी रखें / Continue</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}