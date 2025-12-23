import type { SearchQuery, SearchResult} from '../types';
import { flatten } from './flatten';

/**
 * Searches for values in an object based on query criteria
 * Supports key matching, value matching, type filtering, and range queries
 * 
 * @example
 * const data = { user: { name: 'Alice', age: 28, city: 'NYC' } };
 * 
 * // Find all string values
 * search(data, { type: 'string' })
 * // [{ path: 'user.name', value: 'Alice' }, { path: 'user.city', value: 'NYC' }]
 * 
 * // Find keys containing 'name'
 * search(data, { keyIncludes: 'name' })
 * // [{ path: 'user.name', value: 'Alice' }]
 * 
 * // Find numbers > 25
 * search(data, { valueGt: 25 })
 * // [{ path: 'user.age', value: 28 }]
 * 
 * @param obj - The object to search
 * @param query - Search criteria
 * @returns Array of matching results
 */
export function search(obj: unknown, query: SearchQuery): SearchResult[] {
  const flat = flatten(obj);
  const results: SearchResult[] = [];
  
  Object.entries(flat).forEach(([path, value]) => {
    let matches = true;
    
    // Key matching
    if (query.keyIncludes !== undefined) {
      if (!path.includes(query.keyIncludes)) {
        matches = false;
      }
    }
    
    // Value string matching
    if (query.valueIncludes !== undefined) {
      if (typeof value !== 'string' || !value.includes(query.valueIncludes)) {
        matches = false;
      }
    }
    
    // Type matching
    if (query.type !== undefined) {
      const valueType = Array.isArray(value) ? 'array' : 
                       value === null ? 'null' : 
                       typeof value;
      if (valueType !== query.type) {
        matches = false;
      }
    }
    
    // Numeric range matching
    if (query.valueGt !== undefined) {
      if (typeof value !== 'number' || value <= query.valueGt) {
        matches = false;
      }
    }
    
    if (query.valueLt !== undefined) {
      if (typeof value !== 'number' || value >= query.valueLt) {
        matches = false;
      }
    }
    
    // Exact value matching
    if (query.valueEquals !== undefined) {
      if (JSON.stringify(value) !== JSON.stringify(query.valueEquals)) {
        matches = false;
      }
    }
    
    if (matches) {
      results.push({ path, value });
    }
  });
  
  return results;
}