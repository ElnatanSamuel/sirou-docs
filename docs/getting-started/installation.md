# Installation

Install Sirou via npm. Sirou is modular, so you only install the core engine and the specific adapter for your framework.

## 1. Install Core Engine

The core engine handles the Radix Trie matching, state management, and type inference.

```bash
npm install @sirou/core
```

## 2. Install Platform Adapter

Choose the adapter that matches your frontend framework.

| Platform         | Package               |
| :--------------- | :-------------------- |
| **React**        | `@sirou/react`        |
| **Next.js**      | `@sirou/nextjs`       |
| **React Native** | `@sirou/react-native` |
| **Svelte**       | `@sirou/svelte`       |

```bash
# Example: Installing the React adapter
npm install @sirou/react
```

## Peer Dependencies

Ensure your project meets the following peer dependency requirements:

:::features

### React / Next.js

React 18+ and React Router 6+ (for React adapter).

### Svelte

Svelte 4+ or SvelteKit 2+.

### React Native

React Native 0.70+ and React Navigation 6+.
:::

## TypeScript Configuration

Sirou relies heavily on advanced TypeScript features. Ensure your `tsconfig.json` is configured for the best experience:

```json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "node",
    "target": "ESNext"
  }
}
```

---

Next: Build your first route in the [Quick Start](quick-start.md).
