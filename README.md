# json-accessor

[![npm version](https://img.shields.io/npm/v/json-accessor.svg)](https://www.npmjs.com/package/json-accessor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

Production-grade path-based JSON operations engine for safe, deterministic CRUD operations on deeply nested JSON structures.

## Features

✨ **Path-First API** - Use dot and bracket notation for intuitive access  
🔒 **Immutable by Default** - Original objects never mutated  
🎯 **Type-Safe** - Full TypeScript support with strict typing  
🚀 **Zero Dependencies** - Lightweight and tree-shakable  
🛡️ **Safe Operations** - Never throws on invalid paths  
📦 **Auto-Creation** - Automatically creates missing nested structures  
🔍 **Powerful Querying** - Search, diff, and validate with ease  
📊 **Audit Trail** - Built-in operation history tracking

## Installation

```bash
npm install json-accessor
```

```bash
yarn add json-accessor
```

```bash
pnpm add json-accessor
```

## Quick Start

```typescript
import { get, set, del, has } from 'json-accessor';

const data = {
  user: { 
    name: 'Alice', 
    age: 28 
  },
  skills: ['JavaScript', 'TypeScript']
};

// Get value
const name = get(data, 'user.name'); // 'Alice'
const skill = get(data, 'skills[0]'); // 'JavaScript'

// Set value (immutable by default)
const updated = set(data, 'user.age', 29);
// data is unchanged, updated is a new object

// Delete property
const removed = del(data, 'user.age');

// Check existence
const exists = has(data, 'user.name'); // true
```

## Core API

### get(obj, path)

Safely retrieves a value at the specified path. Returns `undefined` if the path doesn't exist.

```typescript
const data = {
  user: {
    profile: {
      avatar: 'url'
    }
  },
  items: [{ id: 1 }, { id: 2 }]
};

get(data, 'user.profile.avatar'); // 'url'
get(data, 'items[0].id'); // 1
get(data, 'invalid.path'); // undefined
```

### set(obj, path, value, options?)

Sets a value at the specified path. Auto-creates missing nested structures.

```typescript
// Immutable (default)
const updated = set(data, 'user.email', 'alice@example.com');

// Mutable mode
set(data, 'user.email', 'alice@example.com', { immutable: false });

// Auto-creates nested structures
set({}, 'user.profile.avatar', 'url');
// Result: { user: { profile: { avatar: 'url' } } }

// Works with arrays
set({}, 'items[0].name', 'First');
// Result: { items: [{ name: 'First' }] }
```

**Options:**
- `immutable` (boolean, default: `true`) - If true, returns a new object

### del(obj, path, options?)

Deletes a value at the specified path.

```typescript
const data = { user: { name: 'Alice', age: 28, email: 'alice@example.com' } };

// Remove property
del(data, 'user.email');
// Result: { user: { name: 'Alice', age: 28 } }

// Remove array element
del({ items: [1, 2, 3] }, 'items[1]');
// Result: { items: [1, 3] }

// Cleanup empty parents
del(data, 'user.profile.avatar', { cleanupEmpty: true });
```

**Options:**
- `immutable` (boolean, default: `true`)
- `cleanupEmpty` (boolean, default: `false`) - Remove empty parent objects

### has(obj, path)

Checks if a path exists in the object.

```typescript
has(data, 'user.name'); // true
has(data, 'user.phone'); // false
```

### add(obj, path, value, options?)

Semantic wrapper over `set()` for better code readability when adding new properties.

## Advanced Operations

### flatten(obj, options?)

Flattens a nested object into a single-level object with path keys.

```typescript
const nested = {
  user: { 
    name: 'Alice', 
    age: 28 
  },
  skills: ['JS', 'TS']
};

flatten(nested);
// Result:
// {
//   'user.name': 'Alice',
//   'user.age': 28,
//   'skills.0': 'JS',
//   'skills.1': 'TS'
// }

// Custom delimiter
flatten(nested, { delimiter: '/' });
// { 'user/name': 'Alice', ... }

// Max depth
flatten(nested, { maxDepth: 1 });
// { 'user': { name: 'Alice', age: 28 }, ... }
```

### unflatten(flat, options?)

Converts a flattened object back into nested structure.

```typescript
const flat = {
  'user.name': 'Alice',
  'user.age': 28
};

unflatten(flat);
// Result: { user: { name: 'Alice', age: 28 } }
```

### diff(oldObj, newObj)

Compares two objects and returns the differences (JSON-Patch inspired).

```typescript
const oldData = { user: { name: 'Alice', age: 28 } };
const newData = { user: { name: 'Alice', age: 29, city: 'NYC' } };

diff(oldData, newData);
// Result:
// [
//   { op: 'replace', path: 'user.age', oldValue: 28, newValue: 29 },
//   { op: 'add', path: 'user.city', newValue: 'NYC' }
// ]
```

### applyDiff(obj, diffs)

Applies a set of diff operations to an object.

```typescript
const diffs = [
  { op: 'replace', path: 'user.age', newValue: 29 },
  { op: 'add', path: 'user.city', newValue: 'NYC' }
];

applyDiff(data, diffs);
```

### search(obj, query)

Searches for values in an object based on query criteria.

```typescript
const data = {
  user: { name: 'Alice Johnson', age: 28, email: 'alice@example.com' },
  admin: { name: 'Bob Smith', age: 35 }
};

// Find all numbers
search(data, { type: 'number' });
// [{ path: 'user.age', value: 28 }, { path: 'admin.age', value: 35 }]

// Find keys containing 'name'
search(data, { keyIncludes: 'name' });
// [{ path: 'user.name', value: 'Alice Johnson' }, ...]

// Find values containing 'alice'
search(data, { valueIncludes: 'alice' });
// [{ path: 'user.email', value: 'alice@example.com' }]

// Find numbers greater than 30
search(data, { valueGt: 30 });
// [{ path: 'admin.age', value: 35 }]

// Combine criteria
search(data, { type: 'number', valueLt: 30 });
// [{ path: 'user.age', value: 28 }]
```

**Query Options:**
- `keyIncludes` (string) - Match paths containing this string
- `valueIncludes` (string) - Match string values containing this
- `type` ('string' | 'number' | 'boolean' | 'object' | 'array' | 'null')
- `valueGt` (number) - Match numbers greater than
- `valueLt` (number) - Match numbers less than
- `valueEquals` (any) - Match exact value

### validate(obj, schema)

Validates an object against a schema.

```typescript
const schema = {
  'user.name': { 
    type: 'string', 
    required: true,
    min: 2,
    max: 50
  },
  'user.age': { 
    type: 'number',
    min: 0,
    max: 150
  },
  'user.email': {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  'user.role': {
    enum: ['admin', 'user', 'guest']
  },
  'user.password': {
    custom: (val) => {
      if (typeof val !== 'string') return 'Must be string';
      if (val.length < 8) return 'Must be at least 8 chars';
      return true;
    }
  }
};

const result = validate(data, schema);
// Result:
// {
//   valid: true,
//   errors: []
// }

// Invalid data
const invalid = { user: { name: 'A', age: 200 } };
validate(invalid, schema);
// {
//   valid: false,
//   errors: [
//     { path: 'user.name', message: 'Length must be at least 2', value: 'A' },
//     { path: 'user.age', message: 'Value must be at most 150', value: 200 }
//   ]
// }
```

### changeType(obj, path, targetType)

Safely transforms a value to a different type.

```typescript
// String to number
changeType({ age: '28' }, 'age', 'number');
// { success: true, value: { age: 28 } }

// String to array
changeType({ tags: 'js,ts,react' }, 'tags', 'array');
// { success: true, value: { tags: ['js', 'ts', 'react'] } }

// Number to boolean
changeType({ active: 1 }, 'active', 'boolean');
// { success: true, value: { active: true } }

// Invalid transformation
changeType({ data: 'text' }, 'data', 'number');
// { success: false, error: "Cannot convert 'text' to number" }
```

## Audit & History

Track all operations for audit trails and undo/redo functionality.

### setWithHistory(obj, path, value, options?, metadata?)

```typescript
const result = setWithHistory(data, 'user.age', 29);
// Result:
// {
//   result: { user: { name: 'Alice', age: 29 } },
//   history: [{
//     timestamp: 1234567890,
//     op: 'set',
//     path: 'user.age',
//     oldValue: 28,
//     newValue: 29,
//     metadata: { userId: 'admin-123' }
//   }]
// }
```

### deleteWithHistory(obj, path, options?, metadata?)

### applyWithHistory(obj, operations)

Execute multiple operations with complete audit trail.

```typescript
const operations = [
  { op: 'set', path: 'user.age', value: 29 },
  { op: 'set', path: 'user.city', value: 'NYC' },
  { op: 'delete', path: 'user.email' }
];

const result = applyWithHistory(data, operations);
// Returns result with complete history of all operations
```

## Path Syntax

The library supports both dot and bracket notation:

```typescript
'user.name'                           // Dot notation
'user.profile.avatar'                 // Nested objects
'skills[0]'                           // Array index (bracket)
'skills.0'                            // Array index (dot)
'education.degrees[1].year'           // Mixed
'items[0].tags[2]'                    // Multiple arrays
```

Paths are automatically normalized internally:
- `a[0].b` → `a.0.b`
- `a["key"]` → `a.key`

## Type Safety

Full TypeScript support with strict typing:

```typescript
import { get, set, JsonObject } from 'json-accessor';

interface User {
  name: string;
  age: number;
}

const data: JsonObject = { user: { name: 'Alice', age: 28 } };

// Type-safe get with generics
const age = get(data, 'user.age');

// Type inference
const updated = set(data, 'user.age', 29); // Type: JsonObject
```

## Performance

Optimized for large JSON structures:

- **Immutable operations**: Uses structural sharing where possible
- **Mutable mode**: Available for performance-critical operations
- **Memory efficient**: Minimal object copying
- **No eval()**: Safe path parsing without `eval`
- **Tree-shakable**: Import only what you need

### Benchmarks

```
get() - 1M operations: ~150ms
set() immutable - 100K operations: ~250ms
set() mutable - 100K operations: ~80ms
flatten() - 10K nested objects: ~180ms
diff() - 10K object comparisons: ~200ms
```

## Immutable vs Mutable

By default, all operations are **immutable** (return new objects). For performance-critical code, use mutable mode:

```typescript
// Immutable (default) - safe, predictable
const updated = set(data, 'user.age', 29);
// data unchanged, updated is new object

// Mutable - faster, modifies in place
set(data, 'user.age', 29, { immutable: false });
// data is modified directly
```

**When to use mutable mode:**
- Performance-critical loops
- You own the object lifecycle
- You don't need undo/redo
- You're not using React/Vue reactivity

## Use Cases

Perfect for:

- 📝 **JSON Editors** - Build dynamic form editors
- 🎛️ **Admin Panels** - Manage complex configuration
- 🏛️ **Government Dashboards** - Handle citizen data safely
- 📋 **Schema-Driven Forms** - Dynamic form generation
- 🔄 **State Management** - Redux/Zustand utilities
- 📊 **Data Transformation** - ETL pipelines
- ✅ **Validation Systems** - Schema validation
- 📜 **Audit Logs** - Track data changes

## Security

- ✅ No prototype pollution
- ✅ No unsafe eval()
- ✅ No arbitrary code execution
- ✅ Type-safe operations
- ✅ Predictable behavior

## Browser & Node.js Support

- **Node.js**: 16.x and above
- **Browsers**: All modern browsers (ES2020+)
- **TypeScript**: 5.x
- **Bundlers**: Webpack, Rollup, Vite, esbuild


## License

MIT © Rahul Kumar

## Related Projects

- [lodash](https://lodash.com/) - General utility library
- [immer](https://immerjs.github.io/immer/) - Immutable state management
- [json-patch](https://github.com/Starcounter-Jack/JSON-Patch) - JSON Patch (RFC 6902) implementation

---

**Built with ❤️ for the JavaScript community**