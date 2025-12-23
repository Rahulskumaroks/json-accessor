import type { TargetType, TypeTransformResult, JsonValue } from '../types';
import { get } from '../core/get';
import { set } from '../core/set';

/**
 * Safely transforms a value at a path to a different type
 * 
 * @example
 * changeType({ age: '28' }, 'age', 'number')
 * // { age: 28 }
 * 
 * changeType({ tags: 'js,ts' }, 'tags', 'array')
 * // { tags: ['js', 'ts'] }
 * 
 * @param obj - The object containing the value
 * @param path - Path to the value to transform
 * @param targetType - The desired type
 * @returns Transform result with success status
 */
export function changeType<T = unknown>(
  obj: T,
  path: string,
  targetType: TargetType
): TypeTransformResult {
  const value = get(obj, path);
  
  if (value === undefined) {
    return {
      success: false,
      error: `Path '${path}' does not exist`
    };
  }
  
  try {
    const transformed = transformValue(value, targetType);
    return {
      success: true,
      value: set(obj, path, transformed) as JsonValue
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transformation failed'
    };
  }
}

/**
 * Transforms a single value to target type
 */
function transformValue(value: JsonValue, targetType: TargetType): JsonValue {
  const currentType = Array.isArray(value) ? 'array' : 
                     value === null ? 'null' : 
                     typeof value;
  
  // Already correct type
  if (currentType === targetType) {
    return value;
  }
  
  switch (targetType) {
    case 'string':
      return String(value);
      
    case 'number': {
      if (typeof value === 'string') {
        const num = Number(value);
        if (isNaN(num)) {
          throw new Error(`Cannot convert '${value}' to number`);
        }
        return num;
      }
      if (typeof value === 'boolean') {
        return value ? 1 : 0;
      }
      throw new Error(`Cannot convert ${currentType} to number`);
    }
    
    case 'boolean': {
      if (typeof value === 'string') {
        const lower = value.toLowerCase();
        if (lower === 'true' || lower === '1') return true;
        if (lower === 'false' || lower === '0') return false;
        throw new Error(`Cannot convert '${value}' to boolean`);
      }
      if (typeof value === 'number') {
        return value !== 0;
      }
      return Boolean(value);
    }
    
    case 'array': {
      if (typeof value === 'string') {
        // Try to split by common delimiters
        return value.split(/[,;\s]+/).filter(Boolean);
      }
      return [value];
    }
    
    case 'object': {
      if (Array.isArray(value)) {
        // Convert array to object with indices as keys
        return value.reduce((acc: Record<string | number, JsonValue>, item, i) => {
          acc[i] = item;
          return acc;
        }, {});
      }
      throw new Error(`Cannot convert ${currentType} to object`);
    }
    
    case 'null':
      return null;
      
    default:
      throw new Error(`Unknown target type: ${targetType}`);
  }
}