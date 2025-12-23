import type { 
  ValidationSchema, 
  ValidationResult, 
  ValidationError,
} from '../types';
import { flatten } from './flatten';

/**
 * Validates an object against a schema
 * 
 * @example
 * const schema = {
 *   'user.name': { type: 'string', required: true },
 *   'user.age': { type: 'number', min: 0, max: 150 }
 * };
 * 
 * validate({ user: { name: 'Alice', age: 28 } }, schema)
 * // { valid: true, errors: [] }
 * 
 * @param obj - The object to validate
 * @param schema - Validation schema
 * @returns Validation result
 */
export function validate(
  obj: unknown,
  schema: ValidationSchema
): ValidationResult {
  const errors: ValidationError[] = [];
  const flat = flatten(obj);
  
  // Check each schema rule
  Object.entries(schema).forEach(([path, rule]) => {
    const value = flat[path];
    const exists = path in flat;
    
    // Required check
    if (rule.required && !exists) {
      errors.push({
        path,
        message: `Required field '${path}' is missing`
      });
      return;
    }
    
    // Skip further validation if field doesn't exist and not required
    if (!exists) {
      return;
    }
    
    // Type check
    if (rule.type && rule.type !== 'any') {
      const actualType = Array.isArray(value) ? 'array' : 
                        value === null ? 'null' : 
                        typeof value;
      
      if (actualType !== rule.type) {
        errors.push({
          path,
          message: `Expected type '${rule.type}' but got '${actualType}'`,
          value
        });
      }
    }
    
    // String/Array length checks
    if (typeof value === 'string' || Array.isArray(value)) {
      if (rule.min !== undefined && value.length < rule.min) {
        errors.push({
          path,
          message: `Length must be at least ${rule.min}`,
          value
        });
      }
      if (rule.max !== undefined && value.length > rule.max) {
        errors.push({
          path,
          message: `Length must be at most ${rule.max}`,
          value
        });
      }
    }
    
    // Numeric range checks
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push({
          path,
          message: `Value must be at least ${rule.min}`,
          value
        });
      }
      if (rule.max !== undefined && value > rule.max) {
        errors.push({
          path,
          message: `Value must be at most ${rule.max}`,
          value
        });
      }
    }
    
    // Pattern check
    if (rule.pattern && typeof value === 'string') {
      if (!rule.pattern.test(value)) {
        errors.push({
          path,
          message: `Value does not match pattern ${rule.pattern}`,
          value
        });
      }
    }
    
    // Enum check
    if (rule.enum && rule.enum.length > 0) {
      const matches = rule.enum.some(
        enumVal => JSON.stringify(enumVal) === JSON.stringify(value)
      );
      if (!matches) {
        errors.push({
          path,
          message: `Value must be one of: ${rule.enum.map(v => JSON.stringify(v)).join(', ')}`,
          value
        });
      }
    }
    
    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value);
      if (result !== true) {
        errors.push({
          path,
          message: typeof result === 'string' ? result : 'Custom validation failed',
          value
        });
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
