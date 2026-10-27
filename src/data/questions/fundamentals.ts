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
    starterCode: `from typing import Iterable, List, Any

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
def _run_tests():
    # Test 1: list
    try:
        out1 = chunked([1, 2, 3, 4, 5, 6, 7], 3)
        res1 = list(out1) if out1 is not None else None
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
        res2 = list(out2) if out2 is not None else None
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
        res3 = list(out3) if out3 is not None else None
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
  }
];
