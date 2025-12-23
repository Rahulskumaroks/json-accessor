import { describe, it, expect } from 'vitest';
import { flatten, unflatten } from '../../operations/flatten';

describe('flatten()', () => {
  it('should flatten simple object', () => {
    const obj = { a: 1, b: 2 };
    expect(flatten(obj)).toEqual({ a: 1, b: 2 });
  });

  it('should flatten nested object', () => {
    const obj = { user: { name: 'Alice', age: 28 } };
    expect(flatten(obj)).toEqual({
      'user.name': 'Alice',
      'user.age': 28
    });
  });

  it('should flatten arrays', () => {
    const obj = { skills: ['JS', 'TS'] };
    expect(flatten(obj)).toEqual({
      'skills.0': 'JS',
      'skills.1': 'TS'
    });
  });

  it('should flatten deeply nested structures', () => {
    const obj = {
      user: {
        profile: {
          settings: {
            theme: 'dark'
          }
        }
      }
    };
    expect(flatten(obj)).toEqual({
      'user.profile.settings.theme': 'dark'
    });
  });

  it('should handle custom delimiter', () => {
    const obj = { a: { b: 1 } };
    expect(flatten(obj, { delimiter: '/' })).toEqual({ 'a/b': 1 });
  });

  it('should respect maxDepth', () => {
    const obj = { a: { b: { c: 1 } } };
    const result = flatten(obj, { maxDepth: 1 });
    expect(result['a.b']).toEqual({ c: 1 });
  });
});

describe('unflatten()', () => {
  it('should unflatten simple object', () => {
    const flat = { 'user.name': 'Alice', 'user.age': 28 };
    expect(unflatten(flat)).toEqual({
      user: { name: 'Alice', age: 28 }
    });
  });

  it('should unflatten arrays', () => {
    const flat = { 'skills.0': 'JS', 'skills.1': 'TS' };
    expect(unflatten(flat)).toEqual({
      skills: ['JS', 'TS']
    });
  });

  it('should be inverse of flatten', () => {
    const obj = {
      user: { name: 'Alice', age: 28 },
      skills: ['JS', 'TS']
    };
    const flat = flatten(obj);
    const unflat = unflatten(flat);
    expect(unflat).toEqual(obj);
  });
});
