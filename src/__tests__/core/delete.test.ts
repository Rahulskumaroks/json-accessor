import { describe, it, expect } from 'vitest';
import { del } from '../../core/delete';

describe('del()', () => {
  const testData = {
    user: {
      name: 'Alice',
      age: 28,
      email: 'alice@example.com'
    },
    skills: ['JavaScript', 'TypeScript', 'React']
  };

  it('should delete existing property (immutable)', () => {
    const result = del(testData, 'user.email');
    expect(result.user.email).toBeUndefined();
    expect(testData.user.email).toBe('alice@example.com');
  });

  it('should delete existing property (mutable)', () => {
    const data = { user: { email: 'test@example.com' } };
    const result = del(data, 'user.email', { immutable: false });
    expect(result.user.email).toBeUndefined();
    expect(data.user.email).toBeUndefined();
  });

  it('should delete array element', () => {
    const result = del(testData, 'skills[1]');
    expect(result.skills).toEqual(['JavaScript', 'React']);
    expect(testData.skills).toEqual(['JavaScript', 'TypeScript', 'React']);
  });

  it('should handle non-existent path gracefully', () => {
    const result = del(testData, 'user.phone');
    expect(result).toEqual(testData);
  });

  it('should cleanup empty parent objects', () => {
    const data = { a: { b: { c: 'value' } } };
    const result = del(data, 'a.b.c', { cleanupEmpty: true });
    expect(result).toEqual({});
  });

  it('should not cleanup non-empty parents', () => {
    const data = { a: { b: { c: 'value' }, d: 'keep' } };
    const result = del(data, 'a.b.c', { cleanupEmpty: true });
    expect(result).toEqual({ a: { b: {}, d: 'keep' } });
  });
});