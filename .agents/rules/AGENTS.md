# PyInterview Hub - Workspace Rules & Engineering Standards

These rules apply across the entire `py-interview-prep` codebase. All agents and pair programmers must adhere strictly to these principles.

---

## 1. Security Architecture (Pyodide & Execution Sandboxing)

1. **Host Isolation**:
   - Python code executed via Pyodide runs in the user's browser. It must NEVER have direct access to sensitive host capabilities (`window.localStorage`, `sessionStorage`, `document.cookie`).
   - In test harnesses and runner scripts, disallow or sanitize imports of `js` unless strictly required for isolated canvas rendering.
2. **Execution Timeouts & Infinite Loop Protection**:
   - All code execution must be guarded against runaway loops (`while True:`, deep recursion).
   - In test harnesses, lazy streams and generators must NEVER be consumed with unconditional `list()` or `[*gen]` without boundary or count limits.
3. **AST Validation**:
   - When verifying constraints (e.g. "Do not use `sort()`", "Solve without `import collections`"), use Python's `ast` module to inspect syntax trees rather than simple regex or string search.
   - Always catch syntax and parsing errors gracefully in the test harness without crashing the runner.
4. **Input Sanitization**:
   - Never pass unescaped user code through string concatenation into Python scripts. Pass code via `pyodide.globals.set()` to eliminate script injection and escaping bugs.

---

## 2. Performance & WebAssembly Standards

1. **Bundle Size & Chunking**:
   - Maintain lazy loading for heavy dependencies (Monaco Editor, Visualizer components, and large question catalogs).
   - Target bundle chunks under 500 kB gzip.
2. **React 19 Render Purity**:
   - No synchronous `setState` inside `useEffect` that triggers cascading renders.
   - Derive state during render or synchronize only when interacting with external systems (like Pyodide worker listeners).
   - All hooks must declare accurate dependency arrays compliant with Oxlint / React Compiler rules.
3. **Package Preloading**:
   - Only load packages (`numpy`, `pandas`, `scipy`) when entering tracks or problems that explicitly require them via `requiredPackages`.

---

## 3. Strict TypeScript & i18n Parity

1. **Strict Types**:
   - Maintain 100% TypeScript compliance. Run `tsc -b` to verify zero type errors.
   - Avoid `any` types. Define explicit types for test results, questions, and execution payloads in `src/types/`.
2. **Trilingual i18n Parity**:
   - Every user-facing UI string must exist in:
     - `src/locales/en.ts` (English)
     - `src/locales/ptBR.ts` (Portuguese - Brazil)
     - `src/locales/es.ts` (Spanish)
   - Zero hardcoded English strings in UI templates.

---

## 4. Accessibility (a11y) & Visual Standards

1. Keyboard navigable controls with visible focus rings (`focus-visible:ring-2`).
2. Semantic HTML elements (`<header>`, `<main>`, `<section>`, `<button>`).
3. Screen-reader accessible labels (`aria-label`) on all icon-only buttons (theme toggle, sound toggle, run button).
4. Contrast ratio adhering to WCAG AA / AAA standards across both Dark and Light themes.
