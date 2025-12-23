import { describe, it, expect } from 'vitest';
import { diff, applyDiff } from '../../operations/diff';

describe('diff()', () => {
  it('should detect added properties', () => {
    const oldObj = { user: { name: 'Alice' } };
    const newObj = { user: { name: 'Alice', age: 28 } };
    const changes = diff(oldObj, newObj);
    
    expect(changes).toContainEqual({
      op: 'add',
      path: 'user.age',
      newValue: 28
    });
  });

  it('should detect removed properties', () => {
    const oldObj = { user: { name: 'Alice', age: 28 } };
    const newObj = { user: { name: 'Alice' } };
    const changes = diff(oldObj, newObj);
    
    expect(changes).toContainEqual({
      op: 'remove',
      path: 'user.age',
      oldValue: 28
    });
  });

  it('should detect changed values', () => {
    const oldObj = { user: { age: 28 } };
    const newObj = { user: { age: 29 } };
    const changes = diff(oldObj, newObj);
    
    expect(changes).toContainEqual({
      op: 'replace',
      path: 'user.age',
      oldValue: 28,
      newValue: 29
    });
  });

  it('should return empty array for identical objects', () => {
    const obj = { user: { name: 'Alice' } };
    const changes = diff(obj, obj);
    expect(changes).toEqual([]);
  });
});

describe('applyDiff()', () => {
  it('should apply add operations', () => {
    const obj = { user: { name: 'Alice' } };
    const diffs = [{ op: 'add' as const, path: 'user.age', newValue: 28 }];
    const result = applyDiff(obj, diffs);
    expect((result.user as any).age).toBe(28);
  });

  it('should apply remove operations', () => {
    const obj = { user: { name: 'Alice', age: 28 } };
    const diffs = [{ op: 'remove' as const, path: 'user.age', oldValue: 28 }];
    const result = applyDiff(obj, diffs);
    expect(result.user.age).toBeUndefined();
  });

  it('should apply multiple operations', () => {
    const obj = { user: { name: 'Alice', age: 28 } };
    const diffs = [
      { op: 'replace' as const, path: 'user.age', oldValue: 28, newValue: 29 },
      { op: 'add' as const, path: 'user.city', newValue: 'NYC' }
    ];
    const result = applyDiff(obj, diffs);
    expect(result.user.age).toBe(29);
    expect((result.user as any).city).toBe('NYC');
  });
});