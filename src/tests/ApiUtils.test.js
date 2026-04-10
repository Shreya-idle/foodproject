import { describe, it, expect } from 'vitest';
import { analyzeChemicalRisks, checkHealthLimits } from '../utils/api';

describe('ChemicalRiskAnalyzer', () => {
  it('should detect Aspartame in ingredients', () => {
    const risks = analyzeChemicalRisks('sugar, water, aspartame, citric acid');
    expect(risks.length).toBeGreaterThan(0);
    expect(risks.find(r => r.name === 'Aspartame')).toBeDefined();
  });

  it('should detect MSG by E-number', () => {
    const risks = analyzeChemicalRisks('salt, spices, flavour enhancer (e621), sugar');
    expect(risks.find(r => r.name === 'MSG')).toBeDefined();
  });

  it('should detect multiple chemicals', () => {
    const risks = analyzeChemicalRisks('sugar, aspartame, tartrazine, sodium benzoate');
    expect(risks.length).toBe(3); // Aspartame, Yellow 5 (tartrazine), Sodium Benzoate
  });

  it('should return empty for clean ingredients', () => {
    const risks = analyzeChemicalRisks('whole wheat flour, water, salt, olive oil');
    expect(risks.length).toBe(0);
  });

  it('should handle empty/null input', () => {
    expect(analyzeChemicalRisks('')).toEqual([]);
    expect(analyzeChemicalRisks(null)).toEqual([]);
  });
});

describe('HealthLimitChecker', () => {
  it('should warn diabetics about high sugar', () => {
    const warnings = checkHealthLimits({ sugars: 20 }, ['diabetes']);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0].type).toBe('danger');
    expect(warnings[0].message).toContain('sugar');
  });

  it('should warn hypertension patients about salt', () => {
    const warnings = checkHealthLimits({ salt: 2.0 }, ['hypertension']);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0].type).toBe('danger');
    expect(warnings[0].message).toContain('salt');
  });

  it('should warn heart patients about saturated fat', () => {
    const warnings = checkHealthLimits({ saturatedFat: 8, fat: 20 }, ['heart']);
    expect(warnings.length).toBe(3); // sat fat danger + heart fat warning + universal fat warning
  });

  it('should return no warnings for safe nutrients', () => {
    const warnings = checkHealthLimits({ sugars: 3, salt: 0.5, fat: 5, saturatedFat: 1, calories: 150 }, ['diabetes', 'hypertension']);
    expect(warnings.length).toBe(0);
  });

  it('should handle no conditions', () => {
    const warnings = checkHealthLimits({ sugars: 50 }, []);
    // Only universal checks should fire (sugars > 22.5)
    expect(warnings.some(w => w.message.includes('Extremely high sugar'))).toBe(true);
  });
});
