import { describe, it, expect } from 'vitest';
import { search } from '../../operations/search';

describe('search()', () => {
  const testData = {
    user: {
      name: 'Alice Johnson',
      age: 28,
      email: 'alice@example.com'
    },
    admin: {
      name: 'Bob Smith',
      age: 35
    },
    settings: {
      theme: 'dark',
      notifications: true
    }
  };

  it('should find by type', () => {
    const results = search(testData, { type: 'number' });
    expect(results).toHaveLength(2);
    expect(results.map(r => r.value)).toContain(28);
    expect(results.map(r => r.value)).toContain(35);
  });

  it('should find by key includes', () => {
    const results = search(testData, { keyIncludes: 'name' });
    expect(results).toHaveLength(2);
    expect(results.map(r => r.path)).toContain('user.name');
    expect(results.map(r => r.path)).toContain('admin.name');
  });

  it('should find by value includes', () => {
    const results = search(testData, { valueIncludes: 'alice' });
    expect(results).toHaveLength(1);
    expect(results[0].path).toBe('user.email');
  });

  it('should find by numeric range', () => {
    const results = search(testData, { valueGt: 30 });
    expect(results).toHaveLength(1);
    expect(results[0].value).toBe(35);
  });

  it('should combine multiple criteria', () => {
    const results = search(testData, {
      type: 'number',
      valueLt: 30
    });
    expect(results).toHaveLength(1);
    expect(results[0].value).toBe(28);
  });

  it('should find by exact value', () => {
    const results = search(testData, { valueEquals: true });
    expect(results).toHaveLength(1);
    expect(results[0].path).toBe('settings.notifications');
  });
});