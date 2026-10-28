# PyInterview Hub - AI Agents & Customization Architecture

This directory (`.agents/`) configures specialized AI subagents, domain skills, and coding rules tailored specifically to the **PyInterview Hub** codebase.

---

## 🛠️ Specialized Skills (`.agents/skills/`)

| Skill | Purpose | Activation Context |
| :--- | :--- | :--- |
| [`pyodide-sandbox-security`](./skills/pyodide-sandbox-security/SKILL.md) | Enforces Python WebAssembly runtime isolation, restricts `import js` host access, prevents infinite loops from freezing the browser, and configures AST security gates. | When editing `pyodideRunner.ts`, building code runners, or securing code execution. |
| [`python-test-harness-builder`](./skills/python-test-harness-builder/SKILL.md) | Standardizes test harnesses for Python questions, safely tests generators/streams without hanging, validates AST constraints, and formats test results. | When creating or debugging question test suites. |
| [`py-interview-perf-optimizer`](./skills/py-interview-perf-optimizer/SKILL.md) | Guides Vite code splitting, chunking optimization (<500kB target), eliminates React 19 cascading renders (oxlint warnings), and tunes Lighthouse metrics. | When improving load speed, splitting bundles, or resolving React hook warnings. |
| [`py-question-authoring`](./skills/py-question-authoring/SKILL.md) | Step-by-step authoring workflow for new problems across all tracks (`fundamentals`, `algorithms`, `dataManipulation`, `mlEngineering`) with full i18n parity. | When adding new questions, starter code, or translations. |

---

## 🤖 Registered Subagents

These subagents are defined and can be invoked using `invoke_subagent`:

1. **`python-sandbox-engineer`**:
   - Focus: WebAssembly runtime security, Pyodide 0.26 / Python 3.12 isolation, timeout handling, AST visitors, and sandbox memory management.
2. **`frontend-perf-guardian`**:
   - Focus: React 19 compiler purity, Vite manual chunking, Monaco Editor lazy-loading, Web Worker execution, WCAG accessibility, and zero-jank UI.
3. **`interview-curriculum-architect`**:
   - Focus: Technical interview curriculum, problem statements, comprehensive test cases, Python 3.12 reference solutions, and trilingual i18n (`en`, `es`, `pt-BR`).

---

## 📋 Workspace Rules (`.agents/rules/AGENTS.md`)

- **Security Boundary**: Never expose `window`, `document`, or host credentials to user-executed Python scripts.
- **Generator Safety**: Never consume generator outputs with unconstrained `list(stream)` in test runners.
- **Performance**: Strict bundle splitting and clean React 19 effect dependencies.
- **Typing & i18n**: Strict TypeScript (zero `any`) and 100% string parity across English, Portuguese, and Spanish.
