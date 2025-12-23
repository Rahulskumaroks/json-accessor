import { describe, it, expect } from 'vitest';
import { set } from '../../core/set';

describe('set()', () => {
  const testData = {
    user: {
      name: 'Alice',
      age: 28
    },
    skills: ['JavaScript', 'TypeScript']
  };

  it('should set existing property (immutable)', () => {
    const result = set(testData, 'user.age', 29);
    expect(result.user.age).toBe(29);
    expect(testData.user.age).toBe(28); // Original unchanged
  });

  it('should set existing property (mutable)', () => {
    const data = { user: { age: 28 } };
    const result = set(data, 'user.age', 29, { immutable: false });
    expect(result.user.age).toBe(29);
    expect(data.user.age).toBe(29); // Original changed
  });

  it('should create new nested property', () => {
    const result = set(testData, 'user.email', 'alice@example.com');
    expect((result.user as any).email).toBe('alice@example.com');
    expect((testData.user as any).email).toBeUndefined();
  });

  it('should create deeply nested structure', () => {
    const result = set({}, 'user.profile.avatar.url', 'https://example.com');
    expect(result).toEqual({
      user: {
        profile: {
          avatar: {
            url: 'https://example.com'
          }
        }
      }
    });
  });

  it('should set array element', () => {
    const result = set(testData, 'skills[1]', 'Python');
    expect(result.skills[1]).toBe('Python');
    expect(testData.skills[1]).toBe('TypeScript');
  });

  it('should auto-create arrays when path contains numeric index', () => {
    const result = set({}, 'items[0]', 'first');
    expect(Array.isArray((result as any).items)).toBe(true);
    expect((result as any).items[0]).toBe('first');
  });

  it('should handle mixed object and array paths', () => {
    const result = set({}, 'users[0].name', 'Alice');
    expect(result).toEqual({
      users: [{ name: 'Alice' }]
    });
  });

  it('should overwrite non-object values', () => {
    const data = { value: 'string' };
    const result = set(data, 'value.nested', 'test');
    expect((result.value as any).nested).toBe('test');
  });
});
