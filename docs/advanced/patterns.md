# Advanced Patterns

Once you've mastered the basics, you can use Sirou to solve complex architectural challenges in large-scale applications.

## 1. Analytics & Tracking

Instead of sprinkling tracking code in every button click, use a global router subscription to track page views and navigation events.

```typescript
router.subscribe(({ route, params, meta }) => {
  // Track Page View
  analytics.track("page_view", {
    page_name: route,
    title: meta.title,
    ...params,
  });
});
```

## 2. Dynamic Breadcrumbs

Since Sirou knows the hierarchy of your routes, you can generate breadcrumbs dynamically from the current route name.

```tsx
function Breadcrumbs() {
  const currentRoute = useCurrentRouteName(); // e.g. "admin.users.details"
  const parts = currentRoute.split("."); // ["admin", "users", "details"]

  return (
    <nav>
      {parts.map((part, i) => (
        <SirouLink key={part} to={parts.slice(0, i + 1).join(".")}>
          {part}
        </SirouLink>
      ))}
    </nav>
  );
}
```

## 3. Persistent Query Parameters

Sometimes you want query parameters (like `?theme=dark` or `?affiliate=123`) to persist across multiple navigations. Use a global guard to append these to every redirect.

```typescript
router.registerGuard({
  name: "persist-query",
  execute: async ({ query, router }) => {
    if (query.affiliate && !router.nextQuery.affiliate) {
      return {
        allowed: true,
        query: { ...router.nextQuery, affiliate: query.affiliate },
      };
    }
    return { allowed: true };
  },
});
```

## 4. Multi-Tenant Routing

If your app supports multiple subdomains or tenants (e.g., `tenant1.app.com`), you can use Sirou to match the host and inject it into your parameters.

```typescript
const routes = defineRoutes({
  tenantHome: {
    path: "/:tenantId/home",
    params: { tenantId: "string" },
  },
});

// Middleware can detect the subdomain and rewrite the internal URL
```

## 5. Pre-fetching for Speed

You can use the `router.preload(routeName, params)` method to execute loaders for a page _before_ the user clicks a link (e.g., on hover).

```tsx
<SirouLink to="dashboard" onMouseEnter={() => router.preload("dashboard")}>
  Dashboard
</SirouLink>
```

---

These patterns transform a simple router into a powerful application orchestrator.

Next: Deep dive into [TypeScript Techniques](typescript.md).
