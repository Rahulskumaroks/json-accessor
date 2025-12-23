import { normalizePath, isTraversable } from '../utils/path';

/**
 * Checks if a path exists in the object
 * Returns false for null/undefined values at the path
 * 
 * @example
 * const data = { user: { name: 'Alice' } };
 * has(data, 'user.name') // true
 * has(data, 'user.age') // false
 * has(data, 'invalid.path') // false
 * 
 * @param obj - The object to check
 * @param path - The path to verify
 * @returns True if the path exists
 */
export function has(obj: unknown, path: string): boolean {
  if (obj === null || obj === undefined) {
    return false;
  }
  
  const parts = normalizePath(path);
  
  if (parts.length === 0) {
    return true;
  }
  
  let current: unknown = obj;
  
  for (let i = 0; i < parts.length; i++) {
    if (!isTraversable(current)) {
      return false;
    }
    
    const part = parts[i];
    
    // Check if this is the last part
    if (i === parts.length - 1) {
      return part in (current as Record<string, unknown>);
    }
    
    current = (current as Record<string, unknown>)[part];
  }
  
  return false;
}