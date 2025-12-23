import type { 
  OperationLog, 
  OperationWithHistory,
  JsonValue,
  MutationOptions 
} from '../types';
import { get } from '../core/get';
import { set as coreSet } from '../core/set';
import { del as coreDel } from '../core/delete';

/**
 * Executes set operation with audit trail
 * 
 * @param obj - The object to modify
 * @param path - The path to set
 * @param value - The value to set
 * @param options - Mutation options
 * @param metadata - Additional metadata for audit log
 * @returns Result with operation history
 */
export function setWithHistory<T = unknown>(
  obj: T,
  path: string,
  value: JsonValue,
  options: MutationOptions = {},
  metadata?: Record<string, unknown>
): OperationWithHistory<T> {
  const oldValue = get(obj, path);
  const result = coreSet(obj, path, value, options);
  
  const log: OperationLog = {
    timestamp: Date.now(),
    op: 'set',
    path,
    oldValue,
    newValue: value,
    metadata
  };
  
  return {
    result,
    history: [log]
  };
}

/**
 * Executes delete operation with audit trail
 * 
 * @param obj - The object to modify
 * @param path - The path to delete
 * @param options - Mutation options
 * @param metadata - Additional metadata for audit log
 * @returns Result with operation history
 */
export function deleteWithHistory<T = unknown>(
  obj: T,
  path: string,
  options: MutationOptions = {},
  metadata?: Record<string, unknown>
): OperationWithHistory<T> {
  const oldValue = get(obj, path);
  const result = coreDel(obj, path, options);
  
  const log: OperationLog = {
    timestamp: Date.now(),
    op: 'delete',
    path,
    oldValue,
    metadata
  };
  
  return {
    result,
    history: [log]
  };
}

/**
 * Executes multiple operations with complete audit trail
 * 
 * @param obj - The object to modify
 * @param operations - Array of operations to execute
 * @returns Result with complete history
 */
export function applyWithHistory<T = unknown>(
  obj: T,
  operations: Array<{
    op: 'set' | 'delete';
    path: string;
    value?: JsonValue;
    metadata?: Record<string, unknown>;
  }>
): OperationWithHistory<T> {
  let result = obj;
  const history: OperationLog[] = [];
  
  for (const operation of operations) {
    if (operation.op === 'set') {
      const opResult = setWithHistory(
        result,
        operation.path,
        operation.value!,
        { immutable: true },
        operation.metadata
      );
      result = opResult.result;
      history.push(...opResult.history);
    } else if (operation.op === 'delete') {
      const opResult = deleteWithHistory(
        result,
        operation.path,
        { immutable: true },
        operation.metadata
      );
      result = opResult.result;
      history.push(...opResult.history);
    }
  }
  
  return {
    result,
    history
  };
}
