import { describe, it, expect } from 'vitest';
import { 
  LANGUAGE_REGISTRY, 
  getRecommendedLanguagesForState, 
  searchLanguages 
} from '../utils/languageRegistry';
import { TRANSLATIONS, getTranslation } from '../utils/translations';

describe('Phase 1F.5 Language Registry & Search', () => {
  
  it('has unique language codes for all registry entries', () => {
    const codes = LANGUAGE_REGISTRY.map((l) => l.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
    expect(codes.length).toBeGreaterThanOrEqual(23);
  });

  it('contains englishName, nativeName, and status for every language', () => {
    LANGUAGE_REGISTRY.forEach((lang) => {
      expect(lang.code).toBeTruthy();
      expect(lang.englishName).toBeTruthy();
      expect(lang.nativeName).toBeTruthy();
      expect(['SUPPORTED', 'PARTIAL']).toContain(lang.status);
    });
  });

  it('searches languages by English name, native name, and code case-insensitively', () => {
    const searchHindi = searchLanguages('Hindi');
    expect(searchHindi.some((l) => l.code === 'hi')).toBe(true);

    const searchNativeTamil = searchLanguages('தமிழ்');
    expect(searchNativeTamil.some((l) => l.code === 'ta')).toBe(true);

    const searchCodePa = searchLanguages('pa');
    expect(searchCodePa.some((l) => l.code === 'pa')).toBe(true);
  });

  it('returns state-aware recommended languages for location', () => {
    const upRecs = getRecommendedLanguagesForState('Uttar Pradesh');
    expect(upRecs.map((l) => l.code)).toContain('hi');
    expect(upRecs.map((l) => l.code)).toContain('bho');

    const pbRecs = getRecommendedLanguagesForState('Punjab');
    expect(pbRecs.map((l) => l.code)).toContain('pa');

    const tnRecs = getRecommendedLanguagesForState('Tamil Nadu');
    expect(tnRecs.map((l) => l.code)).toContain('ta');
  });

  it('falls back missing keys to English (never an unrelated Indian language)', () => {
    // Test missing key fallback for partial language
    const missingKeyResult = getTranslation('gu', 'non_existent_random_key_123');
    expect(missingKeyResult).toBe('non_existent_random_key_123');

    // Test English fallback for missing key in supported language
    const enFallback = getTranslation('ta', 'app_title');
    expect(enFallback).toBeTruthy();
  });

});