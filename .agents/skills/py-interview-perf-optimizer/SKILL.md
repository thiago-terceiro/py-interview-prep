---
name: py-interview-perf-optimizer
description: >-
  Optimizes application performance, bundle size, Vite code-splitting, React 19 rendering, and Lighthouse audits.
  Use when addressing Vite bundle size warnings (>500kB chunks), fixing Oxlint/React-compiler cascading render warnings,
  optimizing Monaco Editor loading, or profiling Pyodide WebAssembly startup times.
---

# PyInterview Performance Optimizer

This skill provides step-by-step procedures and configuration recipes to maintain sub-second load times, lightweight bundles, and 100% Lighthouse scores across Performance, Accessibility, and Best Practices.

---

## 1. Bundle Code-Splitting in `vite.config.ts`

Currently, `npm run build` generates a single large bundle chunk (~895 kB).
Split heavy dependencies into asynchronous, on-demand chunks:

### Recommended `vite.config.ts` Configuration:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-monaco': ['@monaco-editor/react'],
          'vendor-icons': ['lucide-react'],
          'vendor-confetti': ['canvas-confetti']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
});
```

---

## 2. React 19 Render Optimization & Effect Hygiene

Oxlint flags synchronous `setState` calls inside `useEffect` (`react(set-state-in-effect)`). In React 19, this triggers cascading renders and de-optimizes the React Compiler.

### Recipe 1: Derive Values in Render Rather Than Synchronous Effects
```tsx
// ❌ BAD: Cascading render warning
useEffect(() => {
  const computed = calculateSteps(array, target);
  setSteps(computed);
  setCurrentIndex(0);
}, [array, target]);

// ✅ GOOD: Compute directly in render or useMemo
const steps = useMemo(() => calculateSteps(array, target), [array, target]);
```

### Recipe 2: Proper Hook Dependencies
In `ThemeProvider.tsx` and `LanguageContext.tsx`:
- Always include setter functions or stabilize them with `useCallback`.
- Provide full dependency arrays to prevent stale closures.

---

## 3. Pyodide Startup & Memory Profiling

1. **Defer Pyodide Initialization**:
   - Do not load Pyodide on pages that don't execute Python (e.g. Home, Question Catalog, Algo Patterns, Flashcards).
   - Only call `pyodideRunner.init()` when entering `ProblemArena` or executing a REPL command.
2. **Package Preloading Strategy**:
   - Only invoke `pyodide.loadPackage(['numpy', 'pandas'])` if the active question has `requiredPackages: ['numpy']`.
   - Track loaded packages with `Set<string>` in `PyodideRunnerService` to avoid redundant network requests.
3. **WASM Garbage Collection**:
   - After heavy batch runs, invoke Python's `gc.collect()` inside Pyodide to reclaim WebAssembly heap space.

---

## 4. Verification Commands

Run these commands before any commit or release:
```bash
# 1. Type verification
npm run build

# 2. Linter & React compiler check
npm run lint

# 3. Verify chunk sizes under dist/
dir dist\assets\*.js
```
