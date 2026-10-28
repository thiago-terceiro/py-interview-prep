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

  {
    id: 'py-31-trapping-rain-water',
    number: 31,
    title: 'Trapping Rain Water (Two Pointers & Elevation)',
    slug: 'trapping-rain-water',
    track: 'algorithms',
    difficulty: 'Hard',
    tags: ['Two Pointers', 'Monotonic Stack', 'Dynamic Programming', 'Elevation'],
    summary: 'Compute how much water can be trapped between elevation map bars after raining in O(N) time.',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.

This is a premier FAANG technical interview challenge testing your ability to eliminate redundant scans by maintaining monotonic left and right boundary peaks simultaneously.

### Requirements:
1. Implement \`trap(height: List[int]) -> int\`.
2. Achieve optimal **O(N)** time complexity with **O(1)** auxiliary space.
3. Handle flat elevations, strictly increasing/decreasing slopes, and empty inputs gracefully.`,
    examples: [
      {
        input: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rain water across valleys.'
      },
      {
        input: 'height = [4, 2, 0, 3, 2, 5]',
        output: '9',
        explanation: 'Water trapped between peak 4 on left and 5 on right.'
      }
    ],
    constraints: [
      'n == height.length',
      '0 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    starterCode: `from typing import List

def trap(height: List[int]) -> int:
    """
    Computes total units of trapped rain water.
    
    :param height: List of non-negative elevation integers
    :return: Total water volume trapped
    """
    # Write your solution here
    pass
`,
    solutionCode: `from typing import List

def trap(height: List[int]) -> int:
    if not height:
        return 0
    l, r = 0, len(height) - 1
    left_max, right_max = height[l], height[r]
    water = 0
    
    while l < r:
        if left_max < right_max:
            l += 1
            left_max = max(left_max, height[l])
            water += left_max - height[l]
        else:
            r -= 1
            right_max = max(right_max, height[r])
            water += right_max - height[r]
            
    return water
`,
    testHarness: `
def _run_tests():
    cases = [
        ([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], 6),
        ([4, 2, 0, 3, 2, 5], 9),
        ([], 0),
        ([3, 3, 3], 0),
        ([5, 4, 3, 2, 1], 0)
    ]
    for h, expected in cases:
        call_str = f"trap({h[:6]}... len={len(h)})" if len(h) > 6 else f"trap({h})"
        try:
            actual = trap(list(h))
            passed = (actual == expected)
            _test_items.append({
                "input": call_str,
                "expected": str(expected),
                "actual": str(actual),
                "passed": passed
            })
        except Exception as e:
            _test_items.append({
                "input": call_str,
                "expected": str(expected),
                "actual": f"Error: {e}",
                "passed": False,
                "error": str(e)
            })

_run_tests()
`,
    explanation: {
      approach: 'At any index i, the water height is bounded by min(max_left, max_right) - height[i]. Instead of storing prefix and suffix maximum arrays, use two converging pointers. If left_max < right_max, the bottleneck for index l is strictly left_max (since right_max is already larger), allowing us to advance l and accumulate water in O(1).',
      timeComplexity: 'O(N) single pass inward traversal.',
      spaceComplexity: 'O(1) auxiliary memory.',
      keyTakeaway: 'When calculating water levels, you only need to know which boundary is lower; the exact height of the higher opposite side is irrelevant to the current column.'
    },
    hints: [
      'Initialize left=0, right=len-1, left_max=height[0], right_max=height[-1].',
      'Whichever max is smaller determines the water height for that side.',
      'Advance the pointer corresponding to the smaller max boundary.'
    ],
    visualizerId: 'two-pointers'
  },

  {
    id: 'py-32-minimum-window-substring',
    number: 32,
    title: 'Minimum Window Substring (Dynamic Sliding Window)',
    slug: 'minimum-window-substring',
    track: 'algorithms',
    difficulty: 'Hard',
    tags: ['Sliding Window', 'Hash Table', 'String', 'Two Pointers'],
    summary: 'Find the minimum window in string s containing all characters of pattern t in O(|S| + |T|) time.',
    description: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the **minimum window substring** of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If there is no such substring, return the empty string \`""\`.

The testcases will be generated such that the answer is unique.

### Requirements:
1. Implement \`min_window(s: str, t: str) -> str\`.
2. Must run in **O(m + n)** time complexity.
3. Handle cases where \`t\` has duplicate characters (e.g. \`"AAB"\`).`,
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: 'The minimum substring containing "A", "B", and "C" is "BANC" at the end of the string.'
      },
      {
        input: 's = "a", t = "a"',
        output: '"a"',
        explanation: 'The entire string s matches t.'
      },
      {
        input: 's = "a", t = "aa"',
        output: '""',
        explanation: 'Both characters from t must be included, but s only contains one "a".'
      }
    ],
    constraints: [
      '1 <= s.length, t.length <= 10^5',
      's and t consist of uppercase and lowercase English letters.'
    ],
    starterCode: `def min_window(s: str, t: str) -> str:
    """
    Finds the shortest contiguous substring of s containing all characters of t.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import collections

def min_window(s: str, t: str) -> str:
    if not t or not s:
        return ""
    t_count = collections.Counter(t)
    window_count = collections.defaultdict(int)
    have, need = 0, len(t_count)
    res, res_len = [-1, -1], float("inf")
    l = 0
    
    for r, char in enumerate(s):
        window_count[char] += 1
        if char in t_count and window_count[char] == t_count[char]:
            have += 1
            
        while have == need:
            if (r - l + 1) < res_len:
                res = [l, r]
                res_len = r - l + 1
            window_count[s[l]] -= 1
            if s[l] in t_count and window_count[s[l]] < t_count[s[l]]:
                have -= 1
            l += 1
            
    l, r = res
    return s[l:r + 1] if res_len != float("inf") else ""
`,
    testHarness: `
def _run_tests():
    cases = [
        ("ADOBECODEBANC", "ABC", "BANC"),
        ("a", "a", "a"),
        ("a", "aa", ""),
        ("aaflslflsfabcdefinm", "abc", "abc"),
        ("bba", "ab", "ba")
    ]
    for s_val, t_val, expected in cases:
        inp_str = f"min_window('{s_val}', '{t_val}')"
        try:
            actual = min_window(s_val, t_val)
            passed = (actual == expected)
            _test_items.append({
                "input": inp_str,
                "expected": repr(expected),
                "actual": repr(actual),
                "passed": passed
            })
        except Exception as e:
            _test_items.append({
                "input": inp_str,
                "expected": repr(expected),
                "actual": f"Error: {e}",
                "passed": False,
                "error": str(e)
            })

_run_tests()
`,
    explanation: {
      approach: 'Use a dynamic sliding window with two pointers: expand right pointer r until the window contains all required frequencies of t (`have == need`). Then shrink left pointer l while the condition holds, updating the minimum window length. Once `have < need`, resume expanding r.',
      timeComplexity: 'O(|S| + |T|) because each pointer visits each character in s at most once.',
      spaceComplexity: 'O(|S| + |T|) for frequency maps bounded by alphabet size (O(1) in ASCII).',
      keyTakeaway: 'Tracking `have` and `need` match counts prevents re-scanning the entire dictionary on every sliding window step.'
    },
    hints: [
      'Use `Counter(t)` to know the required character frequencies.',
      'Track `have` (distinct characters with satisfied counts) vs `need` (`len(t_count)`).',
      'Shrink from the left while `have == need` to discover the minimal valid window.'
    ],
    visualizerId: 'sliding-window'
  },

  {
    id: 'py-33-sliding-window-maximum',
    number: 33,
    title: 'Sliding Window Maximum (Monotonic Deque)',
    slug: 'sliding-window-maximum',
    track: 'algorithms',
    difficulty: 'Hard',
    tags: ['Sliding Window', 'Monotonic Deque', 'Queue', 'Array'],
    summary: 'Find the maximum value in every sliding window of size k in strict O(N) time using a Monotonic Deque.',
    description: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.

### Requirements:
1. Implement \`max_sliding_window(nums: List[int], k: int) -> List[int]\`.
2. Must achieve strict **O(N)** time complexity. A heap-based O(N log k) approach will exceed tight time constraints.`,
    examples: [
      {
        input: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3',
        output: '[3, 3, 5, 5, 6, 7]',
        explanation: 'Window moves right: max of [1, 3, -1] is 3; max of [3, -1, -3] is 3; max of [-1, -3, 5] is 5, etc.'
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]',
        explanation: 'Single element window.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '1 <= k <= nums.length'
    ],
    starterCode: `from typing import List

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    """
    Returns the maximum element for each sliding window of size k.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import collections
from typing import List

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    if not nums or k == 0:
        return []
    q = collections.deque()  # Stores indices in monotonic decreasing order of value
    res = []
    
    for i, n in enumerate(nums):
        # Discard elements smaller than current number from back
        while q and nums[q[-1]] < n:
            q.pop()
        q.append(i)
        
        # Remove elements outside the window frame
        if q[0] <= i - k:
            q.popleft()
            
        # Append max for valid windows
        if i >= k - 1:
            res.append(nums[q[0]])
            
    return res
`,
    testHarness: `
def _run_tests():
    cases = [
        ([1, 3, -1, -3, 5, 3, 6, 7], 3, [3, 3, 5, 5, 6, 7]),
        ([1], 1, [1]),
        ([7, 2, 4], 2, [7, 4]),
        ([9, 11], 2, [11]),
        ([4, -2], 2, [4])
    ]
    for nums, k_val, expected in cases:
        inp_str = f"max_sliding_window({nums}, k={k_val})"
        try:
            actual = max_sliding_window(list(nums), k_val)
            passed = (actual == expected)
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
      approach: 'Store indices in a deque maintained in strictly decreasing order of values. Whenever a larger element enters, pop all smaller elements from the back (they can never become the maximum). If the front index is older than `i - k + 1`, pop it from the front. The element at `q[0]` is always the window maximum in O(1).',
      timeComplexity: 'O(N) since every index is pushed and popped at most once.',
      spaceComplexity: 'O(k) auxiliary space for the deque window.',
      keyTakeaway: 'Monotonic deques maintain sliding order candidates in amortized O(1) by discarding elements that are both smaller and older than new arrivals.'
    },
    hints: [
      'Store indices, not values, in the deque so you can verify if an element is out-of-bounds.',
      'Before adding `i`, remove all elements from the back of deque where `nums[back] < nums[i]`.',
      'The current maximum is always `nums[deque[0]]`.'
    ],
    visualizerId: 'sliding-window'
  },

  {
    id: 'py-34-median-of-two-sorted-arrays',
    number: 34,
    title: 'Median of Two Sorted Arrays (Binary Search Partitioning)',
    slug: 'median-of-two-sorted-arrays',
    track: 'algorithms',
    difficulty: 'Hard',
    tags: ['Binary Search', 'Divide and Conquer', 'Arrays', 'Median'],
    summary: 'Find the median of two sorted arrays in O(log(min(M, N))) time.',
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity must be **O(log(min(m, n)))**.

### Requirements:
1. Implement \`find_median_sorted_arrays(nums1: List[int], nums2: List[int]) -> float\`.
2. Must achieve **O(log(min(m, n)))** time complexity without merging the arrays in O(M + N).`,
    examples: [
      {
        input: 'nums1 = [1, 3], nums2 = [2]',
        output: '2.0',
        explanation: 'Merged array = [1, 2, 3] and median is 2.0.'
      },
      {
        input: 'nums1 = [1, 2], nums2 = [3, 4]',
        output: '2.5',
        explanation: 'Merged array = [1, 2, 3, 4] and median is (2 + 3) / 2 = 2.5.'
      }
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m, n <= 1000',
      '1 <= m + n <= 2000'
    ],
    starterCode: `from typing import List

def find_median_sorted_arrays(nums1: List[int], nums2: List[int]) -> float:
    """
    Calculates median of two sorted arrays in logarithmic time.
    """
    # Write your solution here
    pass
`,
    solutionCode: `from typing import List

def find_median_sorted_arrays(nums1: List[int], nums2: List[int]) -> float:
    A, B = nums1, nums2
    total = len(A) + len(B)
    half = total // 2
    
    # Ensure binary search is performed on the smaller array
    if len(B) < len(A):
        A, B = B, A
        
    l, r = 0, len(A) - 1
    while True:
        i = (l + r) // 2       # Partition index for A
        j = half - i - 2      # Partition index for B
        
        A_left = A[i] if i >= 0 else float("-infinity")
        A_right = A[i + 1] if (i + 1) < len(A) else float("infinity")
        B_left = B[j] if j >= 0 else float("-infinity")
        B_right = B[j + 1] if (j + 1) < len(B) else float("infinity")
        
        # Partition is correct when all left elements <= all right elements
        if A_left <= B_right and B_left <= A_right:
            if total % 2 != 0:
                return float(min(A_right, B_right))
            return (max(A_left, B_left) + min(A_right, B_right)) / 2.0
        elif A_left > B_right:
            r = i - 1
        else:
            l = i + 1
`,
    testHarness: `
def _run_tests():
    cases = [
        ([1, 3], [2], 2.0),
        ([1, 2], [3, 4], 2.5),
        ([0, 0], [0, 0], 0.0),
        ([], [1], 1.0),
        ([2], [], 2.0),
        ([1, 2, 5, 8], [3, 4, 6, 7], 4.5)
    ]
    for n1, n2, expected in cases:
        inp_str = f"find_median({n1}, {n2})"
        try:
            actual = find_median_sorted_arrays(list(n1), list(n2))
            passed = abs(actual - expected) < 1e-5
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
      approach: 'Partition both arrays simultaneously such that the left half contains (M+N)//2 elements. By running binary search on the cut index of the smaller array, test if max(left_A) <= min(right_B) and max(left_B) <= min(right_A). If valid, calculate median from boundary values.',
      timeComplexity: 'O(log(min(M, N))) binary search over the shorter array.',
      spaceComplexity: 'O(1) auxiliary space.',
      keyTakeaway: 'Instead of merging elements, binary search for the partition boundary where left and right halves are in sorted equilibrium.'
    },
    hints: [
      'Always perform binary search on the shorter array.',
      'The partition in array A defines the partition index in array B: `j = total_half - i - 2`.',
      'Use `-infinity` and `+infinity` for edge bounds where partition indices fall outside array limits.'
    ],
    visualizerId: 'binary-search'
  },

  {
    id: 'py-35-merge-k-sorted-lists',
    number: 35,
    title: 'Merge K Sorted Lists (Min-Heap / Divide & Conquer)',
    slug: 'merge-k-sorted-lists',
    track: 'algorithms',
    difficulty: 'Hard',
    tags: ['Heap', 'Priority Queue', 'Linked List', 'Divide and Conquer'],
    summary: 'Merge k sorted linked lists into one single sorted list in O(N log k) time using a Min-Heap.',
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

### Node Structure:
\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
\`\`\`

### Requirements:
1. Implement \`merge_k_lists(lists: List[Optional[ListNode]]) -> Optional[ListNode]\`.
2. Must achieve **O(N log k)** time complexity where N is total node count across all k lists.`,
    examples: [
      {
        input: 'lists = [[1, 4, 5], [1, 3, 4], [2, 6]]',
        output: '[1, 1, 2, 3, 4, 4, 5, 6]',
        explanation: 'All lists merged in ascending order.'
      },
      {
        input: 'lists = []',
        output: '[]',
        explanation: 'No lists provided.'
      }
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4'
    ],
    starterCode: `from typing import List, Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    """
    Merges k sorted linked lists using a min-heap.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import heapq
from typing import List, Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    heap = []
    # Push (val, index, node) into heap. Index acts as a tiebreaker for Python heapq
    for idx, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, idx, node))
            
    dummy = ListNode(0)
    curr = dummy
    
    while heap:
        val, idx, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, idx, node.next))
            
    return dummy.next
`,
    testHarness: `
def _run_tests():
    def to_linked(arr):
        dummy = ListNode(0)
        curr = dummy
        for v in arr:
            curr.next = ListNode(v)
            curr = curr.next
        return dummy.next

    def to_arr(node):
        res = []
        while node:
            res.append(node.val)
            node = node.next
        return res

    # Test 1: 3 lists
    l1 = to_linked([1, 4, 5])
    l2 = to_linked([1, 3, 4])
    l3 = to_linked([2, 6])
    res1 = to_arr(merge_k_lists([l1, l2, l3]))
    exp1 = [1, 1, 2, 3, 4, 4, 5, 6]
    _test_items.append({
        "input": "merge_k_lists([[1,4,5], [1,3,4], [2,6]])",
        "expected": str(exp1),
        "actual": str(res1),
        "passed": res1 == exp1
    })

    # Test 2: Empty lists
    res2 = to_arr(merge_k_lists([]))
    _test_items.append({
        "input": "merge_k_lists([])",
        "expected": "[]",
        "actual": str(res2),
        "passed": res2 == []
    })

    # Test 3: List containing None
    res3 = to_arr(merge_k_lists([None, to_linked([1])]))
    _test_items.append({
        "input": "merge_k_lists([[], [1]])",
        "expected": "[1]",
        "actual": str(res3),
        "passed": res3 == [1]
    })

_run_tests()
`,
    explanation: {
      approach: 'Maintain a Min-Heap of size at most k containing the current head node of each list. In Python `heapq`, push tuples `(node.val, idx, node)` where `idx` is unique to prevent comparison errors when two nodes have identical values. Each pop yields the globally minimum node in O(log k).',
      timeComplexity: 'O(N log k) where N is total node count.',
      spaceComplexity: 'O(k) auxiliary heap space.',
      keyTakeaway: 'In Python `heapq`, always supply a secondary unique integer key (such as list index or an incrementing counter) to prevent `TypeError: < not supported between instances of ListNode`.'
    },
    hints: [
      'Initialize heap with the head of every non-empty list.',
      'Tuple structure: `(node.val, list_index, node)`.',
      'Whenever popping a node, if `node.next` exists, push `node.next` into heap.'
    ]
  },

  {
    id: 'py-36-shortest-path-grid-obstacles',
    number: 36,
    title: 'Shortest Path in a Grid with Obstacles Elimination (State BFS)',
    slug: 'shortest-path-grid-obstacles',
    track: 'algorithms',
    difficulty: 'Hard',
    tags: ['BFS', 'Matrix', 'Shortest Path', 'State Space'],
    summary: 'Find the minimum steps to reach the destination in a grid while eliminating at most k obstacles.',
    description: `You are given an \`m x n\` integer matrix \`grid\` where each cell is either \`0\` (empty) or \`1\` (obstacle). You can move up, down, left, or right from and to an empty cell in one step.

Return the minimum number of steps to walk from the upper left corner \`(0, 0)\` to the lower right corner \`(m - 1, n - 1)\` given that you can eliminate **at most \`k\` obstacles**. If it is not possible to find such walk return \`-1\`.

### Requirements:
1. Implement \`shortest_path(grid: List[List[int]], k: int) -> int\`.
2. Model states as \`(row, col, remaining_k)\` to guarantee that BFS returns the minimum step count.`,
    examples: [
      {
        input: 'grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1',
        output: '6',
        explanation: 'The shortest path without obstacle elimination takes 10 steps, but with 1 elimination takes 6 steps.'
      },
      {
        input: 'grid = [[0,1,1],[1,1,1],[1,0,0]], k = 1',
        output: '-1',
        explanation: 'We need at least 2 eliminations to pass the wall of obstacles, which exceeds k=1.'
      }
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 40',
      '1 <= k <= m * n'
    ],
    starterCode: `from typing import List

def shortest_path(grid: List[List[int]], k: int) -> int:
    """
    Finds shortest path in a grid eliminating at most k obstacles.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import collections
from typing import List

def shortest_path(grid: List[List[int]], k: int) -> int:
    m, n = len(grid), len(grid[0])
    if m == 1 and n == 1:
        return 0
    # Optimization: If k is large enough, Manhattan distance is always reachable
    if k >= m + n - 2:
        return m + n - 2
        
    q = collections.deque([(0, 0, k, 0)])  # (row, col, remaining_k, steps)
    visited = {(0, 0, k)}
    
    while q:
        r, c, obs_left, steps = q.popleft()
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                new_k = obs_left - grid[nr][nc]
                if new_k >= 0:
                    if nr == m - 1 and nc == n - 1:
                        return steps + 1
                    if (nr, nc, new_k) not in visited:
                        visited.add((nr, nc, new_k))
                        q.append((nr, nc, new_k, steps + 1))
                        
    return -1
`,
    testHarness: `
def _run_tests():
    cases = [
        ([[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], 1, 6),
        ([[0,1,1],[1,1,1],[1,0,0]], 1, -1),
        ([[0]], 1, 0),
        ([[0,0],[0,0]], 0, 2)
    ]
    for g, k_val, expected in cases:
        inp_str = f"shortest_path({len(g)}x{len(g[0])} grid, k={k_val})"
        try:
            actual = shortest_path(g, k_val)
            passed = (actual == expected)
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
      approach: 'Standard BFS finds shortest paths on unweighted graphs, but visiting a cell depends on how many obstacle removals remain. Expand the state space from `(r, c)` to `(r, c, remaining_k)`. The first state that hits `(m-1, n-1)` is guaranteed to have minimum step count.',
      timeComplexity: 'O(M * N * K) maximum visited states.',
      spaceComplexity: 'O(M * N * K) for queue and visited set.',
      keyTakeaway: 'State-space BFS treats constraints as extra graph dimensions, guaranteeing optimal distance in a single breadth traversal.'
    },
    hints: [
      'If `k >= m + n - 2`, Manhattan distance `(m - 1) + (n - 1)` is instantly achievable.',
      'State tuple: `(r, c, remaining_k)`.',
      'Remember to subtract `grid[nr][nc]` from `remaining_k`.'
    ],
    visualizerId: 'bfs-grid'
  },

  {
    id: 'py-37-regular-expression-matching',
    number: 37,
    title: 'Regular Expression Matching with "." and "*" (DP)',
    slug: 'regular-expression-matching',
    track: 'algorithms',
    difficulty: 'Hard',
    tags: ['Dynamic Programming', 'Recursion', 'String', 'Parsing'],
    summary: 'Implement regular expression matching supporting "." and "*" with Dynamic Programming.',
    description: `Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:
- \`'.'\` Matches any single character.
- \`'*'\` Matches zero or more of the preceding element.

The matching should cover the **entire** input string (not partial).

### Requirements:
1. Implement \`is_match(s: str, p: str) -> bool\`.
2. Solve using 2D Bottom-Up Dynamic Programming in **O(|S| * |P|)** time.`,
    examples: [
      {
        input: 's = "aa", p = "a*"',
        output: 'true',
        explanation: '"*" means zero or more of the preceding element, "a". Therefore, by repeating "a" once, it becomes "aa".'
      },
      {
        input: 's = "ab", p = ".*"',
        output: 'true',
        explanation: '".*" means "zero or more (*) of any character (.)".'
      },
      {
        input: 's = "mississippi", p = "mis*is*p*."',
        output: 'false',
        explanation: 'Pattern fails to match the string.'
      }
    ],
    constraints: [
      '1 <= s.length <= 20',
      '1 <= p.length <= 20',
      's contains only lowercase English letters.',
      'p contains only lowercase English letters, ".", and "*".'
    ],
    starterCode: `def is_match(s: str, p: str) -> bool:
    """
    Evaluates if pattern p matches string s supporting '.' and '*'.
    """
    # Write your solution here
    pass
`,
    solutionCode: `def is_match(s: str, p: str) -> bool:
    dp = [[False] * (len(p) + 1) for _ in range(len(s) + 1)]
    dp[0][0] = True
    
    # Handle patterns with '*' matching empty string, e.g. "a*", "a*b*"
    for j in range(2, len(p) + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]
            
    for i in range(1, len(s) + 1):
        for j in range(1, len(p) + 1):
            if p[j - 1] == s[i - 1] or p[j - 1] == '.':
                dp[i][j] = dp[i - 1][j - 1]
            elif p[j - 1] == '*':
                # Case 1: 0 occurrences of preceding character
                dp[i][j] = dp[i][j - 2]
                # Case 2: 1 or more occurrences if preceding matches
                if p[j - 2] == s[i - 1] or p[j - 2] == '.':
                    dp[i][j] = dp[i][j] or dp[i - 1][j]
                    
    return dp[len(s)][len(p)]
`,
    testHarness: `
def _run_tests():
    cases = [
        ("aa", "a*", True),
        ("ab", ".*", True),
        ("mississippi", "mis*is*p*.", False),
        ("aab", "c*a*b", True),
        ("", "a*", True),
        ("ab", ".*c", False)
    ]
    for s_val, p_val, expected in cases:
        inp_str = f"is_match('{s_val}', '{p_val}')"
        try:
            actual = is_match(s_val, p_val)
            passed = (actual == expected)
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
      approach: 'Define `dp[i][j]` as whether `s[:i]` matches `p[:j]`. When `p[j-1] == "*"`: zero matches uses `dp[i][j-2]`. One or more matches checks if the predecessor `p[j-2]` matches `s[i-1]`, then transitions to `dp[i-1][j]`.',
      timeComplexity: 'O(|S| * |P|) grid evaluation.',
      spaceComplexity: 'O(|S| * |P|) DP table.',
      keyTakeaway: 'The asterisk character `*` binds to the preceding token and offers two branches: ignore preceding token (look back 2 columns) or consume one char from `s` (look up 1 row).'
    },
    hints: [
      'Initialize `dp[0][0] = True` for two empty strings.',
      'Check `dp[0][j] = dp[0][j-2]` for patterns like `a*b*`.',
      'When seeing `*`, consider zero instances (`dp[i][j-2]`) OR consuming a char (`dp[i-1][j]`).'
    ]
  },

  {
    id: 'py-38-largest-rectangle-histogram',
    number: 38,
    title: 'Largest Rectangle in Histogram (Monotonic Stack)',
    slug: 'largest-rectangle-histogram',
    track: 'algorithms',
    difficulty: 'Hard',
    tags: ['Monotonic Stack', 'Array', 'Geometry'],
    summary: 'Find the area of the largest rectangle in the histogram in O(N) linear time.',
    description: `Given an array of integers \`heights\` representing the histogram's bar height where the width of each bar is \`1\`, return the area of the largest rectangle in the histogram.

This tests your mastery of the **Monotonic Stack pattern**, calculating left and right bounding limits in a single linear sweep.

### Requirements:
1. Implement \`largest_rectangle_area(heights: List[int]) -> int\`.
2. Must achieve strict **O(N)** time complexity. Brute force O(N²) will timeout on large histograms.`,
    examples: [
      {
        input: 'heights = [2, 1, 5, 6, 2, 3]',
        output: '10',
        explanation: 'The largest rectangle is formed between heights 5 and 6: area = 5 * 2 = 10.'
      },
      {
        input: 'heights = [2, 4]',
        output: '4',
        explanation: 'Area of 4 formed by bar of height 4.'
      }
    ],
    constraints: [
      '1 <= heights.length <= 10^5',
      '0 <= heights[i] <= 10^4'
    ],
    starterCode: `from typing import List

def largest_rectangle_area(heights: List[int]) -> int:
    """
    Finds the area of the largest rectangle in the histogram.
    """
    # Write your solution here
    pass
`,
    solutionCode: `from typing import List

def largest_rectangle_area(heights: List[int]) -> int:
    stack = []  # Stores (start_index, height)
    max_area = 0
    # Append 0 to flush all remaining taller bars from the stack at the end
    extended_heights = heights + [0]
    
    for i, h in enumerate(extended_heights):
        start = i
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            max_area = max(max_area, height * (i - idx))
            start = idx  # The current bar can extend backwards to idx
        stack.append((start, h))
        
    return max_area
`,
    testHarness: `
def _run_tests():
    cases = [
        ([2, 1, 5, 6, 2, 3], 10),
        ([2, 4], 4),
        ([1, 1, 1, 1], 4),
        ([6, 2, 5, 4, 5, 1, 6], 12),
        ([0, 9], 9)
    ]
    for h, expected in cases:
        inp_str = f"largest_rectangle_area({h})"
        try:
            actual = largest_rectangle_area(list(h))
            passed = (actual == expected)
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
      approach: 'Maintain a monotonic increasing stack storing `(index, height)`. Whenever a bar is shorter than the top of the stack, pop the taller bar and calculate its maximum area as `height * (current_index - start_index)`. Extend the start index of the new shorter bar backward to the index of the last popped bar.',
      timeComplexity: 'O(N) single pass since every bar is pushed and popped at most once.',
      spaceComplexity: 'O(N) auxiliary space for the stack.',
      keyTakeaway: 'Appending a sentinel height `0` at the end ensures all remaining bars in the stack are resolved and popped without writing duplicate post-loop logic.'
    },
    hints: [
      'A bar can extend left until encountering a bar shorter than itself.',
      'When popping a taller bar, calculate its max rectangle with width `current_index - start_index`.',
      'Append a trailing 0 to flush remaining stack items.'
    ]
  }
];
