import type { JsonValue, FlattenOptions, JsonArray, JsonObject } from '../types';
import { isTraversable } from '../utils/path';

/**
 * Flattens a nested object into a single-level object with path keys
 * Supports arrays and configurable delimiter
 * 
 * @example
 * flatten({ user: { name: 'Alice', skills: ['JS', 'TS'] } })
 * // { 'user.name': 'Alice', 'user.skills.0': 'JS', 'user.skills.1': 'TS' }
 * 
 * @param obj - The object to flatten
 * @param options - Configuration options
 * @returns Flattened object with path keys
 */
export function flatten(
  obj: unknown,
  options: FlattenOptions = {}
): Record<string, JsonValue> {
  const { delimiter = '.', maxDepth = Infinity } = options;
  const result: Record<string, JsonValue> = {};
  
  function recurse(current: unknown, path: string, depth: number): void {
    // Handle max depth
    if (depth >= maxDepth) {
      result[path] = current as JsonValue;
      return;
    }
    
    // Handle primitives and null
    if (!isTraversable(current)) {
      result[path] = current as JsonValue;
      return;
    }
    
    // Handle arrays
    if (Array.isArray(current)) {
      if (current.length === 0) {
        result[path] = current as JsonArray;

        return;
      }
      
      current.forEach((item, index) => {
        const newPath = path ? `${path}${delimiter}${index}` : `${index}`;
        recurse(item, newPath, depth + 1);
      });
      return;
    }
    
    // Handle objects
    const keys = Object.keys(current);
    
    if (keys.length === 0) {
      result[path] = current as JsonObject;
      return;
    }
    
    keys.forEach(key => {
      const newPath = path ? `${path}${delimiter}${key}` : key;
      recurse((current as Record<string, unknown>)[key], newPath, depth + 1);
    });
  }
  
  recurse(obj, '', 0);
  return result;
}

/**
 * Converts a flattened object back into a nested structure
 * 
 * @example
 * unflatten({ 'user.name': 'Alice', 'user.age': 28 })
 * // { user: { name: 'Alice', age: 28 } }
 * 
 * @param flat - The flattened object
 * @param options - Configuration options
 * @returns Nested object
 */
export function unflatten(
  flat: Record<string, JsonValue>,
  options: FlattenOptions = {}
): unknown {
  const { delimiter = '.' } = options;
  const result: Record<string, unknown> = {};
  
  Object.entries(flat).forEach(([path, value]) => {
    const parts = path.split(delimiter);
    let current: Record<string, unknown> | unknown[] = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];
      
      if (!(part in current)) {
        // Decide if next level should be array or object
        if (/^\d+$/.test(nextPart)) {
          (current as Record<string, unknown>)[part] = [];
        } else {
          (current as Record<string, unknown>)[part] = {};
        }
      }
      
      current = (current as Record<string, unknown>)[part] as Record<string, unknown> | unknown[];
    }
    
    const lastPart = parts[parts.length - 1];
    (current as Record<string, unknown>)[lastPart] = value;
  });
  
  return result;
}