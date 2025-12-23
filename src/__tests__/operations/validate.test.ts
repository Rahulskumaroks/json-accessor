import { describe, it, expect } from 'vitest';
import { validate } from '../../operations/validate';

describe('validate()', () => {
  it('should validate required fields', () => {
    const schema = {
      'user.name': { required: true },
      'user.age': { required: true }
    };
    
    const valid = { user: { name: 'Alice', age: 28 } };
    const invalid = { user: { name: 'Alice' } };
    
    expect(validate(valid, schema).valid).toBe(true);
    expect(validate(invalid, schema).valid).toBe(false);
  });

  it('should validate types', () => {
    const schema = {
      'user.name': { type: 'string' as const },
      'user.age': { type: 'number' as const }
    };
    
    const valid = { user: { name: 'Alice', age: 28 } };
    const invalid = { user: { name: 'Alice', age: '28' } };
    
    expect(validate(valid, schema).valid).toBe(true);
    expect(validate(invalid, schema).valid).toBe(false);
  });

  it('should validate numeric ranges', () => {
    const schema = {
      'user.age': { type: 'number' as const, min: 0, max: 150 }
    };
    
    const valid = { user: { age: 28 } };
    const invalid = { user: { age: 200 } };
    
    expect(validate(valid, schema).valid).toBe(true);
    expect(validate(invalid, schema).valid).toBe(false);
  });

  it('should validate string patterns', () => {
    const schema = {
      'user.email': { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    };
    
    const valid = { user: { email: 'alice@example.com' } };
    const invalid = { user: { email: 'invalid-email' } };
    
    expect(validate(valid, schema).valid).toBe(true);
    expect(validate(invalid, schema).valid).toBe(false);
  });

  it('should validate enums', () => {
    const schema = {
      'user.role': { enum: ['admin', 'user', 'guest'] }
    };
    
    const valid = { user: { role: 'admin' } };
    const invalid = { user: { role: 'superuser' } };
    
    expect(validate(valid, schema).valid).toBe(true);
    expect(validate(invalid, schema).valid).toBe(false);
  });

  it('should use custom validators', () => {
    const schema = {
      'user.password': {
        custom: (val:any) => {
          if (typeof val !== 'string') return 'Must be a string';
          if (val.length < 8) return 'Must be at least 8 characters';
          return true;
        }
      }
    };
    
    const valid = { user: { password: 'securePassword123' } };
    const invalid = { user: { password: 'short' } };
    
    expect(validate(valid, schema).valid).toBe(true);
    const result = validate(invalid, schema);
    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toContain('8 characters');
  });
});