import type { ExecutionResult, ReplResult, ScriptRunResult } from '../types';


declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<any>;
    pyodideInstance?: any;
  }
}

export type PyodideStatus = 
  | 'idle'
  | 'loading-pyodide'
  | 'loading-packages'
  | 'ready'
  | 'running'
  | 'error';

class PyodideRunnerService {
  private pyodide: any = null;
  private status: PyodideStatus = 'idle';
  private statusListeners: Array<(status: PyodideStatus, message?: string) => void> = [];
  private loadedPackages = new Set<string>();
  private initPromise: Promise<any> | null = null;

  public subscribeStatus(listener: (status: PyodideStatus, message?: string) => void): () => void {
    this.statusListeners.push(listener);
    listener(this.status);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  private setStatus(status: PyodideStatus, message?: string) {
    this.status = status;
    this.statusListeners.forEach(listener => listener(status, message));
  }

  public getStatus(): PyodideStatus {
    return this.status;
  }

  public async init(): Promise<any> {
    if (this.pyodide) return this.pyodide;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        this.setStatus('loading-pyodide', 'Initializing Python 3.12 WebAssembly runtime...');

        // Ensure pyodide script is loaded
        if (!window.loadPyodide) {
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.querySelector('script[src*="pyodide.js"]');
            if (existingScript) {
              existingScript.addEventListener('load', () => resolve());
              existingScript.addEventListener('error', () => reject(new Error('Failed to load Pyodide script from CDN')));
            } else {
              const script = document.createElement('script');
              script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
              script.async = true;
              script.onload = () => resolve();
              script.onerror = () => reject(new Error('Failed to load Pyodide script from CDN'));
              document.head.appendChild(script);
            }
          });
        }

        if (!window.loadPyodide) {
          throw new Error('Pyodide script failed to expose window.loadPyodide');
        }

        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
        });

        this.pyodide = pyodide;
        window.pyodideInstance = pyodide;
        this.setStatus('ready', 'Python 3.12 WASM Engine Ready');
        return pyodide;
      } catch (err: any) {
        console.error('Pyodide initialization error:', err);
        this.setStatus('error', `Failed to load Python environment: ${err.message || String(err)}`);
        throw err;
      }
    })();

    return this.initPromise;
  }

  public async ensurePackages(packages: string[]): Promise<void> {
    const needed = packages.filter(pkg => !this.loadedPackages.has(pkg));
    if (needed.length === 0) return;

    const py = await this.init();
    try {
      this.setStatus('loading-packages', `Loading packages (${needed.join(', ')})...`);
      await py.loadPackage(needed);
      needed.forEach(pkg => this.loadedPackages.add(pkg));
      this.setStatus('ready', 'Packages loaded & Ready');
    } catch (err: any) {
      console.error('Failed to load packages:', err);
      this.setStatus('ready', `Warning: Some packages could not be preloaded: ${err.message}`);
    }
  }

  public async runCodeWithHarness(
    userCode: string,
    testHarness: string,
    requiredPackages: string[] = []
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    try {
      this.setStatus('running', 'Executing tests in Python runtime...');
      const py = await this.init();

      if (requiredPackages.length > 0) {
        await this.ensurePackages(requiredPackages);
      }

      // Pass user code and test harness via Pyodide globals to avoid escaping issues
      py.globals.set('__USER_CODE_RAW__', userCode);
      py.globals.set('__TEST_HARNESS_RAW__', testHarness);

      // Wrapper script that runs user code, executes test cases, captures print stdout & exceptions
      const runnerScript = `
import sys
import io
import json
import time
import traceback

_captured_stdout = io.StringIO()
_original_stdout = sys.stdout
sys.stdout = _captured_stdout

_execution_error = None
_test_items = []
_start_t = time.perf_counter()

try:
    # Prepare execution environment
    user_globals = {
        "__name__": "__main__",
        "__file__": "solution.py",
    }
    
    # 1. Execute User Code
    exec(__USER_CODE_RAW__, user_globals)
    
    # 2. Execute Test Harness
    harness_globals = dict(user_globals)
    harness_globals["_test_items"] = _test_items
    exec(__TEST_HARNESS_RAW__, harness_globals)

except Exception as ex:
    _execution_error = traceback.format_exc()

sys.stdout = _original_stdout
_elapsed_ms = round((time.perf_counter() - _start_t) * 1000, 2)

_result_payload = {
    "stdout": _captured_stdout.getvalue(),
    "error": _execution_error,
    "elapsedMs": _elapsed_ms,
    "tests": _test_items
}

json.dumps(_result_payload)
`;

      const jsonStrResult = await py.runPythonAsync(runnerScript);
      const parsed = JSON.parse(jsonStrResult);
      const executionTimeMs = parsed.elapsedMs || Math.round(performance.now() - startTime);

      if (parsed.error && (!parsed.tests || parsed.tests.length === 0)) {
        this.setStatus('ready', 'Execution finished with error');
        return {
          success: false,
          passedCount: 0,
          totalCount: 0,
          results: [],
          stdout: parsed.stdout || '',
          executionTimeMs,
          error: parsed.error,
        };
      }

      const results = (parsed.tests || []).map((t: any, index: number) => ({
        id: index + 1,
        input: String(t.input ?? ''),
        expected: String(t.expected ?? ''),
        actual: String(t.actual ?? ''),
        passed: Boolean(t.passed),
        stdout: t.stdout || '',
        error: t.error || undefined,
      }));

      const passedCount = results.filter((r: any) => r.passed).length;
      const totalCount = results.length;
      const success = totalCount > 0 && passedCount === totalCount && !parsed.error;

      this.setStatus('ready', success ? 'All tests passed!' : `${passedCount}/${totalCount} tests passed`);

      return {
        success,
        passedCount,
        totalCount,
        results,
        stdout: parsed.stdout || '',
        executionTimeMs,
        error: parsed.error || undefined,
      };
    } catch (err: any) {
      this.setStatus('ready', 'Execution failed');
      const executionTimeMs = Math.round(performance.now() - startTime);
      return {
        success: false,
        passedCount: 0,
        totalCount: 0,
        results: [],
        stdout: '',
        executionTimeMs,
        error: err.message || String(err),
      };
    }
  }

  public async runScript(
    userCode: string,
    sampleCall?: string,
    requiredPackages: string[] = []
  ): Promise<ScriptRunResult> {
    const startTime = performance.now();
    try {
      this.setStatus('running', 'Executing solution.py...');
      const py = await this.init();

      if (requiredPackages.length > 0) {
        await this.ensurePackages(requiredPackages);
      }

      py.globals.set('__STANDALONE_USER_CODE__', userCode);
      py.globals.set('__SAMPLE_CALL__', sampleCall || '');

      const runnerScript = `
import sys
import io
import ast
import json
import time
import traceback

_captured_stdout = io.StringIO()
_original_stdout = sys.stdout
_original_stderr = sys.stderr
sys.stdout = _captured_stdout
sys.stderr = _captured_stdout

_execution_error = None
_start_t = time.perf_counter()

try:
    user_globals = {
        "__name__": "__main__",
        "__file__": "solution.py",
        "__doc__": "PyInterview Pro Standalone Runner",
    }
    
    # 1. Execute User Code at module level
    exec(__STANDALONE_USER_CODE__, user_globals)
    
    # 2. If a sample call is provided, invoke it so functions with prints inside them actually execute
    _sample_call = globals().get("__SAMPLE_CALL__", "").strip()
    if _sample_call:
        try:
            _parsed = ast.parse(_sample_call)
            _target_fn_name = ""
            if _parsed.body and isinstance(_parsed.body[0], ast.Expr) and isinstance(_parsed.body[0].value, ast.Call):
                if isinstance(_parsed.body[0].value.func, ast.Name):
                    _target_fn_name = _parsed.body[0].value.func.id

            # Only invoke sample call if target function is defined in user_globals
            if not _target_fn_name or _target_fn_name in user_globals:
                print(f">>> Sample Test: {_sample_call}")
                if _parsed.body and isinstance(_parsed.body[-1], ast.Expr):
                    _last = _parsed.body.pop()
                    if _parsed.body:
                        exec(compile(_parsed, "<sample>", "exec"), user_globals)
                    _res = eval(compile(ast.Expression(_last.value), "<sample>", "eval"), user_globals)
                    if _res is not None:
                        print(f"=> Returned: {repr(_res)}")
                else:
                    exec(compile(_parsed, "<sample>", "exec"), user_globals)
        except SyntaxError:
            # Gracefully ignore sample calls with descriptive prose
            pass
        except Exception:
            if _execution_error is None:
                _execution_error = traceback.format_exc()

except Exception:
    _execution_error = traceback.format_exc()
finally:
    sys.stdout = _original_stdout
    sys.stderr = _original_stderr

_elapsed_ms = round((time.perf_counter() - _start_t) * 1000, 2)
json.dumps({
    "stdout": _captured_stdout.getvalue(),
    "error": _execution_error,
    "elapsedMs": _elapsed_ms
})
`;

      const jsonStrResult = await py.runPythonAsync(runnerScript);
      const parsed = JSON.parse(jsonStrResult);
      const executionTimeMs = parsed.elapsedMs || Math.round(performance.now() - startTime);

      this.setStatus('ready', parsed.error ? 'Script finished with error' : 'Script executed successfully');

      return {
        stdout: parsed.stdout || '',
        error: parsed.error || undefined,
        executionTimeMs,
      };
    } catch (err: any) {
      this.setStatus('ready', 'Script execution failed');
      const executionTimeMs = Math.round(performance.now() - startTime);
      return {
        stdout: '',
        error: err.message || String(err),
        executionTimeMs,
      };
    }
  }

  public async runInteractiveCommand(
    command: string,
    userCode: string = '',
    requiredPackages: string[] = []
  ): Promise<ReplResult> {
    const startTime = performance.now();
    try {
      const py = await this.init();

      if (requiredPackages.length > 0) {
        await this.ensurePackages(requiredPackages);
      }

      py.globals.set('__REPL_CMD_RAW__', command);
      py.globals.set('__USER_CODE_SYNC__', userCode);

      const replScript = `
import sys
import io
import ast
import json
import time
import traceback

if "_repl_session_env" not in globals():
    globals()["_repl_session_env"] = {
        "__name__": "__main__",
        "__doc__": "PyInterview Pro Interactive REPL",
    }

_env = globals()["_repl_session_env"]

# Synchronize user code from editor if provided
_sync_code = globals().get("__USER_CODE_SYNC__", "")
if _sync_code:
    try:
        exec(_sync_code, _env)
    except Exception:
        pass

_cap_out = io.StringIO()
_orig_out = sys.stdout
_orig_err = sys.stderr
sys.stdout = _cap_out
sys.stderr = _cap_out

_res_str = None
_err_str = None
_t_start = time.perf_counter()

try:
    _cmd = globals().get("__REPL_CMD_RAW__", "").strip()
    _parsed = ast.parse(_cmd)
    if _parsed.body and isinstance(_parsed.body[-1], ast.Expr):
        _last = _parsed.body.pop()
        if _parsed.body:
            exec(compile(_parsed, "<repl>", "exec"), _env)
        _val = eval(compile(ast.Expression(_last.value), "<repl>", "eval"), _env)
        if _val is not None:
            _res_str = repr(_val)
    else:
        exec(compile(_parsed, "<repl>", "exec"), _env)
except Exception:
    _err_str = traceback.format_exc()
finally:
    sys.stdout = _orig_out
    sys.stderr = _orig_err

_elapsed_ms = round((time.perf_counter() - _t_start) * 1000, 2)
json.dumps({
    "stdout": _cap_out.getvalue(),
    "result": _res_str,
    "error": _err_str,
    "elapsedMs": _elapsed_ms
})
`;

      const jsonStrResult = await py.runPythonAsync(replScript);
      const parsed = JSON.parse(jsonStrResult);
      return {
        stdout: parsed.stdout || '',
        result: parsed.result || undefined,
        error: parsed.error || undefined,
        elapsedMs: parsed.elapsedMs || Math.round(performance.now() - startTime),
      };
    } catch (err: any) {
      return {
        stdout: '',
        error: err.message || String(err),
        elapsedMs: Math.round(performance.now() - startTime),
      };
    }
  }

  public async resetReplSession(): Promise<void> {
    try {
      const py = await this.init();
      await py.runPythonAsync(`
if "_repl_session_env" in globals():
    globals()["_repl_session_env"] = {
        "__name__": "__main__",
        "__doc__": "PyInterview Pro Interactive REPL",
    }
`);
    } catch (e) {
      console.warn('Failed to reset REPL session:', e);
    }
  }
}

export const pyodideRunner = new PyodideRunnerService();
