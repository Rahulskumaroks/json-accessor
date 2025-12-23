import { describe, it, expect } from 'vitest';
import { has } from '../../core/has';

describe('has()', () => {
  const testData = {
    user: {
      name: 'Alice',
      age: 28,
      profile: null
    },
    skills: ['JavaScript', 'TypeScript']
  };

  it('should return true for existing property', () => {
    expect(has(testData, 'user.name')).toBe(true);
  });

  it('should return false for non-existent property', () => {
    expect(has(testData, 'user.email')).toBe(false);
  });

  it('should return true for null values', () => {
    expect(has(testData, 'user.profile')).toBe(true);
  });

  it('should return true for array indices', () => {
    expect(has(testData, 'skills[0]')).toBe(true);
  });

  it('should return false for out of bounds indices', () => {
    expect(has(testData, 'skills[10]')).toBe(false);
  });

  it('should return false for null/undefined objects', () => {
    expect(has(null, 'any.path')).toBe(false);
    expect(has(undefined, 'any.path')).toBe(false);
  });
});