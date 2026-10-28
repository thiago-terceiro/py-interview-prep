import type { Question } from '../../types';


export const fundamentalQuestions: Question[] = [
  {
    id: 'py-01-flatten-nested-list',
    number: 1,
    title: 'Flatten Arbitrarily Nested List',
    slug: 'flatten-nested-list',
    track: 'fundamentals',
    difficulty: 'Easy',
    tags: ['Generators', 'Recursion', 'Iterables', 'Yield'],
    summary: 'Write a generator function to flatten an arbitrarily nested list of integers.',
    description: `Given a nested list of integers \`nested_list\`, where elements can be integers or other lists containing integers (to arbitrary depth), return a flattened 1-dimensional list of all integers.

In technical interviews, this tests your understanding of recursion, duck-typing, and Python's \`yield\` / \`yield from\` syntax.

### Requirements:
1. Implement \`flatten(nested_list)\` which returns a list containing all the flattened elements in their original relative order.
2. Handle empty lists, deeply nested singletons (e.g. \`[[[[1]]]]\`), and already flat lists.`,
    examples: [
      {
        input: 'nested_list = [1, [2, [3, 4], 5], [[6]], 7]',
        output: '[1, 2, 3, 4, 5, 6, 7]',
        explanation: 'All nested brackets are unwrapped into a single sequence.'
      },
      {
        input: 'nested_list = [[], [1, []], [[2, [3]]]]',
        output: '[1, 2, 3]',
        explanation: 'Empty lists are ignored seamlessly.'
      }
    ],
    constraints: [
      'The nesting depth can be up to 100 levels.',
      'Elements are either ints or lists of ints.',
      'Output must be a flat Python list.'
    ],
    starterCode: `def flatten(nested_list):
    """
    Flattens an arbitrarily nested list into a 1D list.
    
    :param nested_list: list of ints or nested lists
    :return: list of ints
    """
    # Write your code here
    pass
`,
    solutionCode: `def flatten(nested_list):
    """
    Recursive generator approach using 'yield from'.
    """
    def _generator(item):
        if isinstance(item, list):
            for sub_item in item:
                yield from _generator(sub_item)
        else:
            yield item

    return list(_generator(nested_list))
`,
    testHarness: `
def _run_tests():
    import copy
    cases = [
        ([1, [2, [3, 4], 5], [[6]], 7], [1, 2, 3, 4, 5, 6, 7]),
        ([[], [1, []], [[2, [3]]]], [1, 2, 3]),
        ([1, 2, 3, 4], [1, 2, 3, 4]),
        ([[[[[99]]]]], [99]),
        ([], [])
    ]
    for inp, expected in cases:
        inp_str = f"nested_list = {str(inp)}"
        try:
            actual = flatten(copy.deepcopy(inp))
            passed = actual == expected
            _test_items.append({
                "input": inp_str,
                "expected": str(expected),
                "actual": str(actual),
                "passed": passed
            })
        except Exception as e:
            _test_items.append({
                "input": inp_str,
                "expected": str(expected),
                "actual": f"Error: {e}",
                "passed": False,
                "error": str(e)
            })

_run_tests()
`,
    explanation: {
      approach: 'Use recursion or a generator with `isinstance(item, list)` and `yield from`. When an element is a list, recurse into it; when it is a scalar, yield it directly.',
      timeComplexity: 'O(N) where N is the total number of atomic elements and list containers.',
      spaceComplexity: 'O(D) auxiliary stack space where D is the maximum nesting depth.',
      keyTakeaway: 'In Python, prefer `isinstance(x, list)` or `isinstance(x, (list, tuple))` over `type(x) == list` to respect inheritance and avoid infinite recursion on strings.'
    },
    hints: [
      'A helper recursive generator function using `yield from` provides a clean, memory-efficient way to traverse nested levels.',
      'Be careful to check if the current element is an `isinstance(x, list)` before iterating.',
      'Finally, wrap the generator result with `list(...)` to return a list.'
    ]
  },

  {
    id: 'py-04-group-anagrams',
    number: 4,
    title: 'Group Anagrams with Frequency Hash',
    slug: 'group-anagrams',
    track: 'fundamentals',
    difficulty: 'Easy',
    tags: ['Strings', 'Hash Map', 'defaultdict', 'Tuples as Keys'],
    summary: 'Group an array of strings into anagrams using optimal hash key representations.',
    description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

In Python interviews, interviewers check whether you know how to use immutable tuples or sorted character keys in a dictionary.`,
    examples: [
      {
        input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]',
        output: '[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]',
        explanation: 'Words with identical character sets and counts are grouped together.'
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
        explanation: 'Empty strings form a group.'
      }
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.'
    ],
    starterCode: `from typing import List

def group_anagrams(strs: List[str]) -> List[List[str]]:
    """
    Groups anagrams together.
    """
    # Write your solution here
    pass
`,
    solutionCode: `from typing import List
from collections import defaultdict

def group_anagrams(strs: List[str]) -> List[List[str]]:
    groups = defaultdict(list)
    for word in strs:
        # Sorted string as the canonical key
        key = "".join(sorted(word))
        groups[key].append(word)
    return list(groups.values())
`,
    testHarness: `
def _run_tests():
    import copy
    def normalize(groups):
        return sorted([sorted(g) for g in groups])

    cases = [
        (["eat", "tea", "tan", "ate", "nat", "bat"], [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]),
        ([""], [[""]]),
        (["a"], [["a"]])
    ]
    for inp, expected in cases:
        inp_str = f"strs = {str(inp)}"
        try:
            actual = group_anagrams(copy.deepcopy(inp))
            passed = normalize(actual) == normalize(expected)
            _test_items.append({
                "input": inp_str,
                "expected": str(expected),
                "actual": str(actual),
                "passed": passed
            })
        except Exception as e:
            _test_items.append({
                "input": inp_str,
                "expected": str(expected),
                "actual": f"Error: {e}",
                "passed": False,
                "error": str(e)
            })

_run_tests()
`,
    explanation: {
      approach: 'Use a `collections.defaultdict(list)`. For each string, either sort the characters `"".join(sorted(word))` or compute a 26-element character count tuple `tuple(count)` to serve as the dictionary key.',
      timeComplexity: 'O(N * K log K) with sorting or O(N * K) with a 26-element count tuple, where N is number of strings and K is max length of string.',
      spaceComplexity: 'O(N * K) to store the grouped strings.',
      keyTakeaway: 'Dictionary keys in Python must be hashable and immutable. Strings and tuples are hashable, whereas lists and dicts are not.'
    },
    hints: [
      'Two words are anagrams if and only if their sorted letter representations are identical.',
      'Use `collections.defaultdict(list)` so you don\'t have to check `if key not in d` manually.',
      'Alternative for O(N * K) time: use a 26-tuple of character counts as the dictionary key.'
    ]
  },

  {
    id: 'py-06-chunked-stream-iterator',
    number: 6,
    title: 'Memory-Efficient Chunked Iterator',
    slug: 'chunked-stream-iterator',
    track: 'fundamentals',
    difficulty: 'Easy',
    tags: ['Iterators', 'itertools', 'Generators', 'Memory'],
    summary: 'Implement a generator that yields chunks of size N from any arbitrary iterable.',
    description: `When handling large files, database queries, or streaming records in Python, you cannot load the entire dataset into memory at once.

Write a generator function \`chunked(iterable, size: int)\` that yields lists (or tuples) of at most \`size\` elements from \`iterable\`.
- The final chunk may contain fewer than \`size\` elements if the stream does not divide evenly.
- The function should work seamlessly on infinite generators or finite iterables without calling \`len()\` or converting the whole stream into a list.`,
    examples: [
      {
        input: 'chunked([1, 2, 3, 4, 5, 6, 7], 3)',
        output: '[[1, 2, 3], [4, 5, 6], [7]]',
        explanation: 'Chunks of size 3, with the remainder 7 in the last chunk.'
      }
    ],
    constraints: [
      'size >= 1',
      'Must work on pure generators (no len() or index access).'
    ],
    starterCode: `import itertools
from itertools import islice
from typing import Iterable, List, Any

def chunked(iterable: Iterable[Any], size: int):
    """
    Yields successive chunks of up to 'size' elements from iterable.
    """
    # Write your generator here
    pass
`,
    solutionCode: `from itertools import islice
from typing import Iterable, Any

def chunked(iterable: Iterable[Any], size: int):
    it = iter(iterable)
    while True:
        chunk = list(islice(it, size))
        if not chunk:
            break
        yield chunk
`,
    testHarness: `
import itertools
from itertools import islice

def _run_tests():
    def _safe_materialize(gen, max_chunks=20):
        if gen is None:
            return None
        # Safeguard against runaway or infinite generators
        chunks = list(itertools.islice(gen, max_chunks + 1))
        if len(chunks) > max_chunks:
            raise ValueError(f"Stream yielded >{max_chunks} chunks (possible infinite loop)")
        # Normalize each chunk to a list (handles iterators, tuples, islice objects, or lists)
        res = []
        for c in chunks:
            if hasattr(c, '__iter__') and not isinstance(c, (str, bytes)):
                res.append(list(c))
            else:
                res.append(c)
        return res

    # Test 1: list
    try:
        out1 = chunked([1, 2, 3, 4, 5, 6, 7], 3)
        res1 = _safe_materialize(out1)
        exp1 = [[1, 2, 3], [4, 5, 6], [7]]
        _test_items.append({
            "input": "chunked([1, 2, 3, 4, 5, 6, 7], 3)",
            "expected": str(exp1),
            "actual": str(res1),
            "passed": res1 == exp1
        })
    except Exception as e:
        _test_items.append({
            "input": "chunked([1, 2, 3, 4, 5, 6, 7], 3)",
            "expected": "[[1, 2, 3], [4, 5, 6], [7]]",
            "actual": f"Error: {e}",
            "passed": False,
            "error": str(e)
        })

    # Test 2: Generator stream (infinite range with break)
    def num_gen():
        for i in range(10):
            yield i
    try:
        out2 = chunked(num_gen(), 4)
        res2 = _safe_materialize(out2)
        exp2 = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9]]
        _test_items.append({
            "input": "chunked(generator_0_to_9, 4)",
            "expected": str(exp2),
            "actual": str(res2),
            "passed": res2 == exp2
        })
    except Exception as e:
        _test_items.append({
            "input": "chunked(generator_0_to_9, 4)",
            "expected": "[[0, 1, 2, 3], [4, 5, 6, 7], [8, 9]]",
            "actual": f"Error: {e}",
            "passed": False,
            "error": str(e)
        })

    # Test 3: Empty input
    try:
        out3 = chunked([], 2)
        res3 = _safe_materialize(out3)
        exp3 = []
        _test_items.append({
            "input": "chunked([], 2)",
            "expected": str(exp3),
            "actual": str(res3),
            "passed": res3 == exp3
        })
    except Exception as e:
        _test_items.append({
            "input": "chunked([], 2)",
            "expected": "[]",
            "actual": f"Error: {e}",
            "passed": False,
            "error": str(e)
        })

_run_tests()
`,
    explanation: {
      approach: 'Convert `iterable` to an iterator using `iter(iterable)`. In a loop, use `itertools.islice(it, size)` to consume up to `size` items. When `islice` returns an empty slice, break.',
      timeComplexity: 'O(N) total time across all iterations.',
      spaceComplexity: 'O(size) auxiliary memory per yielded chunk, never buffering all N elements.',
      keyTakeaway: '`itertools.islice` on an iterator advances the iterator state directly without pulling unnecessary elements into memory.'
    },
    hints: [
      'First convert the iterable to an iterator using `it = iter(iterable)`.',
      'Look up `itertools.islice(it, size)`. Wrapping it in `list(...)` grabs up to `size` items.',
      'Stop when the chunk list is empty.'
    ]
  },

  {
    id: 'py-02-lru-cache',
    number: 2,
    title: 'Design an LRU Cache',
    slug: 'lru-cache',
    track: 'fundamentals',
    difficulty: 'Medium',
    tags: ['Data Structures', 'Hash Map', 'Doubly Linked List', 'O(1)'],
    summary: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) operations.',
    description: `Implement the \`LRUCache\` class:
- \`LRUCache(capacity: int)\`: Initialize the LRU cache with positive size \`capacity\`.
- \`get(key: int) -> int\`: Return the value of the \`key\` if the key exists, otherwise return \`-1\`. Accessing a key marks it as most recently used.
- \`put(key: int, value: int) -> None\`: Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, evict the least recently used key.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    examples: [
      {
        input: `cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
cache.get(1)       # returns 1 (now 1 is recently used)
cache.put(3, 3)    # evicts key 2 (capacity exceeded)
cache.get(2)       # returns -1 (not found)
cache.put(4, 4)    # evicts key 1
cache.get(1)       # returns -1 (not found)
cache.get(3)       # returns 3
cache.get(4)       # returns 4`,
        output: '[1, -1, -1, 3, 4]',
        explanation: 'Keys are evicted based on recency of access.'
      }
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.'
    ],
    starterCode: `class LRUCache:
    def __init__(self, capacity: int):
        # Initialize your data structures
        pass

    def get(self, key: int) -> int:
        # Return value or -1
        pass

    def put(self, key: int, value: int) -> None:
        # Insert or update key-value pair, evicting LRU if full
        pass
`,
    solutionCode: `from collections import OrderedDict

class LRUCache:
    """
    Using collections.OrderedDict for O(1) operations.
    Can also be built using a custom Doubly Linked List + Hash Map.
    """
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        # Move key to the end to mark as recently used
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            # popitem(last=False) pops the first (least recently used) item
            self.cache.popitem(last=False)
`,
    testHarness: `
def _run_tests():
    # Test case 1
    cache = LRUCache(2)
    cache.put(1, 10)
    cache.put(2, 20)
    g1 = cache.get(1)
    cache.put(3, 30) # should evict 2
    g2 = cache.get(2)
    cache.put(4, 40) # should evict 1
    g1_again = cache.get(1)
    g3 = cache.get(3)
    g4 = cache.get(4)
    res = [g1, g2, g1_again, g3, g4]
    exp = [10, -1, -1, 30, 40]
    _test_items.append({
        "input": "cap=2, ops: put(1,10), put(2,20), get(1), put(3,30), get(2), put(4,40), get(1), get(3), get(4)",
        "expected": str(exp),
        "actual": str(res),
        "passed": res == exp
    })

    # Test case 2: Overwrite existing key
    cache2 = LRUCache(1)
    cache2.put(2, 1)
    g_2_1 = cache2.get(2)
    cache2.put(2, 2)
    g_2_2 = cache2.get(2)
    res2 = [g_2_1, g_2_2]
    exp2 = [1, 2]
    _test_items.append({
        "input": "cap=1, overwrite key 2: put(2,1), get(2), put(2,2), get(2)",
        "expected": str(exp2),
        "actual": str(res2),
        "passed": res2 == exp2
    })

_run_tests()
`,
    explanation: {
      approach: 'An LRU cache requires constant-time lookups and constant-time eviction of the oldest item. Python’s `collections.OrderedDict` provides `move_to_end(key)` and `popitem(last=False)` which operate in strict O(1) time.',
      timeComplexity: 'O(1) for both get and put operations.',
      spaceComplexity: 'O(capacity) to store elements.',
      keyTakeaway: 'Always know both implementations: OrderedDict in standard Python, and how to write a Node with prev/next pointers for interviews where built-in libraries are restricted.'
    },
    hints: [
      'Think about what data structure lets you look up by key in O(1) (Hash Map) and maintain access ordering with O(1) insertions/deletions (Doubly Linked List).',
      'Python\'s `collections.OrderedDict` has `move_to_end(key)` and `popitem(last=False)`.',
      'Remember that updating an existing key also marks it as most recently used.'
    ]
  },

  {
    id: 'py-03-retry-decorator',
    number: 3,
    title: 'Retry Decorator with Exponential Backoff',
    slug: 'retry-decorator',
    track: 'fundamentals',
    difficulty: 'Medium',
    tags: ['Decorators', 'Closures', 'functools.wraps', 'Higher-Order Functions'],
    summary: 'Build a parameterizable decorator that retries failing function calls up to N times.',
    description: `Decorators are ubiquitous in Python web frameworks, data pipelines, and distributed systems.

Write a decorator factory \`retry(max_attempts=3, exceptions=(Exception,))\` that wraps any function:
1. If the wrapped function succeeds, return its result immediately.
2. If it raises an exception matching any type in \`exceptions\`, retry execution up to \`max_attempts\` times.
3. If it still fails on the \`max_attempts\`-th attempt, re-raise the final exception.
4. Preserve the wrapped function's original docstring and name using \`functools.wraps\`.`,
    examples: [
      {
        input: `@retry(max_attempts=3, exceptions=(ValueError,))
def flaky_api():
    # succeeds on 3rd attempt`,
        output: 'Returns success value on attempt 3 without crashing',
        explanation: 'Catches ValueError on attempt 1 and 2, succeeds on attempt 3.'
      }
    ],
    constraints: [
      'max_attempts >= 1',
      'Function metadata (__name__, __doc__) must be preserved with wraps.',
      'Must pass positional and keyword arguments correctly.'
    ],
    starterCode: `import functools

def retry(max_attempts=3, exceptions=(Exception,)):
    """
    Decorator factory that retries a function upon specified exceptions.
    """
    def decorator(func):
        # TODO: Implement wrapper preserving func metadata
        pass
    return decorator
`,
    solutionCode: `import functools

def retry(max_attempts=3, exceptions=(Exception,)):
    """
    Decorator factory that retries the wrapped function up to max_attempts.
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_err = None
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_err = e
                    if attempt == max_attempts:
                        raise last_err
            raise last_err
        return wrapper
    return decorator
`,
    testHarness: `
def _run_tests():
    # Test 1: Succeeds on attempt 2
    counter = {"calls": 0}
    
    @retry(max_attempts=3, exceptions=(ValueError,))
    def flaky(x):
        """Flaky docstring"""
        counter["calls"] += 1
        if counter["calls"] < 2:
            raise ValueError("Temporary glitch")
        return x * 10

    res = flaky(5)
    p1 = (res == 50) and (counter["calls"] == 2) and (flaky.__name__ == "flaky")
    _test_items.append({
        "input": "Flaky function succeeding on 2nd attempt",
        "expected": "res=50, calls=2, name='flaky'",
        "actual": f"res={res}, calls={counter['calls']}, name={flaky.__name__}",
        "passed": p1
    })

    # Test 2: Fails after max_attempts
    calls2 = {"count": 0}
    @retry(max_attempts=2, exceptions=(KeyError,))
    def always_fails():
        calls2["count"] += 1
        raise KeyError("Boom")

    failed_correctly = False
    try:
        always_fails()
    except KeyError:
        failed_correctly = True
    
    p2 = failed_correctly and (calls2["count"] == 2)
    _test_items.append({
        "input": "Function always failing with KeyError (max_attempts=2)",
        "expected": "KeyError raised after exactly 2 attempts",
        "actual": f"Caught KeyError={failed_correctly}, attempts={calls2['count']}",
        "passed": p2
    })

_run_tests()
`,
    explanation: {
      approach: 'Create a three-level nesting: factory function receiving parameters (`max_attempts`), inner `decorator(func)`, and the actual `wrapper(*args, **kwargs)` decorated with `@functools.wraps(func)`. Catch the specified exceptions in a loop up to `max_attempts`.',
      timeComplexity: 'O(k * T) where k is number of attempts and T is function execution time.',
      spaceComplexity: 'O(1) additional memory.',
      keyTakeaway: 'Always use `@functools.wraps(func)` to prevent losing function introspection metadata (__name__, __doc__, __annotations__) which breaks debuggers and logging frameworks.'
    },
    hints: [
      'A decorator that accepts arguments is a decorator factory: it returns a decorator, which in turn returns the wrapper.',
      'Remember to use `*args, **kwargs` on the wrapper and forward them to `func(*args, **kwargs)`.',
      'Keep track of the last exception so you can re-raise it when attempt == max_attempts.'
    ]
  },

  {
    id: 'py-05-deep-dict-merge',
    number: 5,
    title: 'Deep Dictionary Merge',
    slug: 'deep-dict-merge',
    track: 'fundamentals',
    difficulty: 'Medium',
    tags: ['Recursion', 'Dictionaries', 'Data Structures'],
    summary: 'Merge two arbitrarily nested dictionaries recursively without mutating the inputs.',
    description: `In data engineering and application configuration, you frequently need to merge nested settings.

Write a function \`deep_merge(dict1: dict, dict2: dict) -> dict\` that returns a new dictionary resulting from merging \`dict2\` into \`dict1\`:
1. If a key exists in only one dictionary, keep it.
2. If a key exists in both and both values are dictionaries, recursively merge them.
3. If a key exists in both and either value is NOT a dictionary, \`dict2\`'s value overwrites \`dict1\`'s value.
4. Neither input dictionary should be mutated in place.`,
    examples: [
      {
        input: `dict1 = {'a': 1, 'b': {'x': 10, 'y': 20}}
dict2 = {'c': 3, 'b': {'y': 99, 'z': 30}}`,
        output: "{'a': 1, 'b': {'x': 10, 'y': 99, 'z': 30}, 'c': 3}",
        explanation: "'b' is merged recursively; 'y' is overwritten by dict2."
      }
    ],
    constraints: [
      'Input dictionaries can have any depth of nesting.',
      'Original dictionaries must remain unchanged.'
    ],
    starterCode: `def deep_merge(dict1: dict, dict2: dict) -> dict:
    """
    Recursively merges dict2 into dict1 without mutating inputs.
    """
    # Write your code here
    pass
`,
    solutionCode: `def deep_merge(dict1: dict, dict2: dict) -> dict:
    result = dict(dict1)
    for k, v in dict2.items():
        if k in result and isinstance(result[k], dict) and isinstance(v, dict):
            result[k] = deep_merge(result[k], v)
        else:
            result[k] = v
    return result
`,
    testHarness: `
def _run_tests():
    d1 = {'a': 1, 'b': {'x': 10, 'y': 20}}
    d2 = {'c': 3, 'b': {'y': 99, 'z': 30}}
    exp = {'a': 1, 'b': {'x': 10, 'y': 99, 'z': 30}, 'c': 3}

    res = deep_merge(d1, d2)
    # Check immutability
    immut = (d1['b']['y'] == 20)
    p1 = (res == exp) and immut
    _test_items.append({
        "input": "Nested dicts merge with overwrite",
        "expected": str(exp),
        "actual": str(res),
        "passed": p1
    })

    # Test scalar overwrite
    d3 = {'k': {'nested': 1}}
    d4 = {'k': 42}
    exp2 = {'k': 42}
    res2 = deep_merge(d3, d4)
    _test_items.append({
        "input": "Overwriting dict with scalar",
        "expected": str(exp2),
        "actual": str(res2),
        "passed": res2 == exp2
    })

_run_tests()
`,
    explanation: {
      approach: 'Start with a copy of `dict1`. Loop over `(key, value)` in `dict2`. If both `result[key]` and `value` are dictionaries, recursively call `deep_merge`. Otherwise, directly assign `result[key] = value`.',
      timeComplexity: 'O(N + M) where N and M are total keys across both dictionaries.',
      spaceComplexity: 'O(N + M) to construct the merged result.',
      keyTakeaway: 'Always verify if you are mutating arguments passed by reference in Python. Copying outer dictionaries or using comprehension keeps functions pure.'
    },
    hints: [
      'Begin by shallow copying `dict1` via `dict(dict1)` so you don\'t mutate the input.',
      'Iterate over `dict2.items()`. Check if `key in result and isinstance(result[key], dict) and isinstance(value, dict)`.',
      'In the recursive case, assign the return value back to `result[key]`.'
    ]
  },

  {
    id: 'py-07-custom-context-manager',
    number: 7,
    title: 'Custom Context Manager with Exception Handling',
    slug: 'custom-context-manager',
    track: 'fundamentals',
    difficulty: 'Medium',
    tags: ['Context Managers', 'Dunder Methods', '__enter__', '__exit__'],
    summary: 'Implement a context manager class that logs execution and optionally suppresses specific exception types.',
    description: `Python's \`with\` statement relies on the Context Management Protocol (\`__enter__\` and \`__exit__\`).

Create a context manager class \`ErrorSuppressor\`:
- \`__init__(self, *suppress_types)\`: Accept one or more exception classes to suppress.
- \`__enter__(self)\`: Enter the runtime context and return \`self\`.
- \`__exit__(self, exc_type, exc_val, exc_tb)\`: If an exception was raised inside the \`with\` block and matches any of the types in \`suppress_types\`, suppress it by returning \`True\`. Otherwise, allow it to propagate by returning \`False\` (or \`None\`).
- Maintain an attribute \`self.caught_exception\` storing the caught exception instance (or \`None\` if no error occurred).`,
    examples: [
      {
        input: `with ErrorSuppressor(ZeroDivisionError) as suppressor:
    x = 1 / 0
print(suppressor.caught_exception) # ZeroDivisionError instance`,
        output: 'ZeroDivisionError is suppressed without program crash',
        explanation: 'Suppressed because it matches the target exception.'
      }
    ],
    constraints: [
      'Must implement __enter__ and __exit__ dunder methods.',
      'Returning True from __exit__ tells Python to swallow the exception.'
    ],
    starterCode: `class ErrorSuppressor:
    """
    Context manager that suppresses specified exception types
    and records the caught exception.
    """
    def __init__(self, *suppress_types):
        pass

    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass
`,
    solutionCode: `class ErrorSuppressor:
    def __init__(self, *suppress_types):
        self.suppress_types = suppress_types
        self.caught_exception = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None and issubclass(exc_type, self.suppress_types):
            self.caught_exception = exc_val
            return True  # Suppress the exception
        return False
`,
    testHarness: `
def _run_tests():
    # Test 1: Suppressed exception
    with ErrorSuppressor(ValueError, KeyError) as ctx1:
        raise ValueError("Invalid value")

    p1 = ctx1.caught_exception is not None and isinstance(ctx1.caught_exception, ValueError)
    _test_items.append({
        "input": "with ErrorSuppressor(ValueError): raise ValueError()",
        "expected": "Caught ValueError and suppressed",
        "actual": f"Caught: {type(ctx1.caught_exception).__name__ if ctx1.caught_exception else 'None'}",
        "passed": p1
    })

    # Test 2: Unsuppressed exception raises
    raised = False
    try:
        with ErrorSuppressor(KeyError) as ctx2:
            raise TypeError("Wrong type")
    except TypeError:
        raised = True

    _test_items.append({
        "input": "with ErrorSuppressor(KeyError): raise TypeError()",
        "expected": "TypeError allowed to propagate",
        "actual": f"Propagated correctly: {raised}",
        "passed": raised
    })

    # Test 3: Normal execution without exception
    with ErrorSuppressor(KeyError) as ctx3:
        val = 100 + 200

    p3 = (ctx3.caught_exception is None) and (val == 300)
    _test_items.append({
        "input": "Normal execution with no exceptions",
        "expected": "caught_exception is None",
        "actual": f"caught_exception is {ctx3.caught_exception}",
        "passed": p3
    })

_run_tests()
`,
    explanation: {
      approach: 'The protocol requires `__enter__` to return the target object (usually `self`). `__exit__` receives `(exc_type, exc_val, exc_tb)`. If `exc_type` is an instance/subclass of `self.suppress_types`, record `exc_val` and return `True` to tell Python to silence the exception.',
      timeComplexity: 'O(1) method calls.',
      spaceComplexity: 'O(1) storage.',
      keyTakeaway: 'The return value of `__exit__` is crucial: returning a truthy value suppresses the active exception, while a falsy return allows standard re-raising.'
    },
    hints: [
      'In `__enter__`, return `self` so that `as suppressor` binds the instance.',
      'In `__exit__`, check `if exc_type and issubclass(exc_type, self.suppress_types)`.',
      'Return `True` to suppress, `False` otherwise.'
    ]
  },

  {
    id: 'py-39-lfu-cache',
    number: 39,
    title: 'Design an LFU (Least Frequently Used) Cache with O(1) Operations',
    slug: 'lfu-cache-design',
    track: 'fundamentals',
    difficulty: 'Hard',
    tags: ['Design', 'Hash Map', 'Doubly Linked List', 'Data Structures', 'Caching'],
    summary: 'Implement an LFU cache with strictly O(1) time complexity for get and put operations.',
    description: `Design and implement a data structure for a **Least Frequently Used (LFU)** cache.

Implement the \`LFUCache\` class:
- \`LFUCache(int capacity)\`: Initializes the object with the capacity of the data structure.
- \`int get(int key)\`: Gets the value of the key if the key exists in the cache. Otherwise, returns \`-1\`.
- \`void put(int key, int value)\`: Update the value of the key if present, or inserts the key if not already present. When the cache reaches its capacity, it should invalidate and remove the **least frequently used** key before inserting a new item. For this problem, when there is a **tie** (i.e., two or more keys with the same frequency), the **least recently used** key should be invalidated.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.

### Requirements:
1. Both \`get(key)\` and \`put(key, value)\` must be **O(1)**.
2. Invalidate ties using the LRU criterion among identical frequency buckets.
3. Handle \`capacity = 0\` correctly.`,
    examples: [
      {
        input: '["LFUCache", "put", "put", "get", "put", "get", "get", "put", "get", "get", "get"]\\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [3], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, 3, null, -1, 3, 4]',
        explanation: 'At capacity 2: 1 is fetched (freq 2), then putting 3 evicts key 2 (freq 1).'
      }
    ],
    constraints: [
      '0 <= capacity <= 10^4',
      '0 <= key <= 10^5',
      '0 <= value <= 10^9',
      'At most 2 * 10^5 calls will be made to get and put.'
    ],
    starterCode: `class LFUCache:
    """
    Initializes LFU cache with capacity.
    """
    def __init__(self, capacity: int):
        # Write your initialization here
        pass

    def get(self, key: int) -> int:
        """
        Retrieves value for key in O(1) and increments usage frequency.
        """
        # Write your solution here
        pass

    def put(self, key: int, value: int) -> None:
        """
        Inserts or updates key in O(1), evicting LFU key on overflow.
        """
        # Write your solution here
        pass
`,
    solutionCode: `import collections

class LFUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        # Maps key -> (value, frequency)
        self.key_to_val_freq = {}
        # Maps frequency -> OrderedDict(key -> None) maintaining LRU order among same frequency
        self.freq_to_keys = collections.defaultdict(collections.OrderedDict)
        self.min_freq = 0

    def get(self, key: int) -> int:
        if key not in self.key_to_val_freq:
            return -1
        val, freq = self.key_to_val_freq[key]
        del self.freq_to_keys[freq][key]
        if not self.freq_to_keys[freq] and self.min_freq == freq:
            self.min_freq += 1
        self.key_to_val_freq[key] = (val, freq + 1)
        self.freq_to_keys[freq + 1][key] = None
        return val

    def put(self, key: int, value: int) -> None:
        if self.capacity <= 0:
            return
        if key in self.key_to_val_freq:
            self.key_to_val_freq[key] = (value, self.key_to_val_freq[key][1])
            self.get(key)
            return
        if len(self.key_to_val_freq) >= self.capacity:
            evict_k, _ = self.freq_to_keys[self.min_freq].popitem(last=False)
            del self.key_to_val_freq[evict_k]
        self.key_to_val_freq[key] = (value, 1)
        self.freq_to_keys[1][key] = None
        self.min_freq = 1
`,
    testHarness: `
def _run_tests():
    # Test 1: Capacity 2 standard flow
    c = LFUCache(2)
    c.put(1, 1)
    c.put(2, 2)
    v1 = c.get(1)  # 1 freq=2
    c.put(3, 3)    # evicts 2 (freq 1)
    v2 = c.get(2)  # -1
    v3 = c.get(3)  # 3
    c.put(4, 4)    # evicts 1 (freq 2 vs 3 freq 2: 1 accessed earlier)
    v4 = c.get(1)  # -1
    v5 = c.get(3)  # 3
    v6 = c.get(4)  # 4

    p1 = (v1 == 1 and v2 == -1 and v3 == 3 and v4 == -1 and v5 == 3 and v6 == 4)
    _test_items.append({
        "input": "LFUCache(2) standard sequence",
        "expected": "v1=1, v2=-1, v3=3, v4=-1, v5=3, v6=4",
        "actual": f"v1={v1}, v2={v2}, v3={v3}, v4={v4}, v5={v5}, v6={v6}",
        "passed": p1
    })

    # Test 2: Capacity 0
    c0 = LFUCache(0)
    c0.put(1, 100)
    v0 = c0.get(1)
    _test_items.append({
        "input": "LFUCache(0).put(1, 100); get(1)",
        "expected": "-1",
        "actual": str(v0),
        "passed": v0 == -1
    })

    # Test 3: Key update preserves / advances frequency
    c1 = LFUCache(2)
    c1.put(1, 10)
    c1.put(1, 20)
    g1 = c1.get(1)
    _test_items.append({
        "input": "LFUCache(2) updating key 1",
        "expected": "20",
        "actual": str(g1),
        "passed": g1 == 20
    })

_run_tests()
`,
    explanation: {
      approach: 'Maintain two hash maps: `key_to_val_freq` stores (value, freq). `freq_to_keys` maps frequency count to a doubly linked list (or Python `collections.OrderedDict`). Track `min_freq`. When an element is accessed, promote it to `freq + 1`. On eviction, pop the first element from `freq_to_keys[min_freq]` in O(1).',
      timeComplexity: 'O(1) average time for both get and put.',
      spaceComplexity: 'O(capacity) space across hash structures.',
      keyTakeaway: 'Grouping keys into frequency buckets where each bucket is an OrderedDict enables simultaneous O(1) frequency lookup and O(1) LRU tie-breaking.'
    },
    hints: [
      'Two hash maps are essential: `key -> (val, freq)` and `freq -> OrderedDict(key -> None)`.',
      'Track `min_freq` integer at all times.',
      'When an element frequency increases and leaves the current `min_freq` bucket empty, increment `min_freq`.'
    ],
    visualizerId: 'two-pointers'
  },

  {
    id: 'py-40-token-bucket-rate-limiter',
    number: 40,
    title: 'Thread-Safe Token Bucket Rate Limiter with Burst Capacity',
    slug: 'token-bucket-rate-limiter',
    track: 'fundamentals',
    difficulty: 'Hard',
    tags: ['Concurrency', 'Rate Limiting', 'Threading', 'Time', 'System Design'],
    summary: 'Implement a thread-safe token bucket rate limiter with lazy fractional replenishment.',
    description: `Implement a production-grade, thread-safe **Token Bucket Rate Limiter** commonly deployed in API gateways, microservices, and high-frequency trading gateways.

The Token Bucket algorithm allows bursts of requests up to a configurable maximum capacity while strictly enforcing a sustained refill rate.

### Requirements:
1. Implement \`TokenBucketRateLimiter(rate_per_sec: float, capacity: int)\`.
2. Implement \`allow_request(tokens: int = 1) -> bool\`.
3. Do **not** use a background thread or ticker to add tokens; replenish tokens **lazily** based on elapsed fractional seconds using \`time.monotonic()\`.
4. Ensure thread-safety using Python's \`threading.Lock\`.`,
    examples: [
      {
        input: 'limiter = TokenBucketRateLimiter(rate_per_sec=10, capacity=2)\\nlimiter.allow_request(1)\\nlimiter.allow_request(1)\\nlimiter.allow_request(1)',
        output: 'True, True, False',
        explanation: 'Capacity allows 2 immediate bursts; third request is blocked until replenished.'
      }
    ],
    constraints: [
      'rate_per_sec > 0',
      'capacity >= 1',
      'tokens requested >= 1'
    ],
    starterCode: `import time
import threading

class TokenBucketRateLimiter:
    """
    Thread-safe lazy-refill Token Bucket Rate Limiter.
    """
    def __init__(self, rate_per_sec: float, capacity: int):
        # Write your initialization here
        pass

    def allow_request(self, tokens: int = 1) -> bool:
        """
        Returns True if tokens are available, False otherwise.
        """
        # Write your solution here
        pass
`,
    solutionCode: `import time
import threading

class TokenBucketRateLimiter:
    def __init__(self, rate_per_sec: float, capacity: int):
        self.rate = float(rate_per_sec)
        self.capacity = float(capacity)
        self.tokens = float(capacity)
        self.last_timestamp = time.monotonic()
        self.lock = threading.Lock()

    def allow_request(self, tokens: int = 1) -> bool:
        with self.lock:
            now = time.monotonic()
            elapsed = now - self.last_timestamp
            self.last_timestamp = now
            # Replenish fractional tokens accumulated during elapsed time
            self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
            
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False
`,
    testHarness: `
def _run_tests():
    import time
    
    # Test 1: Immediate bursts
    limiter = TokenBucketRateLimiter(rate_per_sec=10.0, capacity=2)
    r1 = limiter.allow_request(1)
    r2 = limiter.allow_request(1)
    r3 = limiter.allow_request(1)
    
    p1 = (r1 is True and r2 is True and r3 is False)
    _test_items.append({
        "input": "TokenBucket(10/s, cap=2): 3 immediate requests",
        "expected": "True, True, False",
        "actual": f"{r1}, {r2}, {r3}",
        "passed": p1
    })

    # Test 2: Replenishment over time
    limiter2 = TokenBucketRateLimiter(rate_per_sec=50.0, capacity=1)
    limiter2.allow_request(1)  # Consume capacity
    time.sleep(0.03)           # Sleep 30ms -> 0.03 * 50 = 1.5 tokens
    r_replenished = limiter2.allow_request(1)
    _test_items.append({
        "input": "TokenBucket(50/s): request after 30ms sleep",
        "expected": "True",
        "actual": str(r_replenished),
        "passed": r_replenished is True
    })

    # Test 3: Multi-token request exceeds capacity
    limiter3 = TokenBucketRateLimiter(rate_per_sec=10.0, capacity=5)
    r_big = limiter3.allow_request(6)
    _test_items.append({
        "input": "allow_request(6) on capacity 5",
        "expected": "False",
        "actual": str(r_big),
        "passed": r_big is False
    })

_run_tests()
`,
    explanation: {
      approach: 'Avoid spinning background threads. Calculate elapsed time on every call using `time.monotonic()`. Multiply elapsed time by `rate_per_sec` and add to current tokens (capped at `capacity`). If tokens >= requested, deduct and return True. Guard the block with `threading.Lock`.',
      timeComplexity: 'O(1) strictly per request check.',
      spaceComplexity: 'O(1) state storage.',
      keyTakeaway: 'Lazy replenishment replaces timer threads with simple elapsed-time arithmetic, minimizing CPU consumption and context switching.'
    },
    hints: [
      'Use `time.monotonic()` instead of `time.time()` to prevent clock drift issues.',
      'Formula: `tokens = min(capacity, tokens + elapsed * rate)`.',
      'Wrap state changes inside `with self.lock:`.'
    ]
  },

  {
    id: 'py-41-immutable-schema-metaclass',
    number: 41,
    title: 'Strict Schema Metaclass with Slot Allocation and Type Coercion',
    slug: 'strict-schema-metaclass',
    track: 'fundamentals',
    difficulty: 'Hard',
    tags: ['Metaclasses', 'Slots', 'Dunder Methods', 'Type System', 'OOP'],
    summary: 'Create a custom Python metaclass that enforces type hints, generates __slots__, and validates records.',
    description: `Modern high-performance Python libraries (like Pydantic and attrs) use metaprogramming to eliminate boilerplate while enforcing runtime validation and memory efficiency.

Write a custom Python metaclass \`SchemaMeta\` such that any class inheriting from \`SchemaModel\` (or using \`metaclass=SchemaMeta\`):
1. Reads class annotations (\`__annotations__\`).
2. Automatically defines \`__slots__\` from the annotation keys, preventing arbitrary attribute injection.
3. Automatically generates an \`__init__\` method that:
   - Requires all annotated fields as keyword arguments (raises \`TypeError\` if missing).
   - Validates that provided values match the annotated types (raises \`TypeError\` on mismatch).
   - Assigns validated attributes onto the instance.

### Requirements:
1. Define \`SchemaMeta(type)\`.
2. Define base class \`SchemaModel(metaclass=SchemaMeta)\`.
3. Disallow undefined attributes via generated \`__slots__\`.`,
    examples: [
      {
        input: 'class User(SchemaModel):\\n    name: str\\n    age: int\\n\\nu = User(name="Alice", age=30)',
        output: 'u.name == "Alice", u.age == 30',
        explanation: 'Instance initialized cleanly.'
      },
      {
        input: 'User(name="Bob", age="30")',
        output: 'Raises TypeError',
        explanation: 'age is not an int.'
      }
    ],
    constraints: [
      'Must work dynamically for arbitrary field annotations.',
      'Instances must have __slots__ configured.'
    ],
    starterCode: `class SchemaMeta(type):
    """
    Custom metaclass inspecting annotations to enforce types and __slots__.
    """
    # Write your metaclass implementation here
    pass

class SchemaModel(metaclass=SchemaMeta):
    pass
`,
    solutionCode: `class SchemaMeta(type):
    def __new__(cls, name, bases, namespace):
        annotations = namespace.get('__annotations__', {})
        # Generate __slots__ to optimize memory and disallow arbitrary attributes
        namespace['__slots__'] = tuple(annotations.keys())
        
        def __init__(self, **kwargs):
            for k, expected_type in annotations.items():
                if k not in kwargs:
                    raise TypeError(f"Missing required field: '{k}'")
                val = kwargs[k]
                if not isinstance(val, expected_type):
                    raise TypeError(f"Field '{k}' must be {expected_type.__name__}, got {type(val).__name__}")
                setattr(self, k, val)
                
        namespace['__init__'] = __init__
        return super().__new__(cls, name, bases, namespace)

class SchemaModel(metaclass=SchemaMeta):
    pass
`,
    testHarness: `
def _run_tests():
    class Person(SchemaModel):
        name: str
        age: int
        active: bool

    # Test 1: Valid initialization
    p = Person(name="Alice", age=28, active=True)
    p1 = (p.name == "Alice" and p.age == 28 and p.active is True)
    _test_items.append({
        "input": "Person(name='Alice', age=28, active=True)",
        "expected": "Valid Person instance",
        "actual": f"name={p.name}, age={p.age}, active={p.active}",
        "passed": p1
    })

    # Test 2: Type mismatch raises TypeError
    type_err = False
    try:
        Person(name="Bob", age="invalid", active=True)
    except TypeError:
        type_err = True

    _test_items.append({
        "input": "Person(name='Bob', age='invalid', active=True)",
        "expected": "Raises TypeError",
        "actual": f"Raised: {type_err}",
        "passed": type_err
    })

    # Test 3: Slots prevent dynamic attribute addition
    slots_err = False
    try:
        p.unregistered_attr = 42
    except AttributeError:
        slots_err = True

    _test_items.append({
        "input": "p.unregistered_attr = 42 (verifying __slots__)",
        "expected": "Raises AttributeError",
        "actual": f"Raised: {slots_err}",
        "passed": slots_err
    })

_run_tests()
`,
    explanation: {
      approach: 'In `SchemaMeta.__new__`, inspect `namespace.get("__annotations__", {})`. Inject `__slots__ = tuple(annotations.keys())` into the class dictionary before passing it to `super().__new__`. Construct a custom `__init__` checking keyword argument presence and `isinstance(val, expected_type)`.',
      timeComplexity: 'O(1) class definition time, O(F) per-instance construction where F is field count.',
      spaceComplexity: 'Substantially lower memory per instance due to __slots__ replacing dynamic __dict__.',
      keyTakeaway: 'Metaclasses execute at class creation time, enabling automatic code generation and memory optimization before any instance is instantiated.'
    },
    hints: [
      'Override `__new__` on `SchemaMeta(type)` taking `(cls, name, bases, namespace)`.',
      'Assign `namespace["__slots__"] = tuple(annotations.keys())`.',
      'Create an `__init__` function inside `__new__` and attach it to `namespace["__init__"]`.'
    ]
  }
];
