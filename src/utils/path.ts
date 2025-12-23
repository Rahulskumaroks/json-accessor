import type { JsonValue } from '../types';

/**
 * Normalizes a path string into an array of keys
 * Converts bracket notation to dot notation
 * 
 * @example
 * normalizePath('a[0].b') // ['a', '0', 'b']
 * normalizePath('user.name') // ['user', 'name']
 * 
 * @param path - The path string to normalize
 * @returns Array of path segments
 */
export function normalizePath(path: string): string[] {
  if (!path || typeof path !== 'string') {
    return [];
  }
  
  // Replace bracket notation with dot notation
  // a[0] -> a.0
  // a["key"] -> a.key
  const normalized = path
    .replace(/\[(['"]?)([^\]]+)\1\]/g, '.$2')
    .replace(/^\./, ''); // Remove leading dot if present
  
  return normalized
    .split('.')
    .filter(part => part.length > 0);
}

/**
 * Checks if a value is a valid object for traversal
 */
export function isTraversable(value: unknown): value is Record<string, unknown> | unknown[] {
  return value !== null && typeof value === 'object';
}

/**
 * Checks if a string represents a valid array index
 */
export function isArrayIndex(key: string): boolean {
  return /^\d+$/.test(key);
}

/**
 * Deep clones a JSON-serializable value
 */
export function deepClone<T = JsonValue>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  const cloned: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
    }
  }
  
  return cloned as T;
}


/**
 * Checks if a value is empty (empty object or array)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
}

/**
 * Safely accesses a nested property
 */
export function safeAccess(obj: unknown, parts: string[]): unknown {
  let current = obj;
  
  for (const part of parts) {
    if (!isTraversable(current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  
  return current;
}
