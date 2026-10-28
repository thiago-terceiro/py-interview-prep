---
name: pyodide-sandbox-security
description: >-
  Audits, enforces, and implements security safeguards for client-side Python execution in Pyodide WebAssembly.
  Use when modifying PyodideRunnerService, writing code runners, handling user-submitted Python code,
  preventing browser tab freezes (infinite loops), securing against DOM/credential access via 'import js',
  or configuring Content Security Policy (CSP).
---

# Pyodide Sandbox Security

This skill provides step-by-step procedures and code patterns to guarantee safe, isolated Python execution inside the browser via Pyodide WebAssembly.

---

## 1. Threat Model & Risks in Pyodide

When executing arbitrary Python code in the browser:
1. **DOM & Host Environment Access (`import js`)**: Pyodide by default exposes the JavaScript global scope. Untrusted code can access `js.document.cookie`, `js.localStorage`, or modify the DOM unless restricted.
2. **Infinite Loops & UI Freezing**: Long computations or `while True:` blocks run synchronously on the main thread, locking the UI thread and freezing user tabs.
3. **Memory Exhaustion (WASM OOM)**: Unbounded array allocations (`[0] * 10**8`) trigger WASM heap out-of-memory errors that crash the Pyodide instance.
4. **Data Exfiltration via Network**: Python libraries (e.g. `urllib`, `requests` via pyodide-http) or `import js; js.fetch(...)` can make unauthorized external requests.

---

## 2. Security Safeguards

### A. Restricting Host Environment Access
In `pyodideRunner.ts`, ensure that user scripts execute in a sanitized global dictionary without direct access to `js` or sensitive host globals:

```python
# Sanitized user namespace
sanitized_globals = {
    "__name__": "__main__",
    "__doc__": "PyInterview Sandboxed Runtime",
    "itertools": itertools,
    "collections": collections,
    "math": math,
    "functools": functools,
    "heapq": heapq,
    "bisect": bisect,
    "typing": typing,
}

# Block or mask the 'js' module import if untrusted
import sys
if "js" in sys.modules:
    del sys.modules["js"]
```

### B. Safe String Passing (No String Concatenation)
Never interpolate user code into Python strings using JavaScript template literals:
```typescript
// ❌ INSECURE: Vulnerable to code escaping and syntax errors
py.runPython(`code = """${userCode}"""`);

// ✅ SECURE: Pass via Pyodide globals directly
py.globals.set('__USER_CODE_RAW__', userCode);
```

### C. Preventing Infinite Loops in Test Harnesses
When testing generators, iterators, or recursive functions:
- **NEVER** evaluate `list(stream)` without an explicit upper bound.
- Use `itertools.islice(stream, MAX_LIMIT)` before calling `list()`:

```python
import itertools

# Safe consumption of user iterables:
MAX_TEST_ITEMS = 500
user_output = user_fn(*args)
if hasattr(user_output, '__iter__') and not isinstance(user_output, (list, tuple, dict, set, str)):
    # Safeguard against infinite streams
    safe_output = list(itertools.islice(user_output, MAX_TEST_ITEMS + 1))
    if len(safe_output) > MAX_TEST_ITEMS:
        raise ValueError(f"Stream produced more than {MAX_TEST_ITEMS} items (possible infinite generator).")
```

### D. AST Constraint Verification
To safely check code structure (e.g., verifying student didn't use `list.sort` or `builtins.eval`):
```python
import ast

class SecurityVisitor(ast.NodeVisitor):
    def __init__(self):
        self.disallowed_found = []

    def visit_Import(self, node):
        for alias in node.names:
            if alias.name in ("js", "subprocess", "os", "sys", "eval"):
                self.disallowed_found.append(f"Importing '{alias.name}' is prohibited.")
        self.generic_visit(node)

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name) and node.func.id in ("eval", "exec", "compile", "open"):
            self.disallowed_found.append(f"Calling built-in '{node.func.id}()' is prohibited.")
        self.generic_visit(node)

# Run verification before execution
tree = ast.parse(user_code)
visitor = SecurityVisitor()
visitor.visit(tree)
if visitor.disallowed_found:
    raise SecurityError("; ".join(visitor.disallowed_found))
```

---

## 3. Web Worker Architecture (Recommended Upgrade)

To ensure legitimate 100% responsiveness and enable hard execution termination:
1. Move Pyodide initialization and execution to a dedicated Web Worker (`src/workers/pyodide.worker.ts`).
2. Main thread communicates with the worker via `postMessage`.
3. If execution exceeds `MAX_TIMEOUT_MS` (e.g. 5000ms), main thread calls `worker.terminate()` and spins up a fresh worker instance, ensuring zero UI lag.
