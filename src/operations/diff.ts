import type { DiffEntry} from '../types';
import { flatten } from './flatten';
import { set, del } from '../index';
/**
 * Compares two objects and returns the differences
 * Returns JSON-Patch inspired change operations
 * 
 * @example
 * const old = { user: { name: 'Alice', age: 28 } };
 * const new = { user: { name: 'Alice', age: 29, city: 'NYC' } };
 * diff(old, new)
 * // [
 * //   { op: 'replace', path: 'user.age', oldValue: 28, newValue: 29 },
 * //   { op: 'add', path: 'user.city', newValue: 'NYC' }
 * // ]
 * 
 * @param oldObj - The original object
 * @param newObj - The new object
 * @returns Array of diff entries
 */
export function diff(oldObj: unknown, newObj: unknown): DiffEntry[] {
  const oldFlat = flatten(oldObj || {});
  const newFlat = flatten(newObj || {});
  
  const changes: DiffEntry[] = [];
  const allPaths = new Set([
    ...Object.keys(oldFlat),
    ...Object.keys(newFlat)
  ]);
  
  allPaths.forEach(path => {
    const oldValue = oldFlat[path];
    const newValue = newFlat[path];
    const hasOld = path in oldFlat;
    const hasNew = path in newFlat;
    
    if (!hasOld && hasNew) {
      // Added
      changes.push({
        op: 'add',
        path,
        newValue
      });
    } else if (hasOld && !hasNew) {
      // Removed
      changes.push({
        op: 'remove',
        path,
        oldValue
      });
    } else if (hasOld && hasNew) {
      // Check if changed
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          op: 'replace',
          path,
          oldValue,
          newValue
        });
      }
    }
  });
  
  return changes;
}

/**
 * Applies a set of diff operations to an object
 * 
 * @param obj - The object to patch
 * @param diffs - Array of diff operations
 * @returns Patched object
 */
export function applyDiff<T = unknown>(obj: T, diffs: DiffEntry[]): T {

  let result = obj;
  
  for (const diff of diffs) {
    switch (diff.op) {
      case 'add':
      case 'replace':
        result = set(result, diff.path, diff.newValue!);
        break;
      case 'remove':
        result = del(result, diff.path);
        break;
    }
  }
  
  return result;
}