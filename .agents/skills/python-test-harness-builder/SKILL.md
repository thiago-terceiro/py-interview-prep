---
name: python-test-harness-builder
description: >-
  Designs, verifies, and standardizes test harnesses for Python coding challenges and interview questions.
  Use when writing or modifying question test harnesses, adding edge cases, testing stream/generator outputs,
  validating AST constraints (e.g. no built-in sort), capturing stdout, or debugging test runner errors.
---

# Python Test Harness Builder

This skill defines the canonical structure and best practices for creating bulletproof, informative Python test harnesses executed inside Pyodide WebAssembly.

---

## 1. Test Harness Architecture

Each question in `src/data/questions/*.ts` includes a `testHarness` string.
The test harness runs immediately after the user's code executes, appending structured test results to `_test_items`.

### Result Schema Expected by `pyodideRunner.ts`:
```python
_test_items.append({
    "input": str,       # Formatted call, e.g. "chunked([1, 2, 3], 2)"
    "expected": str,    # String representation of expected output
    "actual": str,      # String representation of actual result or error
    "passed": bool,     # True if test passed, False otherwise
    "stdout": str,      # (Optional) Captured per-test prints
    "error": str        # (Optional) Exception message if raised
})
```

---

## 2. Canonical Test Harness Template

```python
def _run_suite():
    import itertools
    import time

    def _test(name, call_repr, expected, fn):
        try:
            actual = fn()
            
            # Safe equality check
            passed = (actual == expected)
            _test_items.append({
                "input": call_repr,
                "expected": repr(expected),
                "actual": repr(actual),
                "passed": passed
            })
        except Exception as ex:
            _test_items.append({
                "input": call_repr,
                "expected": repr(expected),
                "actual": f"Error: {type(ex).__name__}: {ex}",
                "passed": False,
                "error": str(ex)
            })

    # Test Case 1: Standard input
    _test(
        "Standard sequence",
        "solution([1, 2, 3, 4, 5])",
        [2, 4],
        lambda: solution([1, 2, 3, 4, 5])
    )

    # Test Case 2: Boundary / Empty input
    _test(
        "Empty list boundary",
        "solution([])",
        [],
        lambda: solution([])
    )

_run_suite()
```

---

## 3. Critical Rules for Stream and Generator Testing

When testing functions that return generators or iterables (such as `chunked`, `flatten`, or tree traversals):

### Rule 1: Guard Against Infinite Generators
**Never** do `list(user_result)` directly. If the user's generator has a bug, it will hang indefinitely:
```python
# ❌ DANGEROUS: Will hang indefinitely on infinite streams
res = list(chunked(infinite_stream(), 3))

# ✅ SAFE: Pull only expected number of items + 1
import itertools
expected_count = len(expected_output)
safe_items = list(itertools.islice(user_result, expected_count + 1))
passed = (safe_items == expected_output)
```

### Rule 2: Support Both Generators and Materialized Collections
Interview questions often accept either generators, lists, or tuples:
```python
# Normalizing generator output to list for comparison:
if hasattr(actual, '__iter__') and not isinstance(actual, (list, str)):
    actual = [list(c) if hasattr(c, '__iter__') and not isinstance(c, (list, str)) else c for c in actual]
```

---

## 4. AST Constraint Validation

If a question requires solving without specific built-in methods (e.g. "Do not use `sort()`"):

```python
import ast

def _check_ast_constraints(code_str):
    tree = ast.parse(code_str)
    for node in ast.walk(tree):
        if isinstance(node, ast.Attribute) and node.attr == "sort":
            raise AssertionError("Constraint violation: `.sort()` method is forbidden.")
        if isinstance(node, ast.Name) and node.id == "sorted":
            raise AssertionError("Constraint violation: `sorted()` function is forbidden.")

try:
    _check_ast_constraints(__USER_CODE_RAW__)
except Exception as ex:
    _test_items.append({
        "input": "Constraint Check: AST Static Analysis",
        "expected": "No forbidden built-in methods",
        "actual": str(ex),
        "passed": False,
        "error": str(ex)
    })
```
