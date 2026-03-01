# Migration Guide

Transitioning to Sirou from a traditional router like React Router or Next.js Link is straightforward. The primary shift is moving from **Path-Based Navigation** to **Schema-Based Navigation**.

## From React Router

| React Router              | Sirou                                          |
| :------------------------ | :--------------------------------------------- |
| `<Link to="/user/123">`   | `<SirouLink to="user" params={{ id: '123' }}>` |
| `navigate('/settings')`   | `router.go('settings')`                        |
| `useParams()`             | `useRouteParams('routeName')`                  |
| `useEffect` data fetching | `loader` in route config                       |

### Step-by-Step Migration

1.  **Define your routes**: Take your existing `<Route />` components and map their paths into a `routes.ts` file.
2.  **Replace Link components**: Slowly swap out `<Link />` for `<SirouLink />`.
3.  **Encapsulate Logic**: Move authorization logic from `useEffect` into Sirou Guards.

## From Next.js

Sirou is fully compatible with Next.js. You can use Sirou purely for its **URL Generation** and **Type Inference** while keeping Next.js for rendering.

### The Conversion

```tsx
// Instead of this:
<Link href={`/blog/${post.slug}`}>...</Link>;

// Use this:
import { getUrl } from "@sirou/next";
<Link href={getUrl("blog.post", { slug: post.slug })}>...</Link>;
```

## Breaking Changes from v0.x

- `defineSchema` renamed to `defineRoutes`.
- `router.navigateTo` renamed to `router.go`.
- `meta` is now strictly typed via the generic parameter in `defineRoutes`.

---

Need help? Open an issue on GitHub or check the [Roadmap](roadmap.md) for upcoming compatibility features.
