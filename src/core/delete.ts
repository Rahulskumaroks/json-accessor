import type { DeleteOptions } from '../types';
import { normalizePath, deepClone, isTraversable, isEmpty } from '../utils/path';

/**
 * Deletes a value at the specified path
 * Optionally cleans up empty parent objects
 * Returns a new object by default (immutable)
 * 
 * @example
 * const data = { user: { name: 'Alice', age: 28 } };
 * 
 * del(data, 'user.age')
 * // { user: { name: 'Alice' } }
 * 
 * del(data, 'user.age', { cleanupEmpty: true })
 * // Removes empty parent objects after deletion
 * 
 * @param obj - The object to modify
 * @param path - The path to delete
 * @param options - Configuration options
 * @returns Modified object (new or same depending on immutable flag)
 */
export function del<T = unknown>(
  obj: T,
  path: string,
  options: DeleteOptions = {}
): T {
  const { immutable = true, cleanupEmpty = false } = options;
  const parts = normalizePath(path);
  
  if (parts.length === 0) {
    return obj;
  }
  
  // Clone if immutable mode
  const result = immutable ? deepClone(obj) : obj;
  
  if (!isTraversable(result)) {
    return result as T;
  }
  
  // Navigate to parent
  let current: Record<string, unknown> | unknown[] = result as Record<string, unknown> | unknown[];
  const parents: Array<{ obj: Record<string, unknown> | unknown[]; key: string }> = [];
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    
    if (!isTraversable(current)) {
      return result as T;
    }
    
    parents.push({ obj: current, key: part });
    current = (current as Record<string, unknown>)[part] as Record<string, unknown> | unknown[];
  }
  
  // Delete the final key
  const lastPart = parts[parts.length - 1];
  
  if (isTraversable(current)) {
    if (Array.isArray(current)) {
      const index = parseInt(lastPart, 10);
      if (!isNaN(index) && index >= 0 && index < current.length) {
        current.splice(index, 1);
      }
    } else {
      delete (current as Record<string, unknown>)[lastPart];
    }
  }
  
  // Cleanup empty parents if requested
  if (cleanupEmpty) {
    for (let i = parents.length - 1; i >= 0; i--) {
      const { obj, key } = parents[i];
      const child = (obj as Record<string, unknown>)[key];
      
      if (isEmpty(child)) {
        if (Array.isArray(obj)) {
          const index = parseInt(key, 10);
          if (!isNaN(index)) {
            obj.splice(index, 1);
          }
        } else {
          delete (obj as Record<string, unknown>)[key];
        }
      } else {
        break; // Stop if parent is not empty
      }
    }
  }
  
  return result as T;
}