import type { JsonValue } from '../types';
import { normalizePath, safeAccess } from '../utils/path';

/**
 * Safely retrieves a value at the specified path
 * Returns undefined if the path does not exist
 * Never throws errors
 * 
 * @example
 * const data = { user: { name: 'Alice', age: 28 } };
 * get(data, 'user.name') // 'Alice'
 * get(data, 'user.email') // undefined
 * get(data, 'invalid.path') // undefined
 * 
 * @param obj - The object to query
 * @param path - The path to the value (dot or bracket notation)
 * @returns The value at the path or undefined
 */
export function get<T = JsonValue>(obj: unknown, path: string): T | undefined {
  if (obj === null || obj === undefined) {
    return undefined;
  }
  
  const parts = normalizePath(path);
  
  if (parts.length === 0) {
    return obj as T;
  }
  
  return safeAccess(obj, parts) as T | undefined;
}