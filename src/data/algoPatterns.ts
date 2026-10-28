import type { AlgoPattern } from '../types/patterns';

export const algoPatterns: AlgoPattern[] = [
  {
    id: 'two-pointers',
    number: 1,
    title: 'Two Pointers (Converging / Inward Traversal)',
    subtitle: 'Monotonic search space pruning in O(N) time and O(1) space',
    category: 'Two Pointers & Window',
    difficulty: 'Foundational',
    tags: ['Two Pointers', 'Sorted Arrays', 'In-Place', 'O(1) Memory'],
    relatedQuestionId: 'py-08-two-sum-sorted',
    relatedQuestionNumber: 8,
    relatedQuestionTitle: '#8 Two Sum II - Input Array Is Sorted',
    visualizerId: 'two-pointers',

    origin: {
      year: '1961',
      pioneer: 'Sir Tony Hoare (QuickSelect & Partitioning)',
      context:
        'Pioneered during the development of Quicksort and symmetric boundary search algorithms. When elements exhibit order, testing every permutation is mathematically redundant.',
    },
    whyCreated:
      'To solve the pairwise combination problem on ordered data without allocating memory for hash tables or burning O(N²) time on nested loops.',
    fundamentalBottleneck:
      'Nested loops examine all N(N-1)/2 pairs. If an array is sorted, comparing nums[i] + nums[j] against target informs you not just about (i, j), but eliminates an entire row or column of candidate pairs simultaneously.',

    ahaAnalogy: {
      title: 'The Balance Scale & The Room Thermostat',
      story:
        'Imagine two people holding the ends of a calibrated sliding ruler. If the sum of their positions is too low, you don’t randomly jump around: the person on the left MUST step to the right to increase the total. If the sum is too high, the person on the right MUST step to the left to decrease it. Because numbers are sorted, neither person ever has to back up.',
      visualConcept: 'Pointers start at outermost boundaries (0 and N-1) and march strictly inward until meeting.',
      takeaway: 'Directional monotonicity turns a 2D grid search into a 1D linear walk.',
    },

    intuition: {
      coreIdea:
        'Exploit the transitive order property of sorted sequences. If nums[L] + nums[R] < target, then for the fixed index L, ANY other index r < R will yield an even smaller sum (nums[L] + nums[r] <= nums[L] + nums[R] < target). Hence, nums[L] can NEVER be part of the solution with ANY remaining element. We safely increment L in O(1).',
      whyNaiveFails:
        'The brute force approach compares nums[i] + nums[j] for all i < j. This tests N²/2 combinations. A hash map solves it in O(N) time but requires O(N) extra space. Two Pointers achieves optimal O(N) time with strictly O(1) auxiliary space.',
      mathematicalInsight:
        'The search matrix M[i][j] = nums[i] + nums[j] is a Young Tableau (sorted along rows and columns). Two pointers traverses the anti-diagonal contour, reducing an N×N matrix search to at most 2N steps.',
    },

    blueprint: {
      triggerSignals: [
        'Input is an array or string that is already SORTED (or can be sorted in O(N log N)).',
        'Asked to find pairs, triplets, or container boundaries meeting an exact sum or condition.',
        'Strict constraint: O(1) auxiliary space allowed (disqualifies Hash Sets/Maps).',
        'Finding palindromes or reversing elements in-place.',
      ],
      steps: [
        '1. Initialize left = 0, right = len(nums) - 1.',
        '2. Enter a loop while left < right.',
        '3. Calculate current_sum = nums[left] + nums[right].',
        '4. If current_sum == target: return indices or solution pair.',
        '5. If current_sum < target: left += 1 (need a larger sum).',
        '6. If current_sum > target: right -= 1 (need a smaller sum).',
        '7. If pointers meet without a match, no valid pair exists.',
      ],
      codeTemplate: `def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    """
    Two Pointers Inward Traversal: O(N) time, O(1) space.
    Requires nums to be sorted in non-decreasing order.
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        curr = nums[left] + nums[right]
        if curr == target:
            return [left + 1, right + 1]  # 1-indexed for Two Sum II
        elif curr < target:
            left += 1   # Increase sum monotonically
        else:
            right -= 1  # Decrease sum monotonically
            
    return []`,
      complexity: {
        time: 'O(N) - In every single iteration, either left increments or right decrements. At most N steps.',
        space: 'O(1) - Only two integer pointer variables allocated.',
      },
    },

    visualizerConfig: {
      type: 'two-pointers',
      presets: [
        {
          id: 'two-sum-found',
          name: 'Target 26 (Found: 11 + 15)',
          description: 'Pointers converge from outer edges to match target sum 26.',
          inputData: { array: [2, 7, 11, 15, 18, 21, 24], target: 26 },
          steps: [
            {
              stepNumber: 1,
              label: 'Initialize Pointers',
              description: 'Left = 0 (val 2), Right = 6 (val 24). Sum = 2 + 24 = 26 == target 26!',
              stateSnapshot: { left: 0, right: 6, sum: 26, target: 26, status: 'found' },
              activePointers: { L: 0, R: 6 },
              highlightIndices: [0, 6],
            },
          ],
        },
        {
          id: 'two-sum-walk',
          name: 'Target 18 (Step-by-Step Convergence)',
          description: 'Demonstrating sum adjustments with both left and right adjustments.',
          inputData: { array: [2, 7, 11, 15, 18, 21, 24], target: 18 },
          steps: [
            {
              stepNumber: 1,
              label: 'Step 1: Check boundaries',
              description: 'L=0 (2), R=6 (24). Sum = 26 > 18. Sum is too large! Decrement R.',
              stateSnapshot: { left: 0, right: 6, sum: 26, target: 18, status: 'too-large' },
              activePointers: { L: 0, R: 6 },
              highlightIndices: [0, 6],
            },
            {
              stepNumber: 2,
              label: 'Step 2: Decrement Right',
              description: 'L=0 (2), R=5 (21). Sum = 23 > 18. Still too large! Decrement R.',
              stateSnapshot: { left: 0, right: 5, sum: 23, target: 18, status: 'too-large' },
              activePointers: { L: 0, R: 5 },
              highlightIndices: [0, 5],
            },
            {
              stepNumber: 3,
              label: 'Step 3: Decrement Right',
              description: 'L=0 (2), R=4 (18). Sum = 20 > 18. Decrement R.',
              stateSnapshot: { left: 0, right: 4, sum: 20, target: 18, status: 'too-large' },
              activePointers: { L: 0, R: 4 },
              highlightIndices: [0, 4],
            },
            {
              stepNumber: 4,
              label: 'Step 4: Decrement Right',
              description: 'L=0 (2), R=3 (15). Sum = 17 < 18. Too small! Increment L.',
              stateSnapshot: { left: 0, right: 3, sum: 17, target: 18, status: 'too-small' },
              activePointers: { L: 0, R: 3 },
              highlightIndices: [0, 3],
            },
            {
              stepNumber: 5,
              label: 'Step 5: Match Found!',
              description: 'L=1 (7), R=3 (11). Sum = 7 + 11 = 18 == Target! Return indices [2, 4].',
              stateSnapshot: { left: 1, right: 3, sum: 18, target: 18, status: 'found' },
              activePointers: { L: 1, R: 3 },
              highlightIndices: [1, 3],
            },
          ],
        },
      ],
    },

    traps: [
      {
        title: 'Unsorted Array Assumption',
        explanation: 'Applying inward two pointers to an unsorted array fails completely because monotonicity is broken.',
        mitigation: 'If sorting is permitted, sort first in O(N log N). If the original indices are needed, use a Hash Map in O(N) space.',
      },
      {
        title: 'Handling Duplicate Values in 3Sum / KSum',
        explanation: 'Failing to skip duplicate consecutive numbers results in duplicate output triplets.',
        mitigation: 'After finding a match or shifting, run `while left < right and nums[left] == nums[left+1]: left += 1`.',
      },
      {
        title: '1-Indexed vs 0-Indexed Pitfall',
        explanation: 'LeetCode #167 (Two Sum II) explicitly asks for 1-based indices `[left + 1, right + 1]`.',
        mitigation: 'Double check problem return constraints before returning raw array indices.',
      },
    ],

    interviewVariants: [
      { name: 'Valid Palindrome II', difficulty: 'Easy', twist: 'When chars mismatch, branch into two checks: test if skipping L OR skipping R yields a valid palindrome.' },
      { name: '3Sum (Triple Target Sum)', difficulty: 'Medium', twist: 'Fix one element i, then run Two Pointers on the subarray i+1...N-1. Skip duplicates at both the outer and inner loops.' },
      { name: 'Container With Most Water', difficulty: 'Medium', twist: 'Area is limited by min(height[L], height[R]). Always advance the pointer pointing to the shorter vertical bar.' },
    ],
  },

  {
    id: 'stack-matching',
    number: 2,
    title: 'Matching & Monotonic Stack (LIFO Structural Hierarchy)',
    subtitle: 'Hierarchical bracket validation and next-greater-element tracking in O(N)',
    category: 'Data Structures & LIFO',
    difficulty: 'Foundational',
    tags: ['Stack', 'LIFO', 'Strings', 'Grammar Parsing', 'Monotonic'],
    relatedQuestionId: 'py-11-valid-parentheses',
    relatedQuestionNumber: 11,
    relatedQuestionTitle: '#11 Valid Parentheses',

    origin: {
      year: '1957',
      pioneer: 'Friedrich L. Bauer & Klaus Samelson',
      context:
        'Invented to parse arithmetic expressions and construct compiler abstract syntax trees (ASTs). The German patent called it the "Kellerprinzip" (Cellar/Stack principle).',
    },
    whyCreated:
      'To validate nested grammatical constructs where the most recently opened context must be the first one closed.',
    fundamentalBottleneck:
      'A simple counter fails because order matters: `([)]` has equal counts of brackets, but is syntactically invalid because the inner `[` was not closed before `)`.',

    ahaAnalogy: {
      title: 'Russian Nesting Dolls & Cafeteria Plate Dispenser',
      story:
        'You open a large doll, then a medium doll, then a small doll. You CANNOT close the large doll until all inner dolls have been sealed in exact reverse order. If you try to seal a square lid on a round doll, the sequence is broken immediately.',
      visualConcept: 'Push on opening; Pop and assert match on closing; Stack must be empty at the end.',
      takeaway: 'LIFO (Last-In, First-Out) enforces proper nesting invariance in linear time.',
    },

    intuition: {
      coreIdea:
        'As you scan left to right: push opening brackets onto the stack. When a closing bracket arrives, it MUST match the bracket at the very top of the stack. Pop it. If the stack is empty when a closing bracket arrives, or the top does not match, return False immediately.',
      whyNaiveFails:
        'Repeated string replacements like `while "()" in s or "[]" in s: s.replace(...)` take O(N²) time due to repeated string copying. A stack does this in a single O(N) pass.',
      mathematicalInsight:
        'Recognizes languages generated by Dyck paths / Context-Free Grammars. The stack height at step i represents the current nesting depth.',
    },

    blueprint: {
      triggerSignals: [
        'Problem involves matching pairs: parentheses, XML/HTML tags, markdown formatting.',
        'Requires tracking the "Next Greater Element" or "Previous Smaller Element" (Monotonic Stack).',
        'Evaluating mathematical postfix or infix expressions.',
      ],
      steps: [
        '1. Define mapping = {")": "(", "}": "{", "]": "["}.',
        '2. Initialize empty stack = [].',
        '3. For char in s: if char in mapping (closing bracket), pop top if stack not empty else dummy, assert top == mapping[char].',
        '4. If opening bracket, stack.append(char).',
        '5. After loop, return len(stack) == 0 (ensures no unclosed brackets remain).',
      ],
      codeTemplate: `def is_valid_parentheses(s: str) -> bool:
    """
    Valid Parentheses using LIFO Stack.
    Time: O(N) | Space: O(N)
    """
    pairs = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for char in s:
        if char in pairs:
            # Pop top element if stack is non-empty, otherwise assign mismatch sentinel
            top = stack.pop() if stack else '#'
            if top != pairs[char]:
                return False
        else:
            stack.append(char)
            
    return len(stack) == 0`,
      complexity: {
        time: 'O(N) - Single pass through string; each character pushed and popped at most once.',
        space: 'O(N) - In worst case of all opening brackets (e.g. "((((("), stack holds N elements.',
      },
    },

    visualizerConfig: {
      type: 'stack-matching',
      presets: [
        {
          id: 'stack-valid',
          name: 'Expression "{[()]}" (Valid)',
          description: 'Demonstrating nested push and reverse-order pop operations.',
          inputData: { s: '{[()]}' },
          steps: [
            {
              stepNumber: 1,
              label: 'Push "{"',
              description: 'Opening bracket. Stack: ["{"]',
              stateSnapshot: { stack: ['{'], char: '{', action: 'push' },
            },
            {
              stepNumber: 2,
              label: 'Push "["',
              description: 'Opening bracket. Stack: ["{", "["]',
              stateSnapshot: { stack: ['{', '['], char: '[', action: 'push' },
            },
            {
              stepNumber: 3,
              label: 'Push "("',
              description: 'Opening bracket. Stack: ["{", "[", "("]',
              stateSnapshot: { stack: ['{', '[', '('], char: '(', action: 'push' },
            },
            {
              stepNumber: 4,
              label: 'Match & Pop ")"',
              description: 'Closing bracket ")" matches top "(". Popped! Stack: ["{", "["]',
              stateSnapshot: { stack: ['{', '['], char: ')', action: 'pop-match' },
            },
            {
              stepNumber: 5,
              label: 'Match & Pop "]"',
              description: 'Closing bracket "]" matches top "[". Popped! Stack: ["{"]',
              stateSnapshot: { stack: ['{'], char: ']', action: 'pop-match' },
            },
            {
              stepNumber: 6,
              label: 'Match & Pop "}"',
              description: 'Closing bracket "}" matches top "{". Popped! Stack: []',
              stateSnapshot: { stack: [], char: '}', action: 'pop-match' },
            },
          ],
        },
      ],
    },

    traps: [
      {
        title: 'Forgetting Final Emptiness Check',
        explanation: 'If input is `"((("`, no closing bracket ever mismatches, but the string is invalid because 3 brackets remain unclosed.',
        mitigation: 'Always return `len(stack) == 0` instead of `True` at the end of the function.',
      },
      {
        title: 'Popping from Empty Stack',
        explanation: 'If string starts with closing bracket `")"`, calling `stack.pop()` raises `IndexError`.',
        mitigation: 'Check `stack.pop() if stack else None` or guard with `if not stack: return False`.',
      },
      {
        title: 'Odd String Length Early Exit',
        explanation: 'Any string with an odd number of brackets can never be fully balanced.',
        mitigation: 'Add `if len(s) % 2 != 0: return False` as an immediate O(1) early check.',
      },
    ],

    interviewVariants: [
      { name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', twist: 'Operands pushed onto stack; operators pop two values, apply operation, and push result.' },
      { name: 'Daily Temperatures (Monotonic Stack)', difficulty: 'Medium', twist: 'Maintain a decreasing stack of temperature indices. Pop when current day is warmer to calculate days waited.' },
      { name: 'Largest Rectangle in Histogram', difficulty: 'Hard', twist: 'Monotonic increasing stack of bar heights to find width between left and right smaller boundaries in O(N).' },
    ],
  },

  {
    id: 'linked-list-reversal',
    number: 3,
    title: 'In-Place Pointer Manipulation (Linked List Reversal)',
    subtitle: 'Reversing unidirectional node references with zero heap allocations',
    category: 'Data Structures & LIFO',
    difficulty: 'Foundational',
    tags: ['Linked List', 'Pointers', 'In-Place', 'O(1) Memory'],
    relatedQuestionId: 'py-12-reverse-linked-list',
    relatedQuestionNumber: 12,
    relatedQuestionTitle: '#12 Reverse Linked List In-Place',

    origin: {
      year: '1958',
      pioneer: 'John McCarthy (LISP List Processing)',
      context:
        'Early computers had only tiny magnetic core memories. Copying node structures was prohibited; memory had to be reorganized in-place by rewiring memory addresses.',
    },
    whyCreated:
      'To reverse the traversal order of a singly linked list without allocating new node objects or an auxiliary array of pointers.',
    fundamentalBottleneck:
      'In a singly linked list, each node only knows about the NEXT node. If you overwrite `curr.next = prev`, you immediately lose the reference to the entire rest of the list unless you preserve it in a temporary variable first!',

    ahaAnalogy: {
      title: 'Uncoupling and Flipping Train Cars',
      story:
        'You want to reverse a train track. Before you pull the pin connecting Car A to Car B, you MUST hold onto Car B with your other hand. Once Car B is secure, you can safely swing Car A backward to hook onto Car 0 (prev). Then step forward to Car B.',
      visualConcept: 'A three-variable dance: `prev`, `curr`, `nxt`. Hold forward before turning backward.',
      takeaway: 'Four lines of code executed in a tight loop: save next, reverse pointer, advance prev, advance curr.',
    },

    intuition: {
      coreIdea:
        'Maintain three pointers: `prev` (starts at None), `curr` (starts at head), and `nxt` (temporary holder). Save `nxt = curr.next`. Point `curr.next = prev`. Advance `prev = curr`. Advance `curr = nxt`. Repeat until curr is None.',
      whyNaiveFails:
        'Writing all values to a Python list and building a new linked list costs O(N) space and creates garbage collector overhead. In systems interviews, interviewers expect strict in-place O(1) space manipulation.',
      mathematicalInsight:
        'Graph inversion: reverses every directed edge (u, v) into (v, u) in a directed path graph.',
    },

    blueprint: {
      triggerSignals: [
        'Asked to reverse a linked list, or reverse in groups of K (Reverse Nodes in k-Group).',
        'Checking if a singly linked list is a palindrome (reverse second half, compare, restore).',
        'Strict constraint: O(1) extra memory.',
      ],
      steps: [
        '1. Initialize prev = None, curr = head.',
        '2. Loop while curr is not None.',
        '3. nxt = curr.next (preserve forward reference).',
        '4. curr.next = prev (reverse the pointer).',
        '5. prev = curr (move prev forward).',
        '6. curr = nxt (move curr forward).',
        '7. Return prev (which is now the new head of the reversed list).',
      ],
      codeTemplate: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode | None) -> ListNode | None:
    """
    Iterative In-Place Linked List Reversal.
    Time: O(N) | Space: O(1)
    """
    prev = None
    curr = head
    
    while curr is not None:
        nxt = curr.next   # 1. Save forward pointer
        curr.next = prev  # 2. Reverse arrow
        prev = curr       # 3. Slide prev forward
        curr = nxt        # 4. Slide curr forward
        
    return prev  # New head`,
      complexity: {
        time: 'O(N) - Traverses each node exactly once.',
        space: 'O(1) - Only two pointer variables allocated on the stack.',
      },
    },

    visualizerConfig: {
      type: 'linked-list-reversal',
      presets: [
        {
          id: 'reverse-1-2-3-4',
          name: 'List 1 -> 2 -> 3 -> 4 -> None',
          description: 'Step-by-step pointer arrow inversion.',
          inputData: { values: [1, 2, 3, 4] },
          steps: [
            {
              stepNumber: 1,
              label: 'Reverse Node 1',
              description: 'Save Node 2. Point Node 1 -> None. prev becomes 1, curr becomes 2.',
              stateSnapshot: { prevVal: 1, currVal: 2, nextVal: 3 },
            },
            {
              stepNumber: 2,
              label: 'Reverse Node 2',
              description: 'Save Node 3. Point Node 2 -> 1. prev becomes 2, curr becomes 3.',
              stateSnapshot: { prevVal: 2, currVal: 3, nextVal: 4 },
            },
            {
              stepNumber: 3,
              label: 'Reverse Node 3',
              description: 'Save Node 4. Point Node 3 -> 2. prev becomes 3, curr becomes 4.',
              stateSnapshot: { prevVal: 3, currVal: 4, nextVal: null },
            },
            {
              stepNumber: 4,
              label: 'Reverse Node 4',
              description: 'Save None. Point Node 4 -> 3. prev becomes 4, curr becomes None.',
              stateSnapshot: { prevVal: 4, currVal: null, nextVal: null },
            },
          ],
        },
      ],
    },

    traps: [
      {
        title: 'Returning curr instead of prev',
        explanation: 'When the while loop terminates, `curr` is None! Returning `curr` returns an empty list.',
        mitigation: 'Always return `prev`, which sits on the last valid node.',
      },
      {
        title: 'Empty List or Single Node Null Dereference',
        explanation: 'Failing to handle `head is None` or `head.next is None` gracefully.',
        mitigation: 'The standard iterative 4-line loop naturally handles both 0 and 1 node lists without special cases.',
      },
      {
        title: 'Recursion Depth Limit in Python',
        explanation: 'Recursive reversal consumes O(N) stack frames, hitting `RecursionError` around N=1000.',
        mitigation: 'Prefer the iterative O(1) space loop in production and interview environments.',
      },
    ],

    interviewVariants: [
      { name: 'Palindrome Linked List', difficulty: 'Easy', twist: 'Find middle using fast/slow pointers, reverse second half, compare values, and restore original list.' },
      { name: 'Reverse Linked List II (Between Left and Right)', difficulty: 'Medium', twist: 'Reverse only the sublist from position left to position right while splicing it back into the main list.' },
      { name: 'Reverse Nodes in k-Group', difficulty: 'Hard', twist: 'Count k nodes ahead first; if available, reverse them and recursively attach the remaining reversed chunks.' },
    ],
  },

  {
    id: 'sliding-window',
    number: 4,
    title: 'Sliding Window (Dynamic & Fixed-Size)',
    subtitle: 'Incremental state reuse over contiguous subarrays without redundant re-scans',
    category: 'Two Pointers & Window',
    difficulty: 'Intermediate',
    tags: ['Sliding Window', 'Strings', 'Hash Map', 'Subarrays', 'Amortized O(N)'],
    relatedQuestionId: 'py-09-longest-substring-without-repeats',
    relatedQuestionNumber: 9,
    relatedQuestionTitle: '#9 Longest Substring Without Repeating Characters',
    visualizerId: 'sliding-window',

    origin: {
      year: '1974',
      pioneer: 'Vint Cerf & Bob Kahn (TCP Sliding Window Protocol)',
      context:
        'Originally formulated to manage packet transmission flow over unreliable networks without waiting for individual ACKs. Later translated into algorithmic string processing to eliminate redundant contiguous subarray scans.',
    },
    whyCreated:
      'To eliminate the O(K × N) or O(N²) cost of repeatedly recalculating sums, character frequencies, or invariants over overlapping contiguous windows.',
    fundamentalBottleneck:
      'When moving a window of size K from index i to i+1, K-1 elements overlap! Calculating the new state from scratch wastes O(K) work per step. Sliding window updates the state in O(1) by adding the new arrival and subtracting the departing element.',

    ahaAnalogy: {
      title: 'The Inchworm / Caterpillar on a Branch',
      story:
        'Imagine an inchworm moving across a leaf. The head (right pointer) reaches forward to explore new terrain. If the terrain becomes invalid (e.g., duplicate character encountered or sum exceeds capacity), the tail (left pointer) contracts inward until the body is back on solid ground. The worm never jumps backwards.',
      visualConcept: 'Right pointer expands the horizon; Left pointer shrinks when invariants are violated.',
      takeaway: 'Both pointers only move forward. Total steps: at most 2N = O(N) amortized.',
    },

    intuition: {
      coreIdea:
        'Maintain a valid range [left...right] and a supporting state (e.g., character frequency map or running sum). For every step of right from 0 to N-1, incorporate char at right. If the window violates the validity condition, increment left until validity is restored. Record max/min window size.',
      whyNaiveFails:
        'Checking all substrings takes O(N²) pairs, and checking uniqueness takes O(N) per substring, totaling O(N³). Even with a set, it takes O(N²). Sliding Window avoids all sub-scans, finishing in O(N).',
      mathematicalInsight:
        'Because both left and right iterate monotonically from 0 to N-1, each element enters the window once and leaves at most once. Amortized operations per element = 2.',
    },

    blueprint: {
      triggerSignals: [
        'Input is an array or string, and the problem requires contiguous subarrays or substrings.',
        'Keywords: "Longest substring with...", "Smallest subarray whose sum >= S", "Contains all anagrams of P".',
        'Comparing sequential contiguous blocks of size K.',
      ],
      steps: [
        '1. Initialize left = 0, state = {}, max_len = 0.',
        '2. Loop right from 0 to len(s) - 1.',
        '3. Add s[right] to state.',
        '4. While the window condition is invalid: remove s[left] from state, left += 1.',
        '5. Window is now valid: update max_len = max(max_len, right - left + 1).',
        '6. Return max_len.',
      ],
      codeTemplate: `def length_of_longest_substring(s: str) -> int:
    """
    Dynamic Sliding Window with Last-Seen Index Map.
    Time: O(N) single pass | Space: O(min(N, AlphabetSize))
    """
    last_seen = {}
    left = 0
    max_length = 0
    
    for right, char in enumerate(s):
        # If char seen inside the CURRENT window, jump left past it
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
            
        last_seen[char] = right
        max_length = max(max_length, right - left + 1)
        
    return max_length`,
      complexity: {
        time: 'O(N) - Right pointer visits each index once; left pointer only advances forward.',
        space: 'O(min(N, Σ)) - Where Σ is the character set size (at most 128 for ASCII or 26 for lowercase English).',
      },
    },

    visualizerConfig: {
      type: 'sliding-window',
      presets: [
        {
          id: 'sliding-abcabcbb',
          name: 'String "abcabcbb" (Classic)',
          description: 'Standard interview example where characters begin repeating at index 3.',
          inputData: { s: 'abcabcbb' },
          steps: [
            {
              stepNumber: 1,
              label: 'Expand Right to index 0 ("a")',
              description: 'Char "a" added. Window: [a], length: 1.',
              stateSnapshot: { left: 0, right: 0, window: 'a', maxLen: 1, duplicates: false },
              activePointers: { L: 0, R: 0 },
              highlightIndices: [0],
            },
            {
              stepNumber: 2,
              label: 'Expand Right to index 1 ("b")',
              description: 'Char "b" added. Window: [ab], length: 2.',
              stateSnapshot: { left: 0, right: 1, window: 'ab', maxLen: 2, duplicates: false },
              activePointers: { L: 0, R: 1 },
              highlightIndices: [0, 1],
            },
            {
              stepNumber: 3,
              label: 'Expand Right to index 2 ("c")',
              description: 'Char "c" added. Window: [abc], length: 3.',
              stateSnapshot: { left: 0, right: 2, window: 'abc', maxLen: 3, duplicates: false },
              activePointers: { L: 0, R: 2 },
              highlightIndices: [0, 1, 2],
            },
            {
              stepNumber: 4,
              label: 'Collision on "a" at index 3!',
              description: 'Char "a" was last seen at index 0. Contract Left to index 1. Window: [bca], length: 3.',
              stateSnapshot: { left: 1, right: 3, window: 'bca', maxLen: 3, duplicates: true },
              activePointers: { L: 1, R: 3 },
              highlightIndices: [1, 2, 3],
            },
          ],
        },
      ],
    },

    traps: [
      {
        title: 'Forgetting to check if duplicate is inside current window',
        explanation: 'If using a dictionary of last seen indices: `if char in seen:` is a bug! The character might have been seen before `left` in an already discarded segment.',
        mitigation: 'Always verify `if char in seen and seen[char] >= left: left = seen[char] + 1`.',
      },
      {
        title: 'Negative Numbers in Subarray Sum Windows',
        explanation: 'Sliding window ONLY works for subarray sum problems when numbers are strictly non-negative. If numbers can be negative, expanding right can decrease the sum!',
        mitigation: 'When negative values exist, switch to the Prefix Sum + Hash Map pattern.',
      },
      {
        title: 'Off-by-One in Window Length Calculation',
        explanation: 'The length of inclusive interval [left...right] is `right - left + 1`, NOT `right - left`.',
        mitigation: 'Verify with a 1-element window: right=0, left=0 -> 0 - 0 + 1 = 1.',
      },
    ],

    interviewVariants: [
      { name: 'Maximum Sum Subarray of Size K', difficulty: 'Easy', twist: 'Fixed-size window: once right >= k-1, subtract nums[right - k] at each step.' },
      { name: 'Longest Repeating Character Replacement', difficulty: 'Medium', twist: 'Condition is `(window_length - max_frequency) <= k`. If violated, slide left forward by 1.' },
      { name: 'Minimum Window Substring', difficulty: 'Hard', twist: 'Window must contain all chars of string T with matching frequencies. Shrink left whenever window is valid to find minimum.' },
    ],
  },

  {
    id: 'modified-binary-search',
    number: 5,
    title: 'Modified Binary Search (Condition-Halving)',
    subtitle: 'Exponential search space reduction on rotated, stepped, or implicit sorted domains',
    category: 'Search & Divide',
    difficulty: 'Intermediate',
    tags: ['Binary Search', 'Divide and Conquer', 'Rotated Array', 'O(log N)'],
    relatedQuestionId: 'py-10-search-rotated-sorted-array',
    relatedQuestionNumber: 10,
    relatedQuestionTitle: '#10 Search in Rotated Sorted Array',
    visualizerId: 'binary-search',

    origin: {
      year: '1946',
      pioneer: 'John Mauchly (Moore School Lectures) & Derrick Lehmer (1960)',
      context:
        'Formalized as an optimal information-theoretic comparison search. Each comparison yields 1 bit of information, halving uncertainty.',
    },
    whyCreated:
      'To search enormous datasets in logarithmic O(log N) steps instead of O(N) sequential scans, even when the array has been structurally modified (e.g. rotated or sheared).',
    fundamentalBottleneck:
      'Linear search checks elements one-by-one. For 1,000,000 elements, linear search takes up to 1,000,000 checks; Binary Search takes at most 20 checks.',

    ahaAnalogy: {
      title: 'The Fractured Encyclopedia / High-Low Number Guess',
      story:
        'Imagine a sorted dictionary sliced into two halves and stacked in reverse order. If you open it right at the middle, ONE of the two sides is guaranteed to still be in perfect alphabetical order! You check if your target word belongs between the boundaries of that clean, unbroken half. If yes, search there; if not, your word MUST be in the other half. Discard half the encyclopedia either way.',
      visualConcept: 'At least one half [left...mid] or [mid...right] is ALWAYS strictly sorted.',
      takeaway: 'Identify the cleanly sorted half first, then test if target falls strictly within its boundaries.',
    },

    intuition: {
      coreIdea:
        'In a rotated sorted array without duplicates, split at midpoint `mid`. Check: is `nums[left] <= nums[mid]`? If true, the LEFT half is sorted! Otherwise, the RIGHT half is sorted. Once you know which half is monotonic, a simple boundary check `left_val <= target < mid_val` reveals which half to keep and which half to eliminate.',
      whyNaiveFails:
        'Brute force scan is O(N). Beginners get stuck thinking "it is not fully sorted, so binary search is impossible". The key insight: binary search does NOT require the full array to be sorted, only that you can discard 50% of the remaining search space with each comparison.',
      mathematicalInsight:
        'Recurrence relation: T(N) = T(N/2) + O(1). By the Master Theorem, T(N) = O(log N).',
    },

    blueprint: {
      triggerSignals: [
        'Array was originally sorted, but subjected to rotations or shifts.',
        'Target time complexity requested is O(log N).',
        'Finding inflection points, local peaks, or minimum in rotated array.',
      ],
      steps: [
        '1. Set left = 0, right = len(nums) - 1.',
        '2. Loop while left <= right.',
        '3. mid = left + (right - left) // 2 (avoids integer overflow).',
        '4. If nums[mid] == target: return mid.',
        '5. Determine which half is sorted: if nums[left] <= nums[mid] (left is sorted), else (right is sorted).',
        '6. Check if target lies within the boundaries of the sorted half. Adjust left or right accordingly.',
        '7. If left > right, element is not present; return -1.',
      ],
      codeTemplate: `def search_rotated(nums: list[int], target: int) -> int:
    """
    Modified Binary Search on Rotated Sorted Array.
    Time: O(log N) | Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
            
        # Case A: Left half [left...mid] is cleanly sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target is in sorted left half
            else:
                left = mid + 1   # Target is in right half
        # Case B: Right half [mid...right] is cleanly sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target is in sorted right half
            else:
                right = mid - 1  # Target is in left half
                
    return -1`,
      complexity: {
        time: 'O(log N) - Search space is halved on every single step.',
        space: 'O(1) - Pure iterative pointer manipulation.',
      },
    },

    visualizerConfig: {
      type: 'binary-search',
      presets: [
        {
          id: 'bs-rotated-0',
          name: 'Target 0 in [4, 5, 6, 7, 0, 1, 2]',
          description: 'Search for target 0 across the rotation inflection point.',
          inputData: { array: [4, 5, 6, 7, 0, 1, 2], target: 0 },
          steps: [
            {
              stepNumber: 1,
              label: 'Step 1: Check Mid = index 3 (val 7)',
              description: 'Left half [4, 5, 6, 7] is sorted because nums[0] (4) <= nums[3] (7). But target 0 is NOT between 4 and 7! Target must be in right half. Set left = mid + 1 (4).',
              stateSnapshot: { left: 0, right: 6, mid: 3, sortedHalf: 'left', discard: 'left' },
              activePointers: { L: 0, M: 3, R: 6 },
              highlightIndices: [3],
            },
            {
              stepNumber: 2,
              label: 'Step 2: Check Mid = index 5 (val 1)',
              description: 'Search space is now [0, 1, 2] (indices 4 to 6). Mid = 5 (val 1). Right half [1, 2] is sorted. Target 0 is < nums[mid]. Set right = mid - 1 (4).',
              stateSnapshot: { left: 4, right: 6, mid: 5, sortedHalf: 'right', discard: 'right' },
              activePointers: { L: 4, M: 5, R: 6 },
              highlightIndices: [5],
            },
            {
              stepNumber: 3,
              label: 'Step 3: Found Target at index 4 (val 0)!',
              description: 'Left = 4, Right = 4, Mid = 4. nums[4] == 0 == target! Return index 4.',
              stateSnapshot: { left: 4, right: 4, mid: 4, found: true },
              activePointers: { L: 4, M: 4, R: 4 },
              highlightIndices: [4],
            },
          ],
        },
      ],
    },

    traps: [
      {
        title: 'Strict vs Non-Strict Inequalities in Boundaries',
        explanation: 'Writing `nums[left] < target < nums[mid]` instead of `nums[left] <= target < nums[mid]` fails when target equals nums[left].',
        mitigation: 'The outer boundary of the sorted half MUST be inclusive (`<=`).',
      },
      {
        title: 'Arrays with Duplicate Elements',
        explanation: 'If duplicates exist (e.g., [1, 0, 1, 1, 1]), then `nums[left] == nums[mid] == nums[right]`. You cannot tell which half is sorted!',
        mitigation: 'When all three are equal, you must cautiously decrement right and increment left by 1, degrading worst-case to O(N).',
      },
      {
        title: 'Integer Overflow in Other Languages',
        explanation: 'In C++/Java, `(left + right) / 2` can overflow 32-bit signed integer capacity.',
        mitigation: 'Always write `left + (right - left) // 2`.',
      },
    ],

    interviewVariants: [
      { name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', twist: 'Compare nums[mid] with nums[right]. If nums[mid] > nums[right], inflection point is to the right.' },
      { name: 'Search a 2D Matrix', difficulty: 'Medium', twist: 'Treat the M×N matrix as a virtual 1D array using divmod(mid, cols) to compute row and col in O(1).' },
      { name: 'Koko Eating Bananas (Binary Search on Answer)', difficulty: 'Medium', twist: 'The search space is not an array, but the possible eating speeds [1...max(piles)].' },
    ],
  },

  {
    id: 'grid-bfs-dfs',
    number: 6,
    title: 'Breadth-First & Depth-First Search (Connected Components / Flood Fill)',
    subtitle: 'Exhaustive graph and matrix exploration with visited state invariants',
    category: 'Graphs & Trees',
    difficulty: 'Intermediate',
    tags: ['BFS', 'DFS', 'Matrix', 'Queue', 'Connected Components'],
    relatedQuestionId: 'py-13-number-of-islands',
    relatedQuestionNumber: 13,
    relatedQuestionTitle: '#13 Number of Islands (Grid BFS / DFS)',
    visualizerId: 'bfs-grid',

    origin: {
      year: '1959',
      pioneer: 'Edward F. Moore & C. Y. Lee (Shortest Paths & Circuit Wiring)',
      context:
        'Edward Moore invented BFS at Bell Labs to calculate routing paths in telephone switching networks and find the shortest paths through printed circuit boards.',
    },
    whyCreated:
      'To discover all reachable vertices in an arbitrary graph or 2D grid, identify disjoint clusters (islands), and compute minimum steps/distances.',
    fundamentalBottleneck:
      'Without tracking visited nodes, traversing cycles or adjacent grid cells causes infinite loops and exponential re-visitations.',

    ahaAnalogy: {
      title: 'Water Droplet Ripple (BFS) vs Deep Cavern Spelunker (DFS)',
      story:
        'BFS expands like a pebble dropped in water: layer 1, then layer 2, then layer 3 in concentric expanding ripples (guaranteeing the shortest path in unweighted graphs). DFS behaves like a spelunker in an unknown cave: picking one tunnel and running as deep as possible until hitting a dead end before backtracking with a ball of string.',
      visualConcept: 'BFS uses a FIFO Queue; DFS uses a LIFO Stack or Call Recursion.',
      takeaway: 'Mark cells as visited AT THE TIME OF ENQUEUE to prevent duplicate queue flooding.',
    },

    intuition: {
      coreIdea:
        'To count connected components (islands): scan every cell (r, c). When a land cell "1" is encountered, increment the island counter, then trigger a BFS/DFS to sink all connected land ("1" -> "0") in all 4 cardinal directions. When the traversal finishes, the entire island is extinguished and will not be counted again.',
      whyNaiveFails:
        'Counting land cells alone ignores clustering. Without in-place modification or a visited set, neighboring cells recount the same island multiple times.',
      mathematicalInsight:
        'Disjoint set traversal over an implicit grid graph where vertices = R×C and edges <= 4×R×C. Total time = O(V + E) = O(R × C).',
    },

    blueprint: {
      triggerSignals: [
        'Given a 2D matrix representing a map, maze, or image pixels.',
        'Keywords: "Number of islands", "Rotting oranges", "Surrounded regions", "Shortest path in binary matrix".',
        'Finding connected clusters of identical adjacent elements.',
      ],
      steps: [
        '1. Check empty grid edge cases: if not grid: return 0.',
        '2. Get rows = len(grid), cols = len(grid[0]), islands = 0.',
        '3. Loop r from 0 to rows-1, c from 0 to cols-1.',
        '4. If grid[r][c] == "1": islands += 1, call bfs_sink(r, c) or dfs_sink(r, c).',
        '5. Inside sink: mark grid[r][c] = "0", explore 4 neighbors [(-1,0), (1,0), (0,-1), (0,1)].',
        '6. Return islands count.',
      ],
      codeTemplate: `from collections import deque

def num_islands(grid: list[list[str]]) -> int:
    """
    Breadth-First Search (BFS) Flood Fill: Sinks connected islands in-place.
    Time: O(R * C) | Space: O(min(R, C)) for queue width.
    """
    if not grid or not grid[0]:
        return 0
        
    rows, cols = len(grid), len(grid[0])
    island_count = 0
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    def bfs(start_r: int, start_c: int):
        queue = deque([(start_r, start_c)])
        grid[start_r][start_c] = '0'  # Mark visited IMMEDIATELY at enqueue
        
        while queue:
            r, c = queue.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                    grid[nr][nc] = '0'  # Sinking prevents duplicate queue inserts
                    queue.append((nr, nc))

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                island_count += 1
                bfs(r, c)
                
    return island_count`,
      complexity: {
        time: 'O(R × C) - Each cell is visited by the outer loop once and converted from "1" to "0" at most once.',
        space: 'O(min(R, C)) - For BFS, the queue holds at most the diagonal width of the grid.',
      },
    },

    visualizerConfig: {
      type: 'grid-bfs',
      presets: [
        {
          id: 'grid-islands-3',
          name: 'Classic 4x5 Archipelago (3 Islands)',
          description: 'Sinking land cells into water with a level-order FIFO queue.',
          inputData: {
            grid: [
              ['1', '1', '0', '0', '0'],
              ['1', '1', '0', '0', '0'],
              ['0', '0', '1', '0', '0'],
              ['0', '0', '0', '1', '1'],
            ],
          },
          steps: [
            {
              stepNumber: 1,
              label: 'Found Island #1 at (0, 0)',
              description: 'Land detected at (0,0). Increment islands = 1. Trigger BFS to sink island #1.',
              stateSnapshot: { currentIsland: 1, activeQueue: ['(0,0)'], sankCount: 1 },
            },
            {
              stepNumber: 2,
              label: 'Sink Island #1 Neighbors',
              description: 'Neighbors (0,1) and (1,0) and (1,1) added to queue and turned to "0".',
              stateSnapshot: { currentIsland: 1, activeQueue: [], sankCount: 4 },
            },
            {
              stepNumber: 3,
              label: 'Found Island #2 at (2, 2)',
              description: 'Isolated single-cell land at (2,2). Islands = 2. Sank cell (2,2).',
              stateSnapshot: { currentIsland: 2, activeQueue: [], sankCount: 5 },
            },
            {
              stepNumber: 4,
              label: 'Found Island #3 at (3, 3)',
              description: 'Land at (3,3) connected to (3,4). Islands = 3. Sank cells.',
              stateSnapshot: { currentIsland: 3, activeQueue: [], sankCount: 7 },
            },
          ],
        },
      ],
    },

    traps: [
      {
        title: 'Marking Visited on Dequeue instead of Enqueue',
        explanation: 'If you mark `grid[r][c] = "0"` when popping from the queue instead of when adding to the queue, the same neighbor will be added multiple times by adjacent cells, causing exponential memory explosion (TLE/MLE).',
        mitigation: 'ALWAYS mark cells as visited the exact millisecond they are appended to the queue.',
      },
      {
        title: 'Python Recursion Limit in DFS',
        explanation: 'A 1000×1000 grid of all "1"s requires 1,000,000 recursive DFS calls. Python default limit is 1000 frames.',
        mitigation: 'Use iterative BFS with `collections.deque` or increase `sys.setrecursionlimit`.',
      },
      {
        title: 'Diagonal Connections',
        explanation: 'Confirm whether the problem defines connectivity as 4-directional (cardinal) or 8-directional (including diagonals).',
        mitigation: 'Read constraints: standard LeetCode problems specify horizontal and vertical only.',
      },
    ],

    interviewVariants: [
      { name: 'Rotting Oranges', difficulty: 'Medium', twist: 'Multi-source BFS: initialize queue with ALL rotten oranges at t=0, tick minutes layer-by-layer.' },
      { name: 'Shortest Path in Binary Matrix', difficulty: 'Medium', twist: '8-directional BFS returning step count when destination (N-1, N-1) is reached.' },
      { name: 'Surrounded Regions (Capture O on Board)', difficulty: 'Medium', twist: 'Start DFS/BFS from the boundary edges inward, preserving safe "O" cells, then flip all remaining.' },
    ],
  },

  {
    id: 'dynamic-programming-knapsack',
    number: 7,
    title: 'Dynamic Programming (Optimal Substructure & Knapsack)',
    subtitle: 'Overcoming exponential decision tree explosions via memoized state caching',
    category: 'Optimization & DP',
    difficulty: 'Intermediate',
    tags: ['Dynamic Programming', 'Unbounded Knapsack', 'Memoization', 'Tabulation'],
    relatedQuestionId: 'py-14-coin-change',
    relatedQuestionNumber: 14,
    relatedQuestionTitle: '#14 Coin Change (Dynamic Programming)',

    origin: {
      year: '1953',
      pioneer: 'Richard Bellman (RAND Corporation)',
      context:
        'Bellman coined "Dynamic Programming" while working at RAND to disguise advanced mathematical optimization from Charles Wilson, the Secretary of Defense, who had a pathological hatred for math research.',
    },
    whyCreated:
      'To solve multistage decision processes where a greedy choice does not guarantee global optimality, without brute-forcing the 2^N or C^N search space.',
    fundamentalBottleneck:
      'Greedy algorithms fail on arbitrary denominations: with coins [1, 3, 4] and target 6, greedy picks 4 + 1 + 1 (3 coins), whereas the global optimum is 3 + 3 (2 coins).',

    ahaAnalogy: {
      title: 'Writing Down the Intermediate Math',
      story:
        'If I write "1 + 1 + 1 + 1 + 1 = 5" on a chalkboard and ask you what it equals, you count to 5. If I write "+ 1" on the end, you immediately say "6". You didn’t recount from 1 because you remembered the state was already 5. Dynamic Programming is simply remembering the answers to smaller subproblems.',
      visualConcept: 'A 1D table where dp[amount] represents the minimum coins needed for that exact sub-amount.',
      takeaway: 'Transition: `dp[i] = min(dp[i], dp[i - coin] + 1)` for every coin <= i.',
    },

    intuition: {
      coreIdea:
        'To find the fewest coins for amount A: suppose the last coin you chose was `c`. Then the problem reduces to finding the fewest coins for amount `A - c`, plus 1! Because we test all available coins, `dp[A] = 1 + min(dp[A - c])`. By building from amount 0 up to target A, every subproblem is solved before it is needed.',
      whyNaiveFails:
        'Recursive branching creates an exponential tree of O(C^(Amount/min_coin)) calls. Coin Change with amount 100 on small coins would take billions of years. Tabulation finishes in O(Amount × Coins) = a fraction of a millisecond.',
      mathematicalInsight:
        'Bellman’s Principle of Optimality: an optimal policy has the property that whatever the initial state and initial decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision.',
    },

    blueprint: {
      triggerSignals: [
        'Asked for "Minimum / Maximum" cost, steps, or ways to reach a target sum.',
        'Decisions at each step affect future options (overlapping subproblems).',
        'Greedy choice does not yield the optimal answer.',
      ],
      steps: [
        '1. Initialize table dp = [float("inf")] * (amount + 1).',
        '2. Base case: dp[0] = 0 (0 coins needed to make 0 amount).',
        '3. Iterate i from 1 to amount.',
        '4. For each coin in coins: if i - coin >= 0: dp[i] = min(dp[i], dp[i - coin] + 1).',
        '5. Return dp[amount] if dp[amount] != float("inf") else -1.',
      ],
      codeTemplate: `def coin_change(coins: list[int], amount: int) -> int:
    """
    Bottom-Up Tabulation (Unbounded Knapsack):
    Time: O(Amount * len(coins)) | Space: O(Amount)
    """
    # Initialize with amount + 1 (impossible sentinel value)
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0  # 0 coins to make amount 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
                
    return dp[amount] if dp[amount] <= amount else -1`,
      complexity: {
        time: 'O(Amount × N) - Nested loop over amount (1 to A) and coins list (N).',
        space: 'O(Amount) - 1D array of size amount + 1.',
      },
    },

    visualizerConfig: {
      type: 'dp-coins',
      presets: [
        {
          id: 'coins-1-2-5',
          name: 'Coins [1, 2, 5], Amount = 7',
          description: 'Step-by-step 1D table filling showing optimal subproblem transitions.',
          inputData: { coins: [1, 2, 5], amount: 7 },
          steps: [
            {
              stepNumber: 1,
              label: 'Base Case: dp[0] = 0',
              description: '0 amount requires 0 coins. Table: [0, ∞, ∞, ∞, ∞, ∞, ∞, ∞]',
              stateSnapshot: { currentAmount: 0, dpTable: [0, null, null, null, null, null, null, null] },
            },
            {
              stepNumber: 2,
              label: 'Amount 1',
              description: 'Coin 1: dp[1] = min(∞, dp[0] + 1) = 1 coin. Table: [0, 1, ∞, ∞, ∞, ∞, ∞, ∞]',
              stateSnapshot: { currentAmount: 1, dpTable: [0, 1, null, null, null, null, null, null] },
            },
            {
              stepNumber: 3,
              label: 'Amount 2',
              description: 'Coin 1 gives 1+1=2 coins; Coin 2 gives dp[0]+1 = 1 coin. Min is 1 coin.',
              stateSnapshot: { currentAmount: 2, dpTable: [0, 1, 1, null, null, null, null, null] },
            },
            {
              stepNumber: 4,
              label: 'Amount 5',
              description: 'Coin 5 gives dp[0] + 1 = 1 coin. dp[5] = 1.',
              stateSnapshot: { currentAmount: 5, dpTable: [0, 1, 1, 2, 2, 1, null, null] },
            },
            {
              stepNumber: 5,
              label: 'Amount 7 (Result: 2 coins)',
              description: 'Best choice is coin 5 + coin 2 -> dp[7 - 5] + 1 = dp[2] + 1 = 1 + 1 = 2 coins!',
              stateSnapshot: { currentAmount: 7, dpTable: [0, 1, 1, 2, 2, 1, 2, 2] },
            },
          ],
        },
      ],
    },

    traps: [
      {
        title: 'Greedy Thinking Trap',
        explanation: 'Assuming picking the largest coin first works. Example: coins [1, 6, 10], amount 12. Greedy picks 10 + 1 + 1 = 3 coins. DP finds 6 + 6 = 2 coins.',
        mitigation: 'Always use DP when coin denominations are arbitrary (non-canonical).',
      },
      {
        title: 'Unbounded vs 0/1 Knapsack Loop Order',
        explanation: 'In Coin Change, each coin can be used infinitely (Unbounded), so inner loop traverses forwards. In 0/1 Knapsack, inner loop must traverse backwards to avoid using the same item twice.',
        mitigation: 'Understand if items have infinite supply or single-use constraints.',
      },
      {
        title: 'Target Amount = 0 Edge Case',
        explanation: 'If amount == 0, the answer is 0 coins. Ensure base case `dp[0] = 0` is set.',
        mitigation: 'Always initialize `dp[0] = 0`.',
      },
    ],

    interviewVariants: [
      { name: 'Coin Change II (Number of Ways)', difficulty: 'Medium', twist: 'Loop over COINS first on outer loop, amount on inner loop, to compute combinations rather than permutations.' },
      { name: 'Partition Equal Subset Sum', difficulty: 'Medium', twist: 'Convert to 0/1 Knapsack: can we find a subset summing to total_sum // 2?' },
      { name: 'Word Break', difficulty: 'Medium', twist: 'dp[i] indicates whether s[:i] can be segmented using dictionary words.' },
    ],
  },

  {
    id: 'top-k-heaps',
    number: 8,
    title: 'Top-K Elements via Priority Queue (Bounded Min-Heap)',
    subtitle: 'Stream processing and top element selection in O(N log K) time with O(K) space',
    category: 'Optimization & DP',
    difficulty: 'Intermediate',
    tags: ['Heap', 'Priority Queue', 'heapq', 'Streaming', 'O(N log K)'],
    relatedQuestionId: 'py-15-kth-largest-element',
    relatedQuestionNumber: 15,
    relatedQuestionTitle: '#15 Kth Largest Element in an Array (Min-Heap)',

    origin: {
      year: '1964',
      pioneer: 'J. W. J. Williams (Heapsort & Binary Heap)',
      context:
        'Williams invented the complete binary tree array representation of a heap to achieve an in-place O(N log N) sorting algorithm with O(1) space.',
    },
    whyCreated:
      'To track the extreme K elements (largest or smallest) in massive datasets or unbounded data streams without paying the O(N log N) penalty of sorting the whole collection.',
    fundamentalBottleneck:
      'Sorting an entire array of 10,000,000 numbers takes O(N log N) = ~230 million operations. If we only need the top 5 largest items, sorting all 10 million is massively wasteful.',

    ahaAnalogy: {
      title: 'The VIP Club with a Strict Bouncer',
      story:
        'A prestigious club only has capacity for K VIPs. At the door stands the bouncer with the current list. The person at the top of the bouncer’s list is the POOREST person inside the club. When a newcomer arrives, if they are wealthier than the poorest person inside, the newcomer is admitted and the poorest person is immediately kicked out. At the end of the night, the poorest person inside the club is precisely the K-th richest person in town!',
      visualConcept: 'To find K LARGEST, use a MIN-heap of size K. The root is always the K-th largest candidate.',
      takeaway: 'Heap size never exceeds K. Each insertion is O(log K). Total: O(N log K).',
    },

    intuition: {
      coreIdea:
        'Maintain a min-heap with maximum capacity K. Stream numbers one by one: push onto heap. If heap size exceeds K, pop the smallest element (the root). After inspecting all N elements, the root of the min-heap is guaranteed to be the K-th largest element.',
      whyNaiveFails:
        'Full sort takes O(N log N) time and O(N) space. QuickSelect achieves O(N) average time but degrades to O(N²) worst-case on adversarial inputs. A bounded min-heap guarantees O(N log K) worst-case time with negligible O(K) memory.',
      mathematicalInsight:
        'A binary heap maintains the partial order property `parent <= children` in a complete binary tree packed into a contiguous array.',
    },

    blueprint: {
      triggerSignals: [
        'Asked for "Kth largest", "Kth smallest", "Top K frequent elements", or "K closest points".',
        'Data arrives as an online infinite stream where full sorting is impossible.',
        'K is significantly smaller than N (e.g. K=10, N=1,000,000).',
      ],
      steps: [
        '1. Initialize min_heap = [].',
        '2. For num in nums:',
        '3.   heapq.heappush(min_heap, num)',
        '4.   if len(min_heap) > k: heapq.heappop(min_heap)',
        '5. Return min_heap[0] (the root of the min-heap is the K-th largest).',
      ],
      codeTemplate: `import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    """
    Finds Kth largest element using a size-K Min-Heap.
    Time: O(N log K) | Space: O(K)
    """
    # Build initial min-heap of first k elements
    min_heap = nums[:k]
    heapq.heapify(min_heap)
    
    # Process remaining elements
    for num in nums[k:]:
        if num > min_heap[0]:
            heapq.heappushpop(min_heap, num)
            
    return min_heap[0]`,
      complexity: {
        time: 'O(N log K) - Heapify takes O(K), then (N - K) elements take O(log K) pushpop.',
        space: 'O(K) - Heap strictly bounded to size K.',
      },
    },

    visualizerConfig: {
      type: 'heap-topk',
      presets: [
        {
          id: 'heap-k2',
          name: 'K=2 Largest in [3, 2, 1, 5, 6, 4]',
          description: 'Watch the min-heap maintain the 2 largest elements: [5, 6].',
          inputData: { nums: [3, 2, 1, 5, 6, 4], k: 2 },
          steps: [
            {
              stepNumber: 1,
              label: 'Insert 3 and 2',
              description: 'Initial 2 elements. Min-heap: [2, 3]. Root is 2.',
              stateSnapshot: { heap: [2, 3], currentNum: 2, root: 2 },
            },
            {
              stepNumber: 2,
              label: 'Inspect 1',
              description: '1 is smaller than root 2. Discarded!',
              stateSnapshot: { heap: [2, 3], currentNum: 1, root: 2 },
            },
            {
              stepNumber: 3,
              label: 'Inspect 5',
              description: '5 > 2. Pop 2, push 5. Min-heap: [3, 5]. Root is 3.',
              stateSnapshot: { heap: [3, 5], currentNum: 5, root: 3 },
            },
            {
              stepNumber: 4,
              label: 'Inspect 6',
              description: '6 > 3. Pop 3, push 6. Min-heap: [5, 6]. Root is 5.',
              stateSnapshot: { heap: [5, 6], currentNum: 6, root: 5 },
            },
            {
              stepNumber: 5,
              label: 'Inspect 4 (Done)',
              description: '4 is smaller than root 5. Discarded. Result: min_heap[0] = 5.',
              stateSnapshot: { heap: [5, 6], currentNum: 4, root: 5 },
            },
          ],
        },
      ],
    },

    traps: [
      {
        title: 'Min-Heap vs Max-Heap Inversion Confusion',
        explanation: 'Candidates mistakenly use a Max-Heap for "K Largest" and a Min-Heap for "K Smallest". A Max-Heap keeps the largest elements at the top, so popping evicts the very elements you want to keep!',
        mitigation: 'Remember the rule: To find K LARGEST, use a MIN-heap. To find K SMALLEST, use a MAX-heap.',
      },
      {
        title: 'Python heapq is Min-Heap by Default',
        explanation: 'Python’s `heapq` module only implements a Min-Heap. If you need a Max-Heap, you must negate values: `(-val, item)`.',
        mitigation: 'Invert signs when simulating Max-Heap in Python.',
      },
      {
        title: 'O(N) Heapify vs O(N log K)',
        explanation: 'Calling `heapq.heapify(nums)` on the entire array is O(N), but popping K times takes O(K log N). When K is small, bounded heap O(N log K) is strictly superior.',
        mitigation: 'Use bounded size-K heap with `heappushpop` to avoid retaining N elements.',
      },
    ],

    interviewVariants: [
      { name: 'Top K Frequent Elements', difficulty: 'Medium', twist: 'Count frequencies with Counter, then insert (freq, num) tuples into a size-K min-heap.' },
      { name: 'Merge K Sorted Lists', difficulty: 'Hard', twist: 'Keep a min-heap of size K containing the current head node of each of the K sorted lists.' },
      { name: 'Find Median from Data Stream', difficulty: 'Hard', twist: 'Two Heaps pattern: balance a Max-Heap (lower half) and a Min-Heap (upper half).' },
    ],
  },

  {
    id: 'prefix-sums-hash',
    number: 9,
    title: 'Prefix Sums + Hash Map Lookup (Target Difference)',
    subtitle: 'O(1) continuous subarray sum queries and frequency matching in O(N) single pass',
    category: 'Prefix & Hashes',
    difficulty: 'Intermediate',
    tags: ['Prefix Sum', 'Hash Map', 'Subarrays', 'Difference Trick'],
    relatedQuestionId: 'py-16-subarray-sum-equals-k',
    relatedQuestionNumber: 16,
    relatedQuestionTitle: '#16 Subarray Sum Equals K (Prefix Sums)',

    origin: {
      year: '1984',
      pioneer: 'Frank Crow (Summed-Area Tables / Integral Images)',
      context:
        'Pioneered in computer graphics texture mapping and later popularized in computer vision by Viola-Jones object detection for instantaneous box-blur queries.',
    },
    whyCreated:
      'To calculate the sum of any contiguous range `nums[i...j]` in instant O(1) time without looping over the indices.',
    fundamentalBottleneck:
      'Checking all subarrays requires N(N+1)/2 ranges. Calculating each range sum takes O(N), yielding O(N³). Sliding window FAILS when numbers can be negative because the sum is non-monotonic.',

    ahaAnalogy: {
      title: 'The Car Odometer / Mountain Elevation Altitude Trick',
      story:
        'You start a road trip. At 1:00 PM your odometer reads 120 miles. At 4:00 PM your odometer reads 280 miles. How far did you drive between 1:00 and 4:00? You simply calculate 280 - 120 = 160 miles! You didn’t need to record the speedometer at every second. If current_altitude - past_altitude == K, then the climb in between was exactly K.',
      visualConcept: 'Subarray sum: `sum(nums[i...j]) = prefix[j] - prefix[i-1]`. Hence, `prefix[j] - k = prefix[i-1]`.',
      takeaway: 'Rearrange the equation: whenever `(running_sum - k)` exists in the hash map, a valid subarray ends here!',
    },

    intuition: {
      coreIdea:
        'Maintain a running cumulative sum. At each index, `running_sum` is the sum from 0 to current index. We want `running_sum - past_sum = k`, which means `past_sum = running_sum - k`. We store the frequency of all seen prefix sums in a hash map. At each step, add `prefix_counts[running_sum - k]` to total matches.',
      whyNaiveFails:
        'Two pointers / sliding window breaks when negative numbers exist (e.g. `[1, -1, 0]` with k=0). Expanding the right pointer might decrease the sum, destroying monotonicity. Prefix sums works universally regardless of negative numbers.',
      mathematicalInsight:
        'Reduces a 2D pair constraint `sum(i, j) = k` to a 1D hash table frequency lookup: `Count(j) = freq[prefix[j] - k]`.',
    },

    blueprint: {
      triggerSignals: [
        'Finding subarrays whose sum equals K, is divisible by K, or equals target.',
        'Array contains NEGATIVE numbers or zeros (rules out Sliding Window).',
        'Range sum queries asked repeatedly.',
      ],
      steps: [
        '1. Initialize prefix_counts = {0: 1} (Base case: empty prefix sum of 0 appears once).',
        '2. Initialize running_sum = 0, total_matches = 0.',
        '3. Loop num in nums:',
        '4.   running_sum += num',
        '5.   diff = running_sum - k',
        '6.   if diff in prefix_counts: total_matches += prefix_counts[diff]',
        '7.   prefix_counts[running_sum] = prefix_counts.get(running_sum, 0) + 1',
        '8. Return total_matches.',
      ],
      codeTemplate: `from collections import defaultdict

def subarray_sum(nums: list[int], k: int) -> int:
    """
    Subarray Sum Equals K via Prefix Sum Frequency Map.
    Time: O(N) | Space: O(N)
    Works with positive, negative, and zero values.
    """
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1  # Crucial: represents empty subarray prefix
    
    running_sum = 0
    match_count = 0
    
    for num in nums:
        running_sum += num
        # If (running_sum - k) was seen before, those past prefixes
        # terminate right before current index to form sum k
        diff = running_sum - k
        if diff in prefix_counts:
            match_count += prefix_counts[diff]
            
        prefix_counts[running_sum] += 1
        
    return match_count`,
      complexity: {
        time: 'O(N) - Single pass through the array with O(1) hash map operations.',
        space: 'O(N) - In worst case, every prefix sum is unique and stored in hash map.',
      },
    },

    visualizerConfig: {
      type: 'prefix-sums',
      presets: [
        {
          id: 'prefix-sum-1-1-1',
          name: 'Array [1, 1, 1], K = 2',
          description: 'Tracking prefix frequency counts and matching target delta (sum - 2).',
          inputData: { nums: [1, 1, 1], k: 2 },
          steps: [
            {
              stepNumber: 1,
              label: 'Base Map Setup',
              description: 'prefix_counts initialized with {0: 1}. Running sum = 0.',
              stateSnapshot: { runningSum: 0, map: { 0: 1 }, matches: 0 },
            },
            {
              stepNumber: 2,
              label: 'Index 0 (val 1)',
              description: 'Running sum = 1. Diff = 1 - 2 = -1 (not in map). Map: {0: 1, 1: 1}. Matches = 0.',
              stateSnapshot: { runningSum: 1, map: { 0: 1, 1: 1 }, matches: 0 },
            },
            {
              stepNumber: 3,
              label: 'Index 1 (val 1)',
              description: 'Running sum = 2. Diff = 2 - 2 = 0. 0 exists in map (count 1)! Matches = 1. Subarray [1, 1] found!',
              stateSnapshot: { runningSum: 2, map: { 0: 1, 1: 1, 2: 1 }, matches: 1 },
            },
            {
              stepNumber: 4,
              label: 'Index 2 (val 1)',
              description: 'Running sum = 3. Diff = 3 - 2 = 1. 1 exists in map (count 1)! Matches = 1 + 1 = 2. Subarray [1, 1] found!',
              stateSnapshot: { runningSum: 3, map: { 0: 1, 1: 1, 2: 1, 3: 1 }, matches: 2 },
            },
          ],
        },
      ],
    },

    traps: [
      {
        title: 'Forgetting prefix_counts = {0: 1}',
        explanation: 'If `running_sum == k`, then `running_sum - k = 0`. Without `{0: 1}`, any valid subarray starting from index 0 will NOT be counted!',
        mitigation: 'Always initialize the prefix map with `{0: 1}`.',
      },
      {
        title: 'Updating Map Before Checking Diff',
        explanation: 'If k == 0, adding `running_sum` to the map *before* checking `running_sum - k` will count the current empty element with itself.',
        mitigation: 'Check `running_sum - k` first, then insert `running_sum` into the map afterwards.',
      },
      {
        title: 'Attempting Sliding Window on Negative Numbers',
        explanation: 'Candidate tries to use left/right pointers. With negative numbers, expanding right can decrease sum, so window direction is undefined.',
        mitigation: 'If numbers can be negative, Prefix Sums is the only linear-time solution.',
      },
    ],

    interviewVariants: [
      { name: 'Continuous Subarray Sum (Multiple of K)', difficulty: 'Medium', twist: 'Store running_sum % k in map, storing FIRST SEEN INDEX to enforce subarray length >= 2.' },
      { name: 'Contiguous Array (Equal 0s and 1s)', difficulty: 'Medium', twist: 'Treat 0 as -1 and 1 as +1. Find the longest subarray with sum equal to 0.' },
      { name: 'Subarray Sums Divisible by K', difficulty: 'Medium', twist: 'Count occurrences of each modulo remainder. Any two prefixes with identical remainder form a divisible subarray.' },
    ],
  },

  {
    id: 'lru-cache-dll',
    number: 10,
    title: 'O(1) Cache Pattern (Doubly Linked List + Hash Map)',
    subtitle: 'Constant time lookup and constant time eviction with sentinel nodes',
    category: 'System Caching',
    difficulty: 'Advanced',
    tags: ['LRU Cache', 'Doubly Linked List', 'Hash Map', 'O(1) Time', 'Sentinels'],
    relatedQuestionId: 'py-02-lru-cache',
    relatedQuestionNumber: 2,
    relatedQuestionTitle: '#2 Design an LRU Cache',

    origin: {
      year: '1968',
      pioneer: 'Peter J. Denning (Working Set & Virtual Memory)',
      context:
        'Invented to optimize OS virtual memory page replacement policies when RAM was limited and disk swap was 10,000x slower.',
    },
    whyCreated:
      'To provide guaranteed O(1) reads, O(1) writes, and O(1) eviction of the least recently used item when capacity is reached.',
    fundamentalBottleneck:
      'A Hash Map provides O(1) lookup, but has no chronological order. An array maintains order, but removing an element from the middle takes O(N) shift time. Combining both solves both problems.',

    ahaAnalogy: {
      title: 'The Sticky-Note Board with a Rolodex',
      story:
        'Imagine a row of cards strung on a clothesline between two pegs (Head and Tail). Whenever you touch a card, you unclip it and move it directly to the front next to Head. When the line gets too crowded, you discard the card sitting at the very end next to Tail. To find any card instantly, you look up its exact peg address in your desktop Rolodex (Hash Map).',
      visualConcept: 'Hash Map stores key -> Node. Doubly Linked List maintains recency order with Dummy Head and Tail.',
      takeaway: 'Dummy sentinels completely eliminate boundary null checks during node removal and insertion.',
    },

    intuition: {
      coreIdea:
        'Node contains `key`, `val`, `prev`, `next`. Hash map maps `key -> Node`. A Doubly Linked List with `head` and `tail` sentinel nodes allows deleting ANY node in O(1) because the node has direct pointers to both its neighbor `node.prev` and `node.next`. Adding to front is also O(1).',
      whyNaiveFails:
        'Using an array or Python list for recency takes O(N) to remove an element when accessed. OrderedDict or collections.deque either hides the mechanics or lacks O(1) middle-removal.',
      mathematicalInsight:
        'Dual data-structure composition: space overhead is 2N pointers + hash table, yielding strict O(1) worst-case time for all operations.',
    },

    blueprint: {
      triggerSignals: [
        'Design a data structure with get(key) and put(key, val) in O(1) time.',
        'Evict least recently used, least frequently used, or oldest element on reaching capacity.',
        'High-performance cache implementation in backend systems.',
      ],
      steps: [
        '1. Define DListNode(key, val, prev, next).',
        '2. In LRUCache.__init__: initialize head and tail dummy sentinels, head.next = tail, tail.prev = head.',
        '3. Create map = {} (key -> DListNode).',
        '4. Helper _remove(node): node.prev.next = node.next, node.next.prev = node.prev.',
        '5. Helper _add_to_front(node): node.next = head.next, node.prev = head, head.next.prev = node, head.next = node.',
        '6. get(key): if key in map: node = map[key], _remove(node), _add_to_front(node), return node.val.',
        '7. put(key, val): if key exists: _remove old node. Create new node, _add_to_front, map[key] = node. If len > capacity: evict tail.prev.',
      ],
      codeTemplate: `class DListNode:
    def __init__(self, key: int = 0, val: int = 0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    """
    O(1) LRU Cache via Hash Map + Doubly Linked List.
    All operations execute in guaranteed O(1) time.
    """
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}  # key -> DListNode
        
        # Dummy sentinels
        self.head = DListNode()
        self.tail = DListNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: DListNode):
        """Unlink node from its current position in O(1)."""
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_front(self, node: DListNode):
        """Insert node right after head sentinel in O(1)."""
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._add_to_front(node)  # Mark as most recently used
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
            
        new_node = DListNode(key, value)
        self._add_to_front(new_node)
        self.cache[key] = new_node
        
        if len(self.cache) > self.capacity:
            # Evict least recently used (node before tail)
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`,
      complexity: {
        time: 'O(1) for both get() and put() - Guaranteed constant-time operations.',
        space: 'O(Capacity) - Stores at most capacity + 2 nodes and hash map entries.',
      },
    },

    visualizerConfig: {
      type: 'lru-cache',
      presets: [
        {
          id: 'lru-cap-2',
          name: 'Capacity = 2 (Put 1, Put 2, Get 1, Put 3)',
          description: 'Watch recency updates and LRU eviction of key 2.',
          inputData: { capacity: 2 },
          steps: [
            {
              stepNumber: 1,
              label: 'put(1, 10)',
              description: 'Insert (1, 10) at front. List: [Head] <-> [1] <-> [Tail]. Cache size: 1.',
              stateSnapshot: { list: ['1:10'], lruKey: '1', mruKey: '1' },
            },
            {
              stepNumber: 2,
              label: 'put(2, 20)',
              description: 'Insert (2, 20) at front. List: [Head] <-> [2] <-> [1] <-> [Tail]. LRU is 1.',
              stateSnapshot: { list: ['2:20', '1:10'], lruKey: '1', mruKey: '2' },
            },
            {
              stepNumber: 3,
              label: 'get(1) -> returns 10',
              description: 'Key 1 accessed! Unlink from back and move to front. List: [Head] <-> [1] <-> [2] <-> [Tail]. LRU is now 2!',
              stateSnapshot: { list: ['1:10', '2:20'], lruKey: '2', mruKey: '1' },
            },
            {
              stepNumber: 4,
              label: 'put(3, 30) -> Eviction!',
              description: 'Capacity exceeded! Evict LRU node before tail (key 2). Insert (3, 30) at front. List: [Head] <-> [3] <-> [1] <-> [Tail].',
              stateSnapshot: { list: ['3:30', '1:10'], lruKey: '1', mruKey: '3', evicted: '2' },
            },
          ],
        },
      ],
    },

    traps: [
      {
        title: 'Storing only Value in DListNode (Forgetting Key)',
        explanation: 'When evicting `tail.prev`, you must remove its entry from `self.cache`. If the node only stores `val`, you do not know which `key` to delete from the dictionary!',
        mitigation: 'Always store BOTH `key` and `val` in each `DListNode`.',
      },
      {
        title: 'Forgetting to update Recency on get()',
        explanation: 'A common bug is reading `node.val` on `get()` without moving the node to the front. The item becomes vulnerable to premature eviction.',
        mitigation: 'Always unlink and re-insert at the head whenever a node is touched.',
      },
      {
        title: 'Null Pointer Exceptions without Dummy Sentinels',
        explanation: 'Managing `self.head` and `self.tail` as raw nodes requires 6 conditional checks per insert/remove to handle empty lists.',
        mitigation: 'Dummy sentinels `head` and `tail` ensure that `node.prev` and `node.next` are NEVER None.',
      },
    ],

    interviewVariants: [
      { name: 'Design Hit Counter', difficulty: 'Medium', twist: 'Circular buffer with timestamps and counts over a 300-second window.' },
      { name: 'LFU Cache (Least Frequently Used)', difficulty: 'Hard', twist: 'Track frequency count per node and maintain a Doubly Linked List for each frequency with min_freq tracking.' },
      { name: 'All O(1) Data Structure', difficulty: 'Hard', twist: 'Doubly Linked List of frequency buckets where each bucket contains a set of strings with identical count.' },
    ],
  },
];
