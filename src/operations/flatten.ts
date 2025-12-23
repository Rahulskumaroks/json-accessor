import type { JsonValue, FlattenOptions, JsonArray, JsonObject } from '../types';
import { isTraversable } from '../utils/path';

export function flatten(
  obj: unknown,
  options: FlattenOptions = {}
): Record<string, JsonValue> {
  const { delimiter = '.', maxDepth = Infinity } = options;
  const result: Record<string, JsonValue> = {};

  function recurse(current: unknown, path: string, depth: number): void {
    if (!isTraversable(current)) {
      if (path) {
        result[path] = current as JsonValue;
      }
      return;
    }

    if (Array.isArray(current)) {
      if (current.length === 0) {
        result[path] = current as JsonArray;
        return;
      }
      
      if (depth > maxDepth) {
        result[path] = current as JsonValue;
        return;
      }

      current.forEach((item, index) => {
        const newPath = path ? `${path}${delimiter}${index}` : `${index}`;
        recurse(item, newPath, depth + 1);
      });
      return;
    }

    const keys = Object.keys(current);
    if (keys.length === 0) {
      result[path] = current as JsonObject;
      return;
    }

    if (depth > maxDepth) {
      result[path] = current as JsonValue;
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