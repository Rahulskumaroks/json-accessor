/**
 * Primitive JSON values
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * Valid JSON values
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * JSON object type
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * JSON array type
 */
export interface JsonArray extends Array<JsonValue> {}

/**
 * Options for set and delete operations
 */
export interface MutationOptions {
  /**
   * If true, returns a new object. If false, mutates the original object.
   * @default true
   */
  immutable?: boolean;
}

/**
 * Options for delete operations
 */
export interface DeleteOptions extends MutationOptions {
  /**
   * If true, removes empty parent objects after deletion
   * @default false
   */
  cleanupEmpty?: boolean;
}

/**
 * Options for flatten operations
 */
export interface FlattenOptions {
  /**
   * Delimiter for path segments
   * @default "."
   */
  delimiter?: string;
  
  /**
   * Maximum depth to flatten
   */
  maxDepth?: number;
}

/**
 * Operation types for diff
 */
export type DiffOperation = 'add' | 'remove' | 'replace';

/**
 * Diff result entry
 */
export interface DiffEntry {
  op: DiffOperation;
  path: string;
  oldValue?: JsonValue;
  newValue?: JsonValue;
}

/**
 * Search query parameters
 */
export interface SearchQuery {
  /**
   * Match paths containing this string
   */
  keyIncludes?: string;
  
  /**
   * Match string values containing this string
   */
  valueIncludes?: string;
  
  /**
   * Match numeric values greater than this
   */
  valueGt?: number;
  
  /**
   * Match numeric values less than this
   */
  valueLt?: number;
  
  /**
   * Match values of this type
   */
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';
  
  /**
   * Match exact values
   */
  valueEquals?: JsonValue;
}

/**
 * Search result entry
 */
export interface SearchResult {
  path: string;
  value: JsonValue;
}

/**
 * Target types for type transformation
 */
export type TargetType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null';

/**
 * Type transformation result
 */
export interface TypeTransformResult {
  success: boolean;
  value?: JsonValue;
  error?: string;
}

/**
 * Validation schema type
 */
export type ValidationSchemaType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null' | 'any';

/**
 * Validation rule
 */
export interface ValidationRule {
  type?: ValidationSchemaType;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: JsonValue[];
  custom?: (value: JsonValue) => boolean | string;
}

/**
 * Validation schema
 */
export interface ValidationSchema {
  [path: string]: ValidationRule;
}

/**
 * Validation error
 */
export interface ValidationError {
  path: string;
  message: string;
  value?: JsonValue;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Operation log entry for audit trail
 */
export interface OperationLog {
  timestamp: number;
  op: 'get' | 'set' | 'delete' | 'add';
  path: string;
  oldValue?: JsonValue;
  newValue?: JsonValue;
  metadata?: Record<string, unknown>;
}

/**
 * Result of operation with history
 */
export interface OperationWithHistory<T = unknown> {
  result: T;
  history: OperationLog[];
}
