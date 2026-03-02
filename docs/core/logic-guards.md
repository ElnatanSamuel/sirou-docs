# Logic Guards

Logic Guards are asynchronous functions that control access to your routes. They allow you to prevent unauthorized entry, perform redirects, or handle complex business logic before a navigation is finalized.

## Guard Anatomy

A guard receives a context object and returns a `GuardResult`.

```typescript
interface GuardContext {
  route: string;
  params: Record<string, any>;
  query: Record<string, string>;
  meta: any;
  router: SirouRouter;
}

type GuardResult =
  | { allowed: true }
  | { allowed: false; redirect: string | RedirectObject };
```

## Implementation

Register your guards on the router instance.

```typescript
router.registerGuard({
  name: "auth",
  execute: async ({ meta }) => {
    const user = await checkAuth();

    if (!user && meta.requiresAuth) {
      return {
        allowed: false,
        redirect: "/login",
      };
    }

    return { allowed: true };
  },
});
```

## Why use Logic Guards?

:::features

### Centralized Logic

Keep your auth and permission logic in one place instead of repeating `useEffect` checks in every component.

### Platform Agnostic

Use the same guard logic on your Svelte web app and your React Native mobile app.

### Type Safe Context

Guards have access to fully typed parameters and metadata from your route schema.
:::

## Multi-Guard Execution

You can apply multiple guards to a single route. Sirou executes them in the order defined in your schema.

```typescript
export const routes = defineRoutes({
  admin: {
    path: "/admin",
    guards: ["auth", "isAdmin"],
  },
});
```

---

Next: Master data fetching with [Data Loaders](data-loaders.md).
