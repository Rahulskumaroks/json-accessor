import type { DeleteOptions } from '../types';
import { normalizePath, deepClone, isTraversable, isEmpty } from '../utils/path';

export function del<T>(
  obj: T,
  path: string,
  options: DeleteOptions = {}
): T {
  const { immutable = true, cleanupEmpty = false } = options;
  const parts = normalizePath(path);

  if (parts.length === 0) {
    return obj;
  }

  const result = immutable ? deepClone(obj) : obj;

  if (!isTraversable(result)) {
    return result as T;
  }

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

  if (cleanupEmpty) {
    for (let i = parents.length - 1; i >= 0; i--) {
      const { obj, key } = parents[i];
      const child = (obj as Record<string, unknown>)[key];
      
      if (!isEmpty(child)) {
        break;
      }

      const objKeys = Array.isArray(obj) 
        ? obj.filter(item => item !== undefined).length
        : Object.keys(obj).length;

      if (objKeys > 1) {
        break;
      }

      if (Array.isArray(obj)) {
        const index = parseInt(key, 10);
        if (!isNaN(index)) {
          obj.splice(index, 1);
        }
      } else {
        delete (obj as Record<string, unknown>)[key];
      }
    }
  }

  return result as T;
}