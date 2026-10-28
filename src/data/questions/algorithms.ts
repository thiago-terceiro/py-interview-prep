import type { Question } from '../../types';


export const algorithmQuestions: Question[] = [
  {
    id: 'py-08-two-sum-sorted',
    number: 8,
    title: 'Two Sum II - Input Array Is Sorted',
    slug: 'two-sum-sorted',
    track: 'algorithms',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'Arrays', 'Binary Search'],
    summary: 'Find two numbers in a 1-indexed sorted array that add up to a target using O(1) space.',
    description: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers, \`[index1, index2]\`, as an integer array of length 2 where \`1 <= index1 < index2 <= numbers.length\`.

### Requirements:
- You may not use the same element twice.
- Your solution must use only **O(1) extra space**.`,
    examples: [
      {
        input: 'numbers = [2, 7, 11, 15], target = 9',
        output: '[1, 2]',
        explanation: 'The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].'
      },
      {
        input: 'numbers = [2, 3, 4], target = 6',
        output: '[1, 3]',
        explanation: 'The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3.'
      }
    ],
    constraints: [
      '2 <= numbers.length <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order.',
      '-1000 <= target <= 1000',
      'The tests are generated such that there is exactly one solution.'
    ],
    starterCode: `from typing import List

def two_sum(numbers: List[int], target: int) -> List[int]:
    """
    Finds two 1-indexed positions in sorted array that sum to target.
    Must use O(1) extra space.
    """
    # Write your solution here
    pass
`,
    solutionCode: `from typing import List

def two_sum(numbers: List[int], target: int) -> List[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []
`,
    testHarness: `
def _run_tests():
    import copy
    cases = [
        ([2, 7, 11, 15], 9, [1, 2]),
        ([2, 3, 4], 6, [1, 3]),
        ([-1, 0], -1, [1, 2]),
        ([1, 2, 3, 4, 4, 9, 56], 8, [4, 5])
    ]
    for nums, tgt, expected in cases:
        inp_str = f"numbers = {str(nums)}, target = {tgt}"
        try:
            actual = two_sum(copy.deepcopy(nums), tgt)
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
      approach: 'Since the array is sorted, initialize two pointers: `left` at 0 and `right` at the end. Compute `sum = numbers[left] + numbers[right]`. If `sum < target`, increment `left` to increase the sum. If `sum > target`, decrement `right` to reduce the sum. Return 1-based indices upon finding the match.',
      timeComplexity: 'O(N) single pass through the array.',
      spaceComplexity: 'O(1) extra memory.',
      keyTakeaway: 'When an input array is sorted, two pointers inward traversal often turns an O(N^2) or hash map O(N) space problem into O(1) space.'
    },
    hints: [
      'Take advantage of the sorted property: what happens if the sum of the two outermost numbers is greater than the target?',
      'If the sum is too small, move the left pointer right. If too large, move the right pointer left.',
      'Remember the problem asks for 1-based indices!'
    ],
    visualizerId: 'two-pointers'
  },

  {
    id: 'py-11-valid-parentheses',
    number: 11,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    track: 'algorithms',
    difficulty: 'Easy',
    tags: ['Stack', 'Strings'],
    summary: 'Determine if an input string of brackets is valid using a LIFO Stack.',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'All brackets match in pairs.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Mismatch between "(" and "]".'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    starterCode: `def is_valid(s: str) -> bool:
    """
    Validates bracket strings using a stack.
    """
    # Write your solution here
    pass
`,
    solutionCode: `def is_valid(s: str) -> bool:
    mapping = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
            
    return not stack
`,
    testHarness: `
def _run_tests():
    cases = [
        ("()[]{}", True),
        ("(]", False),
        ("([)]", False),
        ("{[]}", True),
        ("[", False),
        ("]", False)
    ]
    for s_inp, expected in cases:
        try:
            actual = is_valid(s_inp)
            passed = actual == expected
            _test_items.append({
                "input": f's = "{s_inp}"',
                "expected": str(expected),
                "actual": str(actual),
                "passed": passed
            })
        except Exception as e:
            _test_items.append({
                "input": f's = "{s_inp}"',
                "expected": str(expected),
                "actual": f"Error: {e}",
                "passed": False,
                "error": str(e)
            })

_run_tests()
`,
    explanation: {
      approach: 'Use a stack. Iterate over the string. If opening bracket, push to stack. If closing bracket, pop the top and verify it matches the closing bracket. If stack is empty when popping or characters remain at the end, return False.',
      timeComplexity: 'O(N) single pass.',
      spaceComplexity: 'O(N) worst-case stack space.',
      keyTakeaway: 'A stack is the standard data structure for nested matching structures and grammar parsing.'
    },
    hints: [
      'Store matching pairs in a dictionary mapping closing brackets to opening brackets.',
      'Push open brackets onto a list used as a stack.',
      'Check if stack is completely empty at the end.'
    ]
  },

  {
    id: 'py-12-reverse-linked-list',
    number: 12,
    title: 'Reverse Linked List In-Place',
    slug: 'reverse-linked-list',
    track: 'algorithms',
    difficulty: 'Easy',
    tags: ['Linked List', 'Pointers', 'Recursion'],
    summary: 'Reverse a singly linked list in-place in O(N) time and O(1) space.',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.

Definition for singly-linked list node:
\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
\`\`\`

Must be executed **in-place** with $O(1)$ extra memory.`,
    examples: [
      {
        input: 'head = [1, 2, 3, 4, 5]',
        output: '[5, 4, 3, 2, 1]',
        explanation: 'Each pointer is reversed to point to its predecessor.'
      }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    """
    Reverses a singly linked list in-place.
    """
    # Write your solution here
    pass
`,
    solutionCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
`,
    testHarness: `
def _list_to_nodes(arr):
    if not arr: return None
    head = ListNode(arr[0])
    curr = head
    for v in arr[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def _nodes_to_list(head):
    res = []
    curr = head
    while curr:
        res.append(curr.val)
        curr = curr.next
    return res

def _run_tests():
    import copy
    cases = [
        ([1, 2, 3, 4, 5], [5, 4, 3, 2, 1]),
        ([1, 2], [2, 1]),
        ([], [])
    ]
    for arr, expected in cases:
        inp_str = f"head = {str(arr)}"
        try:
            head = _list_to_nodes(copy.deepcopy(arr))
            rev = reverse_list(head)
            actual = _nodes_to_list(rev)
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
      approach: 'Iterate through the list while maintaining three pointers: `prev` (initially `None`), `curr` (initially `head`), and `nxt = curr.next`. Flip `curr.next = prev`, then advance `prev = curr` and `curr = nxt`. When `curr` is None, `prev` is the new head.',
      timeComplexity: 'O(N) where N is number of nodes.',
      spaceComplexity: 'O(1) extra space.',
      keyTakeaway: 'Always store `nxt = curr.next` before overwriting `curr.next` to avoid losing the reference to the remainder of the list.'
    },
    hints: [
      'Store `curr.next` in a temporary variable `nxt` before modifying `curr.next`.',
      'Point `curr.next` backward to `prev`.',
      'Move `prev` and `curr` forward one step.'
    ]
  },

  {
    id: 'py-09-longest-substring-without-repeats',
    number: 9,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    track: 'algorithms',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Hash Map', 'Strings'],
    summary: 'Find the length of the longest substring with all unique characters using an O(N) sliding window.',
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.

A **substring** is a contiguous non-empty sequence of characters within a string.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3. Note that "pwke" is a subsequence, not a substring.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    starterCode: `def length_of_longest_substring(s: str) -> int:
    """
    Returns the length of the longest substring without repeating characters.
    """
    # Write your solution here
    pass
`,
    solutionCode: `def length_of_longest_substring(s: str) -> int:
    seen = {}  # char -> last seen index
    left = 0
    max_len = 0
    
    for right, char in enumerate(s):
        if char in seen and seen[char] >= left:
            left = seen[char] + 1
        seen[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len
`,
    testHarness: `
def _run_tests():
    cases = [
        ("abcabcbb", 3),
        ("bbbbb", 1),
        ("pwwkew", 3),
        ("", 0),
        ("abba", 2),
        ("dvdf", 3)
    ]
    for s_inp, expected in cases:
        try:
            actual = length_of_longest_substring(s_inp)
            passed = actual == expected
            _test_items.append({
                "input": f's = "{s_inp}"',
                "expected": str(expected),
                "actual": str(actual),
                "passed": passed
            })
        except Exception as e:
            _test_items.append({
                "input": f's = "{s_inp}"',
                "expected": str(expected),
                "actual": f"Error: {e}",
                "passed": False,
                "error": str(e)
            })

_run_tests()
`,
    explanation: {
      approach: 'Use a dynamic sliding window `[left, right]`. Maintain a hash map of each character to its most recent index. When character `s[right]` was seen at index `>= left`, skip `left` directly to `seen[s[right]] + 1`. Update `max_len = max(max_len, right - left + 1)`.',
      timeComplexity: 'O(N) linear time since both pointers only advance forward.',
      spaceComplexity: 'O(min(N, M)) where M is the character alphabet size (e.g. 128 for ASCII).',
      keyTakeaway: 'Storing the last-seen index in a map allows the `left` pointer to jump immediately instead of shrinking one step at a time.'
    },
    hints: [
      'Use a dictionary to keep track of the most recent index of each character.',
      'When you encounter a duplicate character whose last position is >= left, jump left to that position + 1.',
      'Check the classic edge case: "abba". When at the second "a", its last index (0) is less than left (2), so left shouldn\'t move backwards!'
    ],
    visualizerId: 'sliding-window'
  },

  {
    id: 'py-10-search-rotated-sorted-array',
    number: 10,
    title: 'Search in Rotated Sorted Array',
    slug: 'search-rotated-sorted-array',
    track: 'algorithms',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Arrays', 'O(log N)'],
    summary: 'Search for a target value in a sorted array that has been rotated at an unknown pivot in O(log N) time.',
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).

Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index \`k\` (\`1 <= k < nums.length\`) such that the resulting array is \`[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]\`.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with **O(log n)** runtime complexity.`,
    examples: [
      {
        input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0',
        output: '4',
        explanation: '0 is located at index 4.'
      },
      {
        input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 3',
        output: '-1',
        explanation: '3 does not exist in the array.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.',
      'nums is guaranteed to be rotated at some pivot.'
    ],
    starterCode: `from typing import List

def search(nums: List[int], target: int) -> int:
    """
    Search in rotated sorted array in O(log N) time.
    """
    # Write your solution here
    pass
`,
    solutionCode: `from typing import List

def search(nums: List[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        
        # Check if left half is normally sorted
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        # Otherwise right half must be sorted
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
                
    return -1
`,
    testHarness: `
def _run_tests():
    import copy
    cases = [
        ([4, 5, 6, 7, 0, 1, 2], 0, 4),
        ([4, 5, 6, 7, 0, 1, 2], 3, -1),
        ([1], 0, -1),
        ([1], 1, 0),
        ([3, 1], 1, 1),
        ([5, 1, 3], 5, 0)
    ]
    for nums, tgt, expected in cases:
        inp_str = f"nums = {str(nums)}, target = {tgt}"
        try:
            actual = search(copy.deepcopy(nums), tgt)
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
      approach: 'In any rotated sorted array, splitting at `mid` always leaves at least one half sorted. Check whether `nums[low] <= nums[mid]`. If true, the left half is sorted: if target lies within `[nums[low], nums[mid])`, search left, else search right. If the right half is sorted, apply symmetric logic.',
      timeComplexity: 'O(log N) binary search.',
      spaceComplexity: 'O(1) extra space.',
      keyTakeaway: 'Even when an array is modified, identifying which partition maintains invariant sorted order enables binary search.'
    },
    hints: [
      'In a rotated sorted array, at least one half (left or right of mid) is always strictly sorted.',
      'Check if `nums[low] <= nums[mid]`. If so, left is sorted; test whether `target` falls within `nums[low]` and `nums[mid]`.',
      'If left is not sorted, right must be sorted.'
    ],
    visualizerId: 'binary-search'
  },

  {
    id: 'py-13-number-of-islands',
    number: 13,
    title: 'Number of Islands (Grid BFS / DFS)',
    slug: 'number-of-islands',
    track: 'algorithms',
    difficulty: 'Medium',
    tags: ['BFS', 'DFS', 'Matrix', 'Graph', 'Connected Components'],
    summary: 'Count connected components of land cells in a 2D binary grid using BFS or DFS.',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: `grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]`,
        output: '1',
        explanation: 'All land cells are connected as one giant island.'
      },
      {
        input: `grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]`,
        output: '3',
        explanation: 'There are 3 separate islands.'
      }
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.'
    ],
    starterCode: `from typing import List

def num_islands(grid: List[List[str]]) -> int:
    """
    Returns the number of islands in 2D binary grid.
    """
    # Write your solution here
    pass
`,
    solutionCode: `from typing import List
from collections import deque

def num_islands(grid: List[List[str]]) -> int:
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    # BFS traversal to sink connected lands
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                islands += 1
                grid[r][c] = "0"  # mark visited
                queue = deque([(r, c)])
                while queue:
                    curr_r, curr_c = queue.popleft()
                    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nr, nc = curr_r + dr, curr_c + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "1":
                            grid[nr][nc] = "0"
                            queue.append((nr, nc))
                            
    return islands
`,
    testHarness: `
def _run_tests():
    grid1 = [
      ["1","1","1","1","0"],
      ["1","1","0","1","0"],
      ["1","1","0","0","0"],
      ["0","0","0","0","0"]
    ]
    grid2 = [
      ["1","1","0","0","0"],
      ["1","1","0","0","0"],
      ["0","0","1","0","0"],
      ["0","0","0","1","1"]
    ]
    grid3 = [["0"]]

    cases = [(grid1, 1), (grid2, 3), (grid3, 0)]
    for g, exp in cases:
        import copy
        g_copy = copy.deepcopy(g)
        try:
            actual = num_islands(g_copy)
            passed = actual == exp
            _test_items.append({
                "input": f"{len(g)}x{len(g[0])} grid",
                "expected": str(exp),
                "actual": str(actual),
                "passed": passed
            })
        except Exception as e:
            _test_items.append({
                "input": f"{len(g)}x{len(g[0])} grid",
                "expected": str(exp),
                "actual": f"Error: {e}",
                "passed": False,
                "error": str(e)
            })

_run_tests()
`,
    explanation: {
      approach: 'Iterate through all grid cells. When you encounter a \'1\', increment `islands` and trigger BFS or DFS to visit and mark all orthogonally adjacent \'1\'s as \'0\' (or visited).',
      timeComplexity: 'O(M * N) since each cell is visited at most once.',
      spaceComplexity: 'O(min(M, N)) queue space for BFS.',
      keyTakeaway: 'Mutating the cell in-place to \'0\' saves extra space for a `visited` set.'
    },
    hints: [
      'Think of the grid as an undirected graph where \'1\'s are nodes connected to horizontal and vertical neighbors.',
      'When you see a \'1\', you found a new island. Sink the island by flipping connected \'1\'s to \'0\'.',
      'A `collections.deque` provides O(1) queue operations for BFS.'
    ],
    visualizerId: 'bfs-grid'
  },

  {
    id: 'py-14-coin-change',
    number: 14,
    title: 'Coin Change (Dynamic Programming)',
    slug: 'coin-change',
    track: 'algorithms',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Memoization'],
    summary: 'Compute the fewest number of coins needed to make up a given amount.',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: 'coins = [1, 2, 5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins total).'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
        explanation: 'Cannot make 3 using only 2s.'
      }
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    starterCode: `from typing import List

def coin_change(coins: List[int], amount: int) -> int:
    """
    Returns fewest coins to make amount or -1.
    """
    # Write your solution here
    pass
`,
    solutionCode: `from typing import List

def coin_change(coins: List[int], amount: int) -> int:
    # dp[i] represents minimum coins needed to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], dp[a - c] + 1)
                
    return dp[amount] if dp[amount] != float('inf') else -1
`,
    testHarness: `
def _run_tests():
    import copy
    cases = [
        ([1, 2, 5], 11, 3),
        ([2], 3, -1),
        ([1], 0, 0),
        ([2, 5, 10, 1], 27, 4)
    ]
    for c, amt, expected in cases:
        inp_str = f"coins = {str(c)}, amount = {amt}"
        try:
            actual = coin_change(copy.deepcopy(c), amt)
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
      approach: 'Bottom-up dynamic programming: create an array `dp` of size `amount + 1` initialized to infinity, with `dp[0] = 0`. For every target `a` from 1 to `amount`, for every coin `c`, `dp[a] = min(dp[a], dp[a - c] + 1)`.',
      timeComplexity: 'O(amount * len(coins)).',
      spaceComplexity: 'O(amount) for DP array.',
      keyTakeaway: 'Bottom-up DP eliminates recursion stack overhead and solves the overlapping subproblems iteratively.'
    },
    hints: [
      'Define `dp[i]` as the minimum coins needed to produce sum `i`.',
      'What is the base case? `dp[0] = 0`.',
      'Recurrence relation: `dp[i] = min(dp[i], dp[i - c] + 1)` for each coin `c <= i`.'
    ]
  },

  {
    id: 'py-15-kth-largest-element',
    number: 15,
    title: 'Kth Largest Element in an Array (Min-Heap)',
    slug: 'kth-largest-element-in-an-array',
    track: 'algorithms',
    difficulty: 'Medium',
    tags: ['Heap', 'Priority Queue', 'heapq', 'Divide and Conquer'],
    summary: 'Find the kth largest element in an unsorted array in O(N log K) time using a Min-Heap.',
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\`-th largest element in the array.

Note that it is the \`k\`-th largest element in the sorted order, not the \`k\`-th distinct element.

Can you solve it in **O(n log k)** time complexity using Python's built-in \`heapq\`?`,
    examples: [
      {
        input: 'nums = [3, 2, 1, 5, 6, 4], k = 2',
        output: '5',
        explanation: 'The sorted array is [1, 2, 3, 4, 5, 6]; the 2nd largest element is 5.'
      },
      {
        input: 'nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4',
        output: '4',
        explanation: 'The 4th largest element is 4.'
      }
    ],
    constraints: [
      '1 <= k <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    starterCode: `from typing import List

def find_kth_largest(nums: List[int], k: int) -> int:
    """
    Finds kth largest element using a Min-Heap of size k.
    """
    # Write your solution here
    pass
`,
    solutionCode: `from typing import List
import heapq

def find_kth_largest(nums: List[int], k: int) -> int:
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]
`,
    testHarness: `
def _run_tests():
    import copy
    cases = [
        ([3, 2, 1, 5, 6, 4], 2, 5),
        ([3, 2, 3, 1, 2, 4, 5, 5, 6], 4, 4),
        ([1], 1, 1),
        ([-1, 2, 0], 2, 0)
    ]
    for nums, k_val, expected in cases:
        inp_str = f"nums = {str(nums)}, k = {k_val}"
        try:
            actual = find_kth_largest(copy.deepcopy(nums), k_val)
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
      approach: 'Maintain a min-heap of size $k$. Push each element onto the heap. Whenever the heap size exceeds $k$, pop the smallest. After processing all elements, the root of the heap `heap[0]` is the $k$-th largest element.',
      timeComplexity: 'O(N log K) time.',
      spaceComplexity: 'O(K) auxiliary space for the heap.',
      keyTakeaway: 'To find top-K or Kth largest, use a Min-Heap of size K (not a max-heap), because popping removes elements smaller than the top K.'
    },
    hints: [
      'In Python, `heapq` is a Min-Heap by default.',
      'If you keep exactly `k` elements in the min-heap, the smallest of those `k` elements is the `k`-th largest overall.',
      'After processing all numbers, return `heap[0]`.'
    ]
  },

  {
    id: 'py-16-subarray-sum-equals-k',
    number: 16,
    title: 'Subarray Sum Equals K (Prefix Sums)',
    slug: 'subarray-sum-equals-k',
    track: 'algorithms',
    difficulty: 'Medium',
    tags: ['Prefix Sum', 'Hash Map', 'Arrays'],
    summary: 'Find the total number of continuous subarrays whose sum equals k in O(N) time.',
    description: `Given an array of integers \`nums\` and an integer \`k\`, return the total number of continuous subarrays whose sum equals to \`k\`.

A subarray is a contiguous non-empty sequence of elements within an array. Notice that numbers can be negative, so standard two-pointer sliding window will not work!`,
    examples: [
      {
        input: 'nums = [1, 1, 1], k = 2',
        output: '2',
        explanation: 'Subarrays [1, 1] at index [0, 1] and [1, 2].'
      },
      {
        input: 'nums = [1, 2, 3], k = 3',
        output: '2',
        explanation: 'Subarrays [1, 2] and [3].'
      }
    ],
    constraints: [
      '1 <= nums.length <= 2 * 10^4',
      '-1000 <= nums[i] <= 1000',
      '-10^7 <= k <= 10^7'
    ],
    starterCode: `from typing import List

def subarray_sum(nums: List[int], k: int) -> int:
    """
    Returns count of subarrays summing to k in O(N) time.
    """
    # Write your solution here
    pass
`,
    solutionCode: `from typing import List
from collections import defaultdict

def subarray_sum(nums: List[int], k: int) -> int:
    count = 0
    curr_sum = 0
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1  # Base case for subarray starting at index 0
    
    for num in nums:
        curr_sum += num
        # If curr_sum - k was seen before, there is a subarray with sum k
        count += prefix_counts[curr_sum - k]
        prefix_counts[curr_sum] += 1
        
    return count
`,
    testHarness: `
def _run_tests():
    import copy
    cases = [
        ([1, 1, 1], 2, 2),
        ([1, 2, 3], 3, 2),
        ([1, -1, 0], 0, 3),
        ([3, 4, 7, 2, -3, 1, 4, 2], 7, 4)
    ]
    for nums, k_val, expected in cases:
        inp_str = f"nums = {str(nums)}, k = {k_val}"
        try:
            actual = subarray_sum(copy.deepcopy(nums), k_val)
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
      approach: 'Let $S_j$ be the prefix sum up to index $j$. The sum of subarray from $i+1$ to $j$ is $S_j - S_i$. We want $S_j - S_i = k \\implies S_i = S_j - k$. By storing the frequencies of prefix sums in a hash map as we iterate, we can count matches in $O(1)$ per step.',
      timeComplexity: 'O(N) single pass.',
      spaceComplexity: 'O(N) space for hash map.',
      keyTakeaway: 'Prefix sum + hash map solves many subarray sum problems where negative numbers break sliding window monotonicity.'
    },
    hints: [
      'The sum of elements between index i and j is `prefix[j] - prefix[i-1]`.',
      'Rearrange: `prefix[i-1] = prefix[j] - k`.',
      'Remember to initialize your frequency hash map with `0: 1` to account for subarrays starting at index 0.'
    ]
  },
];
