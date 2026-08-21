import { describe, it, expect } from 'vitest';
import { TRANSLATIONS, getTranslation } from '../utils/translations';
import { LANGUAGE_REGISTRY, getRecommendedLanguagesForState, searchLanguages } from '../utils/languageRegistry';

describe('SmartKisan Phase 1F.6 Language System & Fallback Hardening', () => {
  it('should strictly fall back to English (en) for missing translation keys', () => {
    // Tamil dictionary exists, but test a non-existent key in Tamil
    const result = getTranslation('ta', 'non_existent_key_xyz_123');
    expect(result).toBe('non_existent_key_xyz_123');
  });

  it('should fall back to English if target language key is absent but exists in English', () => {
    // Mock temporary dictionary check
    const val = getTranslation('ur', 'app_title');
    expect(val).toBe('SmartKisan Agriculture Advisor');
  });

  it('should NEVER fall back to Hindi (hi) when target language is English or regional', () => {
    const enVal = getTranslation('en', 'app_title');
    expect(enVal).not.toBe('स्मार्टकिसान कृषि सलाहकार');
    expect(enVal).toBe('SmartKisan Agriculture Advisor');
  });

  it('should verify exactly 14 SUPPORTED and 9 ENGLISH_FALLBACK languages in registry', () => {
    expect(LANGUAGE_REGISTRY.length).toBe(23);

    const supported = LANGUAGE_REGISTRY.filter(l => l.status === 'SUPPORTED');
    const fallback = LANGUAGE_REGISTRY.filter(l => l.status === 'ENGLISH_FALLBACK');

    expect(supported.length).toBe(14);
    expect(fallback.length).toBe(9);
  });

  it('should verify all Priority 1 regional languages are in SUPPORTED status with full dictionaries', () => {
    const priority1Codes = ['gu', 'ta', 'te', 'kn', 'ml', 'or', 'as'];
    
    priority1Codes.forEach(code => {
      const reg = LANGUAGE_REGISTRY.find(l => l.code === code);
      expect(reg).toBeDefined();
      expect(reg.status).toBe('SUPPORTED');

      expect(TRANSLATIONS[code]).toBeDefined();
      expect(TRANSLATIONS[code].app_title).toBeDefined();
      expect(TRANSLATIONS[code].nav_home).toBeDefined();
      expect(TRANSLATIONS[code].btn_next).toBeDefined();
      expect(TRANSLATIONS[code].select_language).toBeDefined();
    });
  });

  it('should recommend correct regional languages for state selection', () => {
    const pbLangs = getRecommendedLanguagesForState('Punjab').map(l => l.code);
    expect(pbLangs).toContain('pa');
    expect(pbLangs).toContain('hi');
    expect(pbLangs).toContain('en');

    const tnLangs = getRecommendedLanguagesForState('Tamil Nadu').map(l => l.code);
    expect(tnLangs).toContain('ta');
    expect(tnLangs).toContain('en');

    const gjLangs = getRecommendedLanguagesForState('Gujarat').map(l => l.code);
    expect(gjLangs).toContain('gu');
  });

  it('should filter languages accurately using search searchLanguages()', () => {
    const searchTamil = searchLanguages('Tamil');
    expect(searchTamil.some(l => l.code === 'ta')).toBe(true);

    const searchPunjabiScript = searchLanguages('Gurmukhi');
    expect(searchPunjabiScript.some(l => l.code === 'pa')).toBe(true);

    const emptySearch = searchLanguages('');
    expect(emptySearch.length).toBe(23);
  });
});
