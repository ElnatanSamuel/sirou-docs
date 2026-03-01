# TypeScript Mastery

Sirou leverages advanced TypeScript features like **Template Literal Types**, **Recursive Conditional Types**, and **Mapped Types** to provide zero-cost type safety.

## 1. Inferring Parameters

You can use Sirou's internal types to extract param requirements from your schema. This is useful for building custom components that wrap Sirou hooks.

```typescript
import { InferParams } from "@sirou/core";
import { type AppRoutes } from "./routes";

// Extract params for a specific route
type DetailsParams = InferParams<AppRoutes, "products.details">;
// Result: { productId: string }
```

## 2. Generating Full Route Maps

If you want a flat list of every possible route string in your app:

```typescript
import { FlatRouteMap } from "@sirou/core";

export type AllPaths = keyof FlatRouteMap<AppRoutes>;
// Result: "home" | "products.list" | "products.details" | ...
```

## 3. Strict Meta Types

You can enforce a specific structure for your `meta` objects by passing a Generic to `defineRoutes`.

```typescript
interface MyMeta {
  title: string;
  requiresAuth?: boolean;
}

export const routes = defineRoutes<MyMeta>({
  home: {
    path: "/",
    meta: { title: "Home" }, // Valid
    // meta: { foo: "bar" } // Error: Property 'foo' does not exist
  },
});
```

## 4. Type-Safe Redirects

When returning a redirect from a guard, Sirou ensures the target route and its params are valid.

```typescript
execute: async () => {
  return {
    allowed: false,
    redirect: { name: "login", params: {} }, // Type checked!
  };
};
```

---

Sirou's type system is designed to be "Sound but Flexible." It catches errors without getting in your way.

Next: Preparing for change with the [Migration Guide](migration.md).
