# Sirou Documentation

> **Define routes once. Navigate everywhere.**

Sirou is a universal, type-safe route management library for the modern JavaScript ecosystem. Write your route schema once in TypeScript and get full type safety, automated navigation, and a consistent developer experience across React, Next.js, Svelte, React Native, and Flutter.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Installation](#2-installation)
3. [Getting Started](#3-getting-started)
4. [Core Concepts](#4-core-concepts)
5. [Route Definition API](#5-route-definition-api)
6. [Route Guards](#6-route-guards)
7. [Data Loaders](#7-data-loaders)
8. [Wildcard & 404 Routes](#8-wildcard--404-routes)
9. [React Adapter](#9-react-adapter)
10. [Next.js Adapter](#10-nextjs-adapter)
11. [Svelte Adapter](#11-svelte-adapter)
12. [React Native Adapter](#12-react-native-adapter)
13. [Flutter Bridge](#13-flutter-bridge)
14. [CLI Reference](#14-cli-reference)
15. [TypeScript Utilities](#15-typescript-utilities)
16. [Advanced Patterns](#16-advanced-patterns)
17. [Migrating from React Router](#17-migrating-from-react-router)
18. [Roadmap](#18-roadmap)

---

## 1. Introduction

### Why Sirou?

In large applications, routing logic is scattered across multiple files, frameworks, and platforms. A typo in a route name causes a runtime crash, not a compile error. Sirou solves this by making your entire routing system a **single source of truth**.

| Problem                                | Sirou Solution                          |
| -------------------------------------- | --------------------------------------- |
| Typos in route names crash at runtime  | TypeScript catches them at compile time |
| Params are untyped `string`            | Full param type inference & validation  |
| Different APIs for web vs. mobile      | One `router.go()` call works everywhere |
| No visibility into navigation state    | Built-in DevTools panel                 |
| Data fetching is separate from routing | Integrated Data Loaders                 |
| 404 handling is ad-hoc                 | First-class wildcard route support      |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Your Route Schema                     │
│                    (routes.ts)                           │
└──────────────────────────┬──────────────────────────────┘
                           │
                    @sirou/core
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    Trie Matcher     Guard System      Data Loaders
          │                │                │
          └────────────────┼────────────────┘
                           │
    ┌──────────┬───────────┼───────────┬──────────┐
    │          │           │           │          │
@sirou/  @sirou/    @sirou/    @sirou/    sirou_
react    next       svelte  react-native  flutter
```

---

## 2. Installation

### Core Package

```bash
npm install @sirou/core
```

### Platform Adapters

```bash
npm install @sirou/react        # React (Vite, CRA)
npm install @sirou/next         # Next.js 13+ (App & Pages Router)
npm install @sirou/svelte       # SvelteKit
npm install @sirou/react-native # React Native + React Navigation v6
```

### CLI

```bash
npm install -g @sirou/cli
# or
npx @sirou/cli <command>
```

### Peer Dependencies

| Adapter               | Peer Dependencies                          |
| --------------------- | ------------------------------------------ |
| `@sirou/react`        | `react`, `react-dom`, `react-router-dom`   |
| `@sirou/next`         | `next`                                     |
| `@sirou/svelte`       | `svelte`, `@sveltejs/kit`                  |
| `@sirou/react-native` | `react-native`, `@react-navigation/native` |

---

## 3. Getting Started

### Step 1 — Define Your Routes

Create `src/routes.ts`. This file is your single source of truth.

```typescript
import { defineRoutes } from "@sirou/core";

export const routes = defineRoutes({
  home: {
    path: "/",
    meta: { title: "Home" },
  },
  about: {
    path: "/about",
    meta: { title: "About Us" },
  },
  user: {
    path: "/user/:id",
    params: { id: "string" },
    meta: { title: "User Profile", requiresAuth: true },
    guards: ["auth"],
  },
  products: {
    path: "/products",
    meta: { title: "Products" },
    children: {
      details: {
        path: "/:productId",
        params: { productId: "string" },
        meta: { title: "Product Details" },
        loader: async ({ params }) => {
          const res = await fetch(`/api/products/${params.productId}`);
          return res.json();
        },
      },
    },
  },
  notFound: {
    path: "*",
    meta: { title: "404 Not Found" },
  },
});
```

### Step 2 — Set Up the Provider (React)

```tsx
// src/main.tsx
import { BrowserRouter } from "react-router-dom";
import { SirouRouterProvider } from "@sirou/react";
import { routes } from "./routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SirouRouterProvider config={routes}>
      <App />
    </SirouRouterProvider>
  </BrowserRouter>,
);
```

### Step 3 — Navigate

```tsx
import { useSirouRouter } from "@sirou/react";
import { routes } from "./routes";

function Nav() {
  const router = useSirouRouter<typeof routes>();

  return (
    <nav>
      <button onClick={() => router.go("home")}>Home</button>
      {/* TypeScript error if 'id' is missing */}
      <button onClick={() => router.go("user", { id: "abc" })}>Profile</button>
      <button
        onClick={() => router.go("products.details", { productId: "xyz" })}
      >
        Product
      </button>
    </nav>
  );
}
```

### Step 4 — Register Guards

```tsx
import { useEffect } from "react";
import { useSirouRouter } from "@sirou/react";

function GuardSetup() {
  const router = useSirouRouter();

  useEffect(() => {
    router.registerGuard({
      name: "auth",
      execute: async ({ meta }) => {
        const isLoggedIn = !!localStorage.getItem("token");
        if (!isLoggedIn && meta?.requiresAuth) {
          return { allowed: false, redirect: "/login" };
        }
        return { allowed: true };
      },
    });
  }, [router]);

  return null;
}
```

### Step 5 — Add DevTools

```tsx
import { SirouDevTools } from "@sirou/react";

// Add once at the root of your app
{
  import.meta.env.DEV && <SirouDevTools />;
}
```

---

## 4. Core Concepts

### The Trie Matcher

Sirou uses a **Radix Trie** data structure for route matching. This gives O(log n) performance regardless of how many routes you have.

**Matching Priority:**

1. **Exact match** — `/about` matches `/about` exactly
2. **Param match** — `/user/:id` matches `/user/123`
3. **Wildcard match** — `*` matches anything that didn't match above

This means a wildcard route will never "steal" a match from a more specific route.

### Route Names vs. Paths

Sirou separates the concept of a **route name** (the key in your config object) from the **path** (the URL pattern). You always navigate by name, never by path string.

```typescript
// ✅ Navigate by name — type-safe
router.go("user", { id: "123" });

// ❌ Never navigate by path string in Sirou
router.push("/user/123");
```

Nested routes use **dot notation**: `products.details`.

### The Adapter Pattern

Sirou's core is platform-agnostic. Each platform adapter implements the `SirouAdapter` interface:

```typescript
interface SirouAdapter {
  navigate(url, options?, routeName?, params?): Promise<void>;
  replace(url, options?, routeName?, params?): Promise<void>;
  back(): Promise<void>;
  getCurrentLocation(): Location;
  subscribe(listener): Unsubscribe;
  canGoBack(): boolean;
}
```

This means the same `router.go()` call works identically on React, Svelte, Next.js, and React Native.

### Type Inference Flow

```
defineRoutes({ user: { path: '/user/:id', params: { id: 'string' } } })
        ↓
FlatRouteMap<typeof routes>
        ↓
{ 'user': RouteDefinition<'/user/:id', { id: 'string' }> }
        ↓
router.go('user', { id: string }) ← TypeScript enforces this
```

---

## 5. Route Definition API

### `defineRoutes(config)`

Wraps your config object to provide full TypeScript inference. Always use this.

```typescript
import { defineRoutes } from '@sirou/core';
export const routes = defineRoutes({ ... });
```

### Route Properties

| Property   | Type                    | Required | Description                                                    |
| ---------- | ----------------------- | -------- | -------------------------------------------------------------- |
| `path`     | `string`                | ✅       | URL path. Use `:param` for dynamic segments, `*` for wildcard. |
| `params`   | `RouteParamConfig`      | ❌       | Param type definitions for validation and inference.           |
| `meta`     | `Record<string, any>`   | ❌       | Arbitrary metadata (title, requiresAuth, etc.)                 |
| `guards`   | `string[]`              | ❌       | Names of guards to run before this route.                      |
| `loader`   | `(ctx) => Promise<any>` | ❌       | Async data fetcher, runs before navigation commits.            |
| `children` | `RouteConfig`           | ❌       | Nested child routes.                                           |

### Param Types

```typescript
type ParamType = 'string' | 'number' | 'boolean' | 'date';

// Simple shorthand
params: { id: 'string' }

// Full config with validation and transform
params: {
  page: {
    type: 'number',
    optional: true,
    validate: (v) => v > 0,
    transform: (v) => parseInt(v, 10),
  }
}
```

### Nested Routes

Child routes inherit their parent's path as a prefix:

```typescript
const routes = defineRoutes({
  products: {
    path: "/products", // matches /products
    children: {
      list: { path: "/" }, // matches /products/
      details: {
        path: "/:id", // matches /products/123
        params: { id: "string" },
      },
    },
  },
});

// Navigate to nested route with dot notation
router.go("products.details", { id: "123" });
```

---

## 6. Route Guards

Guards are async functions that run before a navigation commits. They can allow, block, or redirect.

### Registering a Guard

```typescript
router.registerGuard({
  name: "auth",
  execute: async (context) => {
    const { route, params, meta, context: customCtx } = context;

    const isLoggedIn = await checkSession();
    if (!isLoggedIn) {
      return { allowed: false, redirect: "/login" };
    }
    return { allowed: true };
  },
});
```

### Guard Context

```typescript
type GuardContext = {
  route: string; // The target route path string
  params: Record<string, any>; // Resolved params
  meta?: Record<string, any>; // Route metadata
  context?: any; // Optional custom context
};
```

### Guard Result

```typescript
type GuardResult =
  | { allowed: true }
  | { allowed: false; redirect?: string; reason?: string };
```

### Applying Guards to Routes

```typescript
const routes = defineRoutes({
  dashboard: {
    path: "/dashboard",
    guards: ["auth"], // Runs 'auth' guard before entering
    meta: { requiresAuth: true },
  },
  admin: {
    path: "/admin",
    guards: ["auth", "admin"], // Multiple guards run in order
  },
});
```

### Checking Guards Without Navigating

```typescript
const result = await router.checkGuards("dashboard");
if (!result.allowed) {
  console.log("Access denied:", result.reason);
}
```

### Guard Execution Order

When multiple guards are listed, they run **sequentially**. If any guard returns `{ allowed: false }`, subsequent guards are skipped and navigation is blocked.

---

## 7. Data Loaders

Data Loaders allow you to fetch data **before** a route renders. This eliminates loading spinners and content flicker — the component always has data on first render.

### Defining a Loader

```typescript
const routes = defineRoutes({
  products: {
    path: "/products",
    loader: async ({ params, meta }) => {
      const res = await fetch("/api/products");
      return res.json(); // This data is stored in the router
    },
  },
  productDetail: {
    path: "/products/:id",
    params: { id: "string" },
    loader: async ({ params }) => {
      const res = await fetch(`/api/products/${params.id}`);
      return res.json();
    },
  },
});
```

### Loader Context

The loader receives the same context as a guard:

```typescript
type LoaderContext = {
  route: string;
  params: Record<string, any>;
  meta?: Record<string, any>;
};
```

### Accessing Loader Data in React

```tsx
import { useRouteData } from "@sirou/react";

type Product = { id: string; name: string; price: number };

function ProductDetail() {
  const product = useRouteData<Product>();

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </div>
  );
}
```

### Accessing Loader Data Directly

```typescript
const data = router.getLoaderData("productDetail");
```

### Loader Execution Timing

- **On initial load**: If the current route has a loader, it runs asynchronously after the router initializes. The data becomes available and triggers a re-render.
- **On navigation**: The loader runs **before** `adapter.navigate()` is called. Navigation is blocked until the loader resolves.

### Error Handling in Loaders

```typescript
loader: async ({ params }) => {
  try {
    const res = await fetch(`/api/products/${params.id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  } catch (err) {
    // Return a fallback or error state
    return { error: err.message };
  }
},
```

---

## 8. Wildcard & 404 Routes

### Defining a Catch-All Route

Use `path: '*'` to create a route that matches any URL not matched by other routes.

```typescript
const routes = defineRoutes({
  home: { path: "/" },
  about: { path: "/about" },
  notFound: { path: "*", meta: { title: "404 Not Found" } },
});
```

### Matching Priority

The Trie matcher always tries more specific routes first:

1. Exact match (`/about`)
2. Param match (`/user/:id`)
3. Wildcard (`*`)

A wildcard will **never** match a URL that has a more specific route defined.

### 404 Component (React Example)

```tsx
function NotFound() {
  const router = useSirouRouter();
  return (
    <div>
      <h1>404 — Page Not Found</h1>
      <button onClick={() => router.go("home")}>Go Home</button>
    </div>
  );
}
```

### Nested Wildcards

You can define wildcard routes at any nesting level:

```typescript
const routes = defineRoutes({
  dashboard: {
    path: "/dashboard",
    children: {
      overview: { path: "/" },
      settings: { path: "/settings" },
      notFound: { path: "*" }, // Catches /dashboard/anything-else
    },
  },
});
```

---

## 9. React Adapter

### Installation

```bash
npm install @sirou/react @sirou/core react-router-dom
```

### Provider Setup

```tsx
import { BrowserRouter } from "react-router-dom";
import { SirouRouterProvider } from "@sirou/react";
import { routes } from "./routes";

function Root() {
  return (
    <BrowserRouter>
      <SirouRouterProvider config={routes}>
        <App />
      </SirouRouterProvider>
    </BrowserRouter>
  );
}
```

### Hooks

#### `useSirouRouter<T>()`

Returns the fully typed router instance.

```tsx
const router = useSirouRouter<typeof routes>();

router.go("home");
router.go("user", { id: "abc" });
router.replace("about");
router.back();

const url = router.build("user", { id: "abc" }); // '/user/abc'
const current = router.current(); // RouteInfo | null
```

#### `useRouteParams<T>(routeName)`

Returns typed params for the specified route.

```tsx
// At route /user/abc123
const { id } = useRouteParams<typeof routes>("user");
// id: string = 'abc123'
```

#### `useRouteData<T>()`

Returns pre-fetched loader data for the current route.

```tsx
const data = useRouteData<{ name: string; price: number }>();
```

#### `useSirouRoute()`

Reactively returns the current `RouteInfo`.

```tsx
const route = useSirouRoute();
// route.name    => 'user'
// route.path    => '/user/abc'
// route.params  => { id: 'abc' }
// route.meta    => { title: 'User Profile', requiresAuth: true }
// route.query   => {}
```

#### `useRouteTitle(fallback?)`

Syncs `document.title` with `meta.title`.

```tsx
useRouteTitle("My App"); // Fallback when route has no title
```

#### `useRouteAnalytics(callback, deps?)`

Fires on every route change.

```tsx
useRouteAnalytics((info) => {
  analytics.track("page_view", { page: info.name });
});
```

#### `useBreadcrumbs()`

Returns breadcrumb objects for the current path.

```tsx
const crumbs = useBreadcrumbs();
// [{ label: 'Products', path: '/products' }, { label: 'Details', path: '/products/abc' }]
```

### Components

#### `SirouLink`

Type-safe link component.

```tsx
<SirouLink to="user" params={{ id: "abc" }}>
  View Profile
</SirouLink>
```

#### `SirouGuard`

Checks guards before rendering children via `<Outlet />`.

```tsx
// In your React Router route config:
{
  path: '/dashboard',
  element: <SirouGuard routeName="dashboard" />,
  children: [{ index: true, element: <Dashboard /> }],
}
```

#### `SirouDevTools`

Visual debugging panel. Add once at the root.

```tsx
{
  process.env.NODE_ENV === "development" && <SirouDevTools />;
}
```

**DevTools Tabs:**

- **Overview** — Current route name, path, environment info
- **History** — Full navigation history with timestamps
- **Params** — Current route params and query string
- **Meta** — Route metadata as formatted JSON

---

## 10. Next.js Adapter

### Installation

```bash
npm install @sirou/next @sirou/core
```

### App Router Setup (Next.js 13+)

```tsx
// app/providers.tsx
"use client";
import { SirouNextProvider } from "@sirou/next";
import { routes } from "@/routes";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SirouNextProvider config={routes}>{children}</SirouNextProvider>;
}

// app/layout.tsx
import { Providers } from "./providers";
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Hooks

#### `useSirouNextRouter()`

```tsx
"use client";
import { useSirouNextRouter } from "@sirou/next";
import { routes } from "@/routes";

const router = useSirouNextRouter<typeof routes>();
router.go("dashboard");
```

### Server Utilities

#### `buildUrl(routeName, params?)`

Safe for Server Components, `generateMetadata`, and API routes.

```typescript
import { buildUrl } from "@sirou/next";

export async function generateMetadata({ params }) {
  return {
    title: "Product Details",
    alternates: {
      canonical: buildUrl("products.details", { productId: params.id }),
    },
  };
}
```

### Middleware

#### `createSirouMiddleware(config, options)`

Run Sirou guards on the Next.js edge.

```typescript
// middleware.ts
import { createSirouMiddleware } from "@sirou/next";
import { routes } from "./routes";

export const middleware = createSirouMiddleware(routes, {
  guards: {
    auth: async ({ request }) => {
      const token = request.cookies.get("token")?.value;
      if (!token) return { allowed: false, redirect: "/login" };
      return { allowed: true };
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```

### `SirouLink` (Next.js)

Uses `next/link` under the hood with full type safety.

```tsx
import { SirouLink } from "@sirou/next";

<SirouLink to="user" params={{ id: "abc" }} prefetch>
  View Profile
</SirouLink>;
```

---

## 11. Svelte Adapter

### Installation

```bash
npm install @sirou/svelte @sirou/core
```

### Setup

```typescript
// src/lib/router.ts
import { createSirouSvelteRouter } from "@sirou/svelte";
import { routes } from "./routes";

export const router = createSirouSvelteRouter(routes);
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { setupSirouGuards } from '@sirou/svelte';
  import { router } from '$lib/router';

  setupSirouGuards(router, {
    auth: async ({ meta }) => {
      const session = await getSession();
      if (!session && meta?.requiresAuth) {
        return { allowed: false, redirect: '/login' };
      }
      return { allowed: true };
    },
  });
</script>

<slot />
```

### API

#### `createSirouSvelteRouter(config)`

Creates a router backed by SvelteKit's `goto` and `page` store.

#### `setupSirouGuards(router, guards)`

Registers named guards on the router.

#### `useSirouSvelteRoute()`

A Svelte store that reactively tracks the current route.

```svelte
<script>
  import { useSirouSvelteRoute } from '@sirou/svelte';
  const route = useSirouSvelteRoute();
</script>

<p>You are on: {$route?.name}</p>
```

#### Navigation

```svelte
<script>
  import { router } from '$lib/router';
</script>

<button on:click={() => router.go('home')}>Home</button>
<button on:click={() => router.go('user', { id: '123' })}>Profile</button>
```

---

## 12. React Native Adapter

### Installation

```bash
npm install @sirou/react-native @sirou/core @react-navigation/native @react-navigation/stack
```

### Setup

```typescript
// src/router.ts
import { createSirouNativeRouter } from "@sirou/react-native";
import { routes } from "./routes";

export const router = createSirouNativeRouter(routes);
```

```tsx
// App.tsx
import { NavigationContainer } from "@react-navigation/native";
import { SirouNativeProvider } from "@sirou/react-native";
import { router } from "./router";

export default function App() {
  return (
    <NavigationContainer>
      <SirouNativeProvider router={router}>
        <RootNavigator />
      </SirouNativeProvider>
    </NavigationContainer>
  );
}
```

### Hooks

#### `useSirouNativeRouter()`

```tsx
import { useSirouNativeRouter } from "@sirou/react-native";

const router = useSirouNativeRouter<typeof routes>();
router.go("profile", { id: "user123" });
```

#### `useSirouParams(routeName)`

```tsx
import { useSirouParams } from "@sirou/react-native";

function ProfileScreen() {
  const { id } = useSirouParams("profile");
  return <Text>User: {id}</Text>;
}
```

### Deep Linking

`generateDeepLinkConfig` automatically generates a React Navigation `linking` config from your route schema — no manual configuration needed.

```typescript
import { generateDeepLinkConfig } from '@sirou/react-native';
import { routes } from './routes';

const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: generateDeepLinkConfig(routes),
};

// Pass to NavigationContainer
<NavigationContainer linking={linking}>
```

---

## 13. Flutter Bridge

Sirou provides a Dart/Flutter bridge via JSON schema export. This allows your Flutter app to use the same route definitions as your web app.

### Step 1 — Export Schema

```bash
sirou export --output assets/routes.json
```

### Step 2 — Generate Dart Code

```bash
dart run sirou_flutter:generate --input assets/routes.json --output lib/routes.dart
```

### Step 3 — Use in Flutter

```dart
import 'routes.dart';

// Navigate using generated constants
Navigator.pushNamed(context, SirouRoutes.userProfile, arguments: {'id': '123'});
```

### `JSONExporter` (Programmatic)

```typescript
import { JSONExporter } from "@sirou/core";

const exporter = new JSONExporter();
const json = exporter.export(routes);
fs.writeFileSync("routes.json", JSON.stringify(json, null, 2));
```

---

## 14. CLI Reference

### Installation

```bash
npm install -g @sirou/cli
```

### `sirou init`

Scaffolds a starter `routes.ts` in the current directory.

```bash
sirou init
```

Creates a `routes.ts` with home, profile, and settings routes as a template.

---

### `sirou validate`

Validates your route schema for common errors.

```bash
sirou validate
sirou validate --file src/routes.ts
```

**Options:**

| Flag                | Default     | Description              |
| ------------------- | ----------- | ------------------------ |
| `-f, --file <path>` | `routes.ts` | Path to your routes file |

**Checks:**

- Duplicate path definitions
- Param name mismatches between path string and `params` config
- Invalid guard name references

---

### `sirou export`

Exports your route schema to JSON. Used by the Flutter bridge and native integrations.

```bash
sirou export
sirou export --output assets/routes.json
sirou export --file src/routes.ts --output dist/routes.json
```

**Options:**

| Flag                  | Default       | Description              |
| --------------------- | ------------- | ------------------------ |
| `-f, --file <path>`   | `routes.ts`   | Path to your routes file |
| `-o, --output <file>` | `routes.json` | Output JSON file path    |

---

### `sirou docs`

Generates a standalone, interactive HTML documentation portal for your route architecture.

```bash
sirou docs
sirou docs --output my-route-docs.html
```

**Options:**

| Flag                  | Default           | Description              |
| --------------------- | ----------------- | ------------------------ |
| `-f, --file <path>`   | `routes.ts`       | Path to your routes file |
| `-o, --output <file>` | `sirou-docs.html` | Output HTML file path    |

**Recommended workflow:**

```bash
# 1. Export schema first
sirou export --output routes.json

# 2. Generate the portal
sirou docs --output docs/routes.html

# 3. Open in browser
open docs/routes.html
```

The portal shows:

- All route names (flat and nested with dotted keys)
- Route paths
- Guard badges
- Param badges
- Route metadata (formatted JSON)

---

## 15. TypeScript Utilities

Sirou exports several utility types for advanced use cases.

### `InferParams<Config>`

Infers the params object type from a `RouteParamConfig`.

```typescript
import { InferParams } from "@sirou/core";

type MyParams = InferParams<{
  id: "string";
  page: { type: "number"; optional: true };
}>;
// => { id: string; page?: number }
```

### `FlatRouteMap<Config>`

Flattens a nested route config into a single-level map with dotted keys.

```typescript
import { FlatRouteMap } from "@sirou/core";

type Routes = FlatRouteMap<typeof routes>;
// => { 'home': ..., 'products': ..., 'products.details': ... }
```

### `RouteInfo`

The object returned by `router.current()` and `useSirouRoute()`.

```typescript
type RouteInfo = {
  name: string;
  path: string;
  params: Record<string, any>;
  query: Record<string, any>;
  meta: Record<string, any>;
};
```

### `GuardContext`

The context object passed to guard `execute` functions.

```typescript
type GuardContext<TContext = any> = {
  route: string;
  params: Record<string, any>;
  query?: Record<string, any>;
  meta?: Record<string, any>;
  context?: TContext;
};
```

### `GuardResult`

The return type of a guard's `execute` function.

```typescript
type GuardResult =
  | { allowed: true }
  | { allowed: false; redirect?: string; reason?: string };
```

### `SirouRouter<TConfig>` Interface

The full typed router interface. All adapters implement this.

```typescript
interface SirouRouter<TConfig extends RouteConfig> {
  go<TRoute extends keyof FlatRouteMap<TConfig>>(
    route: TRoute,
    ...params: ParamsFromRoute<FlatRouteMap<TConfig>[TRoute]>
  ): Promise<void>;

  replace<TRoute extends keyof FlatRouteMap<TConfig>>(
    route: TRoute,
    ...params: ParamsFromRoute<FlatRouteMap<TConfig>[TRoute]>
  ): Promise<void>;

  build<TRoute extends keyof FlatRouteMap<TConfig>>(
    route: TRoute,
    ...params: ParamsFromRoute<FlatRouteMap<TConfig>[TRoute]>
  ): string;

  back(): Promise<void>;
  current(): RouteInfo | null;
  canGoBack(): boolean;
  registerGuard(guard: RouteGuard): void;
  subscribe(listener: (location: Location) => void): Unsubscribe;
  getHistory(): RouteInfo[];
  getLoaderData(routeName: string): any;
  getMeta<TRoute extends keyof FlatRouteMap<TConfig>>(route: TRoute): RouteMeta;
  checkGuards<TRoute extends keyof FlatRouteMap<TConfig>>(
    route: TRoute,
    ...params: ParamsFromRoute<FlatRouteMap<TConfig>[TRoute]>
  ): Promise<GuardResult>;
}
```

---

## 16. Advanced Patterns

### Analytics Integration

Use `useRouteAnalytics` to automatically track every page view:

```tsx
import { useRouteAnalytics } from "@sirou/react";

function AnalyticsProvider({ children }) {
  useRouteAnalytics((info) => {
    // Google Analytics 4
    window.gtag("event", "page_view", {
      page_title: info.meta.title,
      page_path: info.path,
      page_location: window.location.href,
    });

    // Segment
    window.analytics.page(info.name, {
      path: info.path,
      title: info.meta.title,
    });
  });

  return children;
}
```

### Breadcrumbs

```tsx
import { useBreadcrumbs } from "@sirou/react";

function Breadcrumbs() {
  const crumbs = useBreadcrumbs();

  return (
    <nav aria-label="breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={crumb.path}>
          {i < crumbs.length - 1 ? (
            <a href={crumb.path}>{crumb.label}</a>
          ) : (
            <span aria-current="page">{crumb.label}</span>
          )}
          {i < crumbs.length - 1 && " / "}
        </span>
      ))}
    </nav>
  );
}
```

### Dynamic Title Management

```tsx
import { useRouteTitle } from "@sirou/react";

function TitleManager() {
  useRouteTitle("My App"); // Fallback title
  return null;
}

// Route meta drives the title automatically:
// { meta: { title: 'User Profile' } } => document.title = 'User Profile'
// No meta.title => document.title = 'My App'
```

### Programmatic Guard Checks

Check guards before showing UI elements, not just before navigation:

```tsx
import { useEffect, useState } from "react";
import { useSirouRouter } from "@sirou/react";

function AdminButton() {
  const router = useSirouRouter();
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    router.checkGuards("admin").then((result) => {
      setCanAccess(result.allowed);
    });
  }, [router]);

  if (!canAccess) return null;
  return <button onClick={() => router.go("admin")}>Admin Panel</button>;
}
```

### Navigation History

```tsx
import { useSirouRouter } from "@sirou/react";

function HistoryPanel() {
  const router = useSirouRouter();
  const history = router.getHistory();

  return (
    <ul>
      {history.map((entry, i) => (
        <li key={i}>
          {entry.name} — {entry.path}
        </li>
      ))}
    </ul>
  );
}
```

### Building URLs Without Navigating

Useful for generating `href` attributes, canonical URLs, or sharing links:

```tsx
const router = useSirouRouter<typeof routes>();

const shareUrl = router.build("products.details", { productId: "abc" });
// => '/products/abc'

navigator.clipboard.writeText(window.location.origin + shareUrl);
```

### Subscribing to Route Changes

```typescript
const unsubscribe = router.subscribe((location) => {
  console.log("Navigated to:", location.pathname);
});

// Later, clean up
unsubscribe();
```

### Multi-Platform Route Sharing

Since `routes.ts` is plain TypeScript, you can share it across a monorepo:

```
my-monorepo/
  packages/
    routes/         ← Shared package
      src/
        routes.ts
      package.json
    web/            ← Uses @sirou/react
    mobile/         ← Uses @sirou/react-native
    backend/        ← Uses routes for URL generation
```

```typescript
// packages/routes/src/routes.ts
import { defineRoutes } from '@sirou/core';
export const routes = defineRoutes({ ... });

// packages/web/src/main.tsx
import { routes } from '@my-app/routes';
import { SirouRouterProvider } from '@sirou/react';

// packages/mobile/src/App.tsx
import { routes } from '@my-app/routes';
import { createSirouNativeRouter } from '@sirou/react-native';
```

---

## 17. Migrating from React Router

If you're currently using `react-router-dom` directly, here's how to migrate to Sirou.

### Before (React Router)

```tsx
// Scattered route definitions
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/user/:id" element={<UserProfile />} />
  <Route path="*" element={<NotFound />} />
</Routes>;

// Navigation — no type safety
const navigate = useNavigate();
navigate("/user/abc"); // typo-prone

// Params — untyped
const { id } = useParams(); // id: string | undefined
```

### After (Sirou)

```tsx
// Centralized, typed route schema
const routes = defineRoutes({
  home: { path: "/" },
  user: { path: "/user/:id", params: { id: "string" } },
  notFound: { path: "*" },
});

// Navigation — fully type-safe
const router = useSirouRouter<typeof routes>();
router.go("user", { id: "abc" }); // TypeScript validates this

// Params — typed
const { id } = useRouteParams<typeof routes>("user"); // id: string
```

### Migration Steps

1. **Install Sirou**: `npm install @sirou/core @sirou/react`
2. **Create `routes.ts`**: Move all your route paths into `defineRoutes()`
3. **Wrap with provider**: Add `SirouRouterProvider` inside your existing `BrowserRouter`
4. **Replace `useNavigate`**: Use `useSirouRouter()` and `router.go()`
5. **Replace `useParams`**: Use `useRouteParams(routeName)`
6. **Add guards**: Replace manual auth checks with `guards: ['auth']`
7. **Add loaders**: Replace `useEffect` data fetching with `loader` functions

> **Note:** Sirou works alongside `react-router-dom` — you don't need to remove it. `SirouRouterProvider` uses it internally.

---

## 18. Roadmap

The following features are planned for future releases:

### Near Term

| Feature                          | Description                                                       |
| -------------------------------- | ----------------------------------------------------------------- |
| **Type-Safe Query Params**       | `query: { page: 'number', search: 'string' }` with full inference |
| **Zod / Valibot Integration**    | Native schema-based param validation                              |
| **`useRouteData` Suspense Mode** | Integrate with React Suspense for streaming                       |

### Medium Term

| Feature                   | Description                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ |
| **i18n Routing**          | Translated paths with automatic locale detection (`/en/about`, `/fr/a-propos`) |
| **Micro-Frontend Kernel** | Use Sirou to orchestrate routes across multiple child apps                     |
| **Visual Route Editor**   | A local dev server GUI for editing routes visually                             |

### Long Term

| Feature                  | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| **Edge Middleware**      | First-class support for Vercel/Cloudflare edge guard execution |
| **Automatic Sitemap**    | Generate `sitemap.xml` from your route schema                  |
| **AI Route Suggestions** | IDE plugin that suggests route names as you type               |

---

_Sirou is MIT licensed. Contributions are welcome._
