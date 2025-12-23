import type { JsonValue, MutationOptions } from '../types';
import { set } from './set';

/**
 * Semantic wrapper over set() for adding new values
 * Identical to set() but more expressive for code readability
 * 
 * @example
 * const data = { user: { name: 'Alice' } };
 * add(data, 'user.age', 28)
 * // { user: { name: 'Alice', age: 28 } }
 * 
 * @param obj - The object to modify
 * @param path - The path where to add the value
 * @param value - The value to add
 * @param options - Configuration options
 * @returns Modified object
 */
export function add<T = unknown>(
  obj: T,
  path: string,
  value: JsonValue,
  options: MutationOptions = {}
): T {
  return set(obj, path, value, options);
}