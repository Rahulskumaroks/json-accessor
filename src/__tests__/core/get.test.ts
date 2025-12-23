import { describe, it, expect } from 'vitest';
import { get } from '../../core/get';

describe('get()', () => {
  const testData = {
    user: {
      name: 'Alice',
      age: 28,
      email: 'alice@example.com'
    },
    skills: ['JavaScript', 'TypeScript', 'React'],
    education: {
      degrees: [
        { level: 'BS', year: 2015 },
        { level: 'MS', year: 2017 }
      ]
    }
  };

  it('should get simple property', () => {
    expect(get(testData, 'user.name')).toBe('Alice');
  });

  it('should get nested property', () => {
    expect(get(testData, 'user.age')).toBe(28);
  });

  it('should get array element by index', () => {
    expect(get(testData, 'skills[0]')).toBe('JavaScript');
    expect(get(testData, 'skills.1')).toBe('TypeScript');
  });

  it('should get deeply nested property', () => {
    expect(get(testData, 'education.degrees[0].level')).toBe('BS');
    expect(get(testData, 'education.degrees.1.year')).toBe(2017);
  });

  it('should return undefined for non-existent path', () => {
    expect(get(testData, 'user.phone')).toBeUndefined();
    expect(get(testData, 'invalid.path')).toBeUndefined();
  });

  it('should return undefined for out of bounds array index', () => {
    expect(get(testData, 'skills[99]')).toBeUndefined();
  });

  it('should handle null and undefined objects', () => {
    expect(get(null, 'any.path')).toBeUndefined();
    expect(get(undefined, 'any.path')).toBeUndefined();
  });

  it('should return entire object for empty path', () => {
    expect(get(testData, '')).toEqual(testData);
  });

  it('should handle bracket notation', () => {
    expect(get(testData, 'skills[0]')).toBe('JavaScript');
    expect(get(testData, 'education.degrees[1].level')).toBe('MS');
  });
});