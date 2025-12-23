export { get } from './core/get';
export { set } from './core/set';
export { del } from './core/delete';
export { has } from './core/has';
export { add } from './core/add';

// Advanced operations
export { flatten, unflatten } from './operations/flatten';
export { diff, applyDiff } from './operations/diff';
export { search } from './operations/search';
export { changeType } from './operations/transform';
export { validate } from './operations/validate';
export { 
  setWithHistory, 
  deleteWithHistory, 
  applyWithHistory 
} from './operations/history';

// Utilities
export { 
  normalizePath, 
  isTraversable, 
  isArrayIndex,
  deepClone,
  isEmpty
} from './utils/path';

// Types
export type {
  JsonValue,
  JsonObject,
  JsonArray,
  JsonPrimitive,
  MutationOptions,
  DeleteOptions,
  FlattenOptions,
  DiffOperation,
  DiffEntry,
  SearchQuery,
  SearchResult,
  TargetType,
  TypeTransformResult,
  ValidationSchema,
  ValidationRule,
  ValidationError,
  ValidationResult,
  OperationLog,
  OperationWithHistory
} from './types';