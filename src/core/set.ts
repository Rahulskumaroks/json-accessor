import type { JsonValue, MutationOptions } from '../types';
import { normalizePath, isArrayIndex, deepClone, isTraversable } from '../utils/path';

/**
 * Sets a value at the specified path
 * Auto-creates missing nested structures
 * Returns a new object by default (immutable)
 * 
 * @example
 * const data = { user: { name: 'Alice' } };
 * 
 * // Immutable (default)
 * const updated = set(data, 'user.age', 28);
 * // data is unchanged, updated is new object
 * 
 * // Mutable
 * set(data, 'user.age', 28, { immutable: false });
 * // data is modified in place
 * 
 * // Auto-creates nested structures
 * set({}, 'user.profile.avatar', 'url')
 * // { user: { profile: { avatar: 'url' } } }
 * 
 * @param obj - The object to modify
 * @param path - The path where to set the value
 * @param value - The value to set
 * @param options - Configuration options
 * @returns Modified object (new or same depending on immutable flag)
 */
export function set<T = unknown>(
  obj: T,
  path: string,
  value: JsonValue,
  options: MutationOptions = {}
): T {
  const { immutable = true } = options;
  const parts = normalizePath(path);
  
  if (parts.length === 0) {
    return value as T;
  }
  
  // Clone if immutable mode
  const result = immutable ? deepClone(obj) : obj;
  
  // Ensure result is an object
  let current: Record<string, unknown> | unknown[];
  if (!isTraversable(result)) {
    const firstKey = parts[0];
    if (isArrayIndex(firstKey)) {
      current = [];
    } else {
      current = {};
    }
  } else {
    current = result as Record<string, unknown> | unknown[];
  }
  
  // Traverse and create missing structures
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    
    // Check if we need to create a new structure
    const currentValue = (current as Record<string, unknown>)[part];
    
    if (!isTraversable(currentValue)) {
      // Decide if next level should be array or object
      if (isArrayIndex(nextPart)) {
        (current as Record<string, unknown>)[part] = [];
      } else {
        (current as Record<string, unknown>)[part] = {};
      }
    }
    
    current = (current as Record<string, unknown>)[part] as Record<string, unknown> | unknown[];
  }
  
  // Set the final value
  const lastPart = parts[parts.length - 1];
  (current as Record<string, unknown>)[lastPart] = value;
  
  return (isTraversable(result) ? result : current) as T;
}

