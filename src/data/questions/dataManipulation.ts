import type { Question } from '../../types';


export const dataManipulationQuestions: Question[] = [
  {
    id: 'py-17-numpy-min-max-normalization',
    number: 17,
    title: 'Vectorized Min-Max Feature Scaling (NumPy)',
    slug: 'numpy-min-max-normalization',
    track: 'data-manipulation',
    difficulty: 'Easy',
    tags: ['NumPy', 'Broadcasting', 'Feature Scaling', 'Vectorization'],
    summary: 'Perform column-wise Min-Max normalization on a 2D NumPy array without Python loops.',
    description: `In ML data preprocessing, feature normalization scales columns into $[0, 1]$:
$$X_{\\text{norm}} = \\frac{X - X_{\\min}}{X_{\\max} - X_{\\min} + \\epsilon}$$

Given a 2D NumPy array \`X\` of shape \`(N, D)\` representing $N$ samples and $D$ features, write \`min_max_scale(X, eps=1e-8)\` that:
1. Normalizes each feature column independently into the range $[0, 1]$.
2. Computes the minimum and maximum along the sample axis (\`axis=0\`).
3. Uses NumPy broadcasting without any \`for\` or \`while\` loops.
4. Adds \`eps\` to the denominator to prevent division by zero for constant features.`,
    examples: [
      {
        input: 'X = np.array([[1.0, 10.0], [3.0, 20.0], [5.0, 30.0]])',
        output: 'array([[0.0, 0.0], [0.5, 0.5], [1.0, 1.0]])',
        explanation: 'Column 0 min=1 max=5, normalized to 0, 0.5, 1. Column 1 min=10 max=30 normalized to 0, 0.5, 1.'
      }
    ],
    constraints: [
      'X is a 2D numpy array with float or int dtype.',
      'No Python loops (for/while) allowed.',
      'Must return a float ndarray with identical shape.'
    ],
    starterCode: `import numpy as np

def min_max_scale(X: np.ndarray, eps: float = 1e-8) -> np.ndarray:
    """
    Normalizes 2D array X column-wise to [0, 1] using NumPy broadcasting.
    
    :param X: 2D numpy array of shape (N, D)
    :param eps: small epsilon to prevent zero division
    :return: scaled 2D array of shape (N, D)
    """
    # Write your vectorized solution here
    pass
`,
    solutionCode: `import numpy as np

def min_max_scale(X: np.ndarray, eps: float = 1e-8) -> np.ndarray:
    x_min = np.min(X, axis=0, keepdims=True)
    x_max = np.max(X, axis=0, keepdims=True)
    return (X - x_min) / (x_max - x_min + eps)
`,
    testHarness: `
import numpy as np

def _run_tests():
    # Test 1: standard 2D
    x1 = np.array([[1.0, 10.0], [3.0, 20.0], [5.0, 30.0]])
    res1 = min_max_scale(x1)
    exp1 = np.array([[0.0, 0.0], [0.5, 0.5], [1.0, 1.0]])
    p1 = np.allclose(res1, exp1, atol=1e-5)
    _test_items.append({
        "input": "X = [[1, 10], [3, 20], [5, 30]]",
        "expected": "[[0, 0], [0.5, 0.5], [1, 1]]",
        "actual": np.array2string(np.round(res1, 2), separator=', '),
        "passed": bool(p1)
    })

    # Test 2: Constant column (zero division check)
    x2 = np.array([[5.0, 2.0], [5.0, 4.0]])
    res2 = min_max_scale(x2)
    p2 = not np.isnan(res2).any() and not np.isinf(res2).any()
    _test_items.append({
        "input": "X with constant column (5.0, 5.0)",
        "expected": "No NaN or Inf values",
        "actual": "Valid numbers without crash",
        "passed": bool(p2)
    })

_run_tests()
`,
    explanation: {
      approach: 'Compute `x_min = np.min(X, axis=0, keepdims=True)` and `x_max = np.max(X, axis=0, keepdims=True)`. Using `keepdims=True` preserves shape `(1, D)`, allowing NumPy broadcasting across `(N, D)` seamlessly.',
      timeComplexity: 'O(N * D) vectorized in compiled C routines.',
      spaceComplexity: 'O(N * D) for the output array.',
      keyTakeaway: '`keepdims=True` in aggregation methods (`min`, `max`, `sum`, `mean`) is the safest practice to preserve dimension alignment for downstream broadcasting.'
    },
    hints: [
      'Use `np.min(X, axis=0, keepdims=True)`. Why `keepdims=True`? Because it keeps shape `(1, D)`.',
      'Do the same for `np.max`.',
      'The formula is `(X - x_min) / (x_max - x_min + eps)`.'
    ]
  },
  {
    id: 'py-18-numpy-one-hot-encoding',
    number: 18,
    title: 'One-Hot Encoding with NumPy Fancy Indexing',
    slug: 'numpy-one-hot-encoding',
    track: 'data-manipulation',
    difficulty: 'Easy',
    tags: ['NumPy', 'Fancy Indexing', 'Matrix Operations', 'Data Prep'],
    summary: 'Convert an array of class labels into a one-hot encoded matrix without loops or sklearn.',
    description: `Given a 1D NumPy array of categorical integer labels \`y\` of length $N$ where $y_i \\in \\{0, 1, \\dots, C-1\\}$ and total number of classes \`num_classes\` ($C$):

Implement \`one_hot_encode(y, num_classes)\` to return a 2D float or int NumPy array of shape \`(N, num_classes)\` where the $y_i$-th column of row $i$ is \`1\` and all other elements are \`0\`.

Must be written **without Python loops**.`,
    examples: [
      {
        input: 'y = np.array([0, 2, 1, 2]), num_classes = 3',
        output: 'array([[1, 0, 0], [0, 0, 1], [0, 1, 0], [0, 0, 1]])',
        explanation: 'Label 0 has 1 at col 0, label 2 has 1 at col 2, etc.'
      }
    ],
    constraints: [
      'y is a 1D array of integers 0 <= y[i] < num_classes.',
      'No for/while loops allowed.',
      'Output shape must be (len(y), num_classes).'
    ],
    starterCode: `import numpy as np

def one_hot_encode(y: np.ndarray, num_classes: int) -> np.ndarray:
    """
    Converts 1D label array y into (N, num_classes) one-hot matrix.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import numpy as np

def one_hot_encode(y: np.ndarray, num_classes: int) -> np.ndarray:
    # Method 1: Using np.eye
    return np.eye(num_classes, dtype=int)[y]
`,
    testHarness: `
import numpy as np

def _run_tests():
    y1 = np.array([0, 2, 1, 2])
    res1 = one_hot_encode(y1, 3)
    exp1 = np.array([[1, 0, 0], [0, 0, 1], [0, 1, 0], [0, 0, 1]])
    p1 = np.array_equal(res1, exp1)
    _test_items.append({
        "input": "y=[0, 2, 1, 2], num_classes=3",
        "expected": "4x3 one-hot matrix",
        "actual": np.array2string(res1, separator=', '),
        "passed": bool(p1)
    })

    y2 = np.array([4])
    res2 = one_hot_encode(y2, 5)
    exp2 = np.array([[0, 0, 0, 0, 1]])
    p2 = np.array_equal(res2, exp2)
    _test_items.append({
        "input": "y=[4], num_classes=5",
        "expected": "[[0, 0, 0, 0, 1]]",
        "actual": np.array2string(res2, separator=', '),
        "passed": bool(p2)
    })

_run_tests()
`,
    explanation: {
      approach: 'NumPy’s identity matrix `np.eye(num_classes)` has row $k$ with a 1 at index $k$. By indexing into `np.eye(num_classes)[y]`, NumPy uses fancy indexing to retrieve rows corresponding to each label in `y` in a single line!',
      timeComplexity: 'O(N * C) vectorized memory copy.',
      spaceComplexity: 'O(N * C) output matrix.',
      keyTakeaway: '`np.eye(C)[y]` is the fastest, cleanest one-liner for one-hot encoding in NumPy.'
    },
    hints: [
      'Think about what `np.eye(num_classes)` produces: an identity matrix where each row is a one-hot vector.',
      'Index into `np.eye(num_classes)` with `y`!',
      'Alternatively, initialize zeros with shape `(len(y), num_classes)` and use `out[np.arange(len(y)), y] = 1`.'
    ]
  },
  {
    id: 'py-19-batch-cosine-similarity',
    number: 19,
    title: 'Batch Cosine Similarity & Top-K Retrieval (NumPy)',
    slug: 'batch-cosine-similarity-numpy',
    track: 'data-manipulation',
    difficulty: 'Medium',
    tags: ['NumPy', 'Vector Search', 'Embeddings', 'Linear Algebra'],
    summary: 'Compute cosine similarity between a query vector and a corpus matrix and return top-K nearest matches.',
    description: `Vector search and RAG (Retrieval-Augmented Generation) pipelines rely on computing similarity between a query embedding and thousands of document embeddings.

The cosine similarity between query vector $q \\in \\mathbb{R}^D$ and document vector $x \\in \\mathbb{R}^D$ is:
$$\\text{sim}(q, x) = \\frac{q \\cdot x}{\\|q\\|_2 \\|x\\|_2 + \\epsilon}$$

Given a query vector \`q\` of shape \`(D,)\`, a 2D matrix \`corpus\` of shape \`(N, D)\`, and integer \`k\`:
Implement \`top_k_cosine_similarity(q, corpus, k)\` to return:
1. \`top_indices\`: 1D array of indices corresponding to the $k$ highest cosine similarity rows in descending order.
2. \`top_scores\`: 1D array of the corresponding $k$ similarity scores.
3. Must be vectorized without iterating row-by-row in Python.`,
    examples: [
      {
        input: 'q = [1.0, 0.0], corpus = [[1.0, 0.0], [0.0, 1.0], [0.8, 0.6]], k = 2',
        output: 'indices = [0, 2], scores = [1.0, 0.8]',
        explanation: 'q is identical to row 0 (sim 1.0), and closest to row 2 (sim 0.8).'
      }
    ],
    constraints: [
      '1 <= k <= N',
      'All vectors have dimension D.',
      'Use eps=1e-8 to guard against zero-norm division.'
    ],
    starterCode: `import numpy as np
from typing import Tuple

def top_k_cosine_similarity(q: np.ndarray, corpus: np.ndarray, k: int, eps: float = 1e-8) -> Tuple[np.ndarray, np.ndarray]:
    """
    Computes cosine similarity between query q and all rows in corpus,
    returning (top_indices, top_scores) sorted descending.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import numpy as np
from typing import Tuple

def top_k_cosine_similarity(q: np.ndarray, corpus: np.ndarray, k: int, eps: float = 1e-8) -> Tuple[np.ndarray, np.ndarray]:
    # 1. Normalize query
    q_norm = np.linalg.norm(q) + eps
    q_unit = q / q_norm
    
    # 2. Normalize corpus rows along axis=1
    corpus_norms = np.linalg.norm(corpus, axis=1, keepdims=True) + eps
    corpus_unit = corpus / corpus_norms
    
    # 3. Vectorized matrix-vector multiplication (dot products)
    sims = np.dot(corpus_unit, q_unit)
    
    # 4. Top-k sorting descending
    top_indices = np.argsort(sims)[::-1][:k]
    top_scores = sims[top_indices]
    
    return top_indices, top_scores
`,
    testHarness: `
import numpy as np

def _run_tests():
    q = np.array([1.0, 0.0])
    corpus = np.array([
        [1.0, 0.0],
        [0.0, 1.0],
        [0.8, 0.6],
        [-1.0, 0.0]
    ])
    indices, scores = top_k_cosine_similarity(q, corpus, 2)
    p1 = list(indices) == [0, 2] and np.allclose(scores, [1.0, 0.8], atol=1e-4)
    _test_items.append({
        "input": "q=[1, 0], 4 vectors, k=2",
        "expected": "indices=[0, 2], scores=[1.0, 0.8]",
        "actual": f"indices={list(indices)}, scores={list(np.round(scores, 2))}",
        "passed": bool(p1)
    })

    # Test identical vectors
    q2 = np.array([0.5, 0.5])
    corpus2 = np.array([[0.5, 0.5], [1.0, 1.0]])
    idx2, sc2 = top_k_cosine_similarity(q2, corpus2, 1)
    p2 = np.isclose(sc2[0], 1.0, atol=1e-4)
    _test_items.append({
        "input": "Collinear vectors similarity check",
        "expected": "Score close to 1.0",
        "actual": f"Score: {sc2[0]:.4f}",
        "passed": bool(p2)
    })

_run_tests()
`,
    explanation: {
      approach: 'Normalize both the query vector and the corpus matrix rows to unit length ($L_2$ norm = 1). Then, the batch cosine similarities simplify to a single matrix-vector dot product: `sims = np.dot(corpus_unit, q_unit)`. Use `np.argsort(sims)[::-1][:k]` to extract top indices.',
      timeComplexity: 'O(N * D + N log K) time.',
      spaceComplexity: 'O(N) for similarity scores.',
      keyTakeaway: 'Pre-normalizing embeddings turns cosine similarity into dot product, which leverages optimized BLAS/LAPACK GEMV routines.'
    },
    hints: [
      'Normalize the query vector: `q / (np.linalg.norm(q) + eps)`.',
      'Normalize the corpus rows: `corpus / (np.linalg.norm(corpus, axis=1, keepdims=True) + eps)`.',
      'Compute all similarities at once with `np.dot(corpus_norm, q_norm)`.',
      'Use `np.argsort(sims)[::-1][:k]` to extract the highest elements in descending order.'
    ]
  },
  {
    id: 'py-20-pandas-groupby-summary',
    number: 20,
    title: 'Pandas GroupBy & Month-over-Month Growth',
    slug: 'pandas-groupby-growth',
    track: 'data-manipulation',
    difficulty: 'Medium',
    tags: ['Pandas', 'GroupBy', 'Aggregation', 'Window Functions'],
    summary: 'Aggregate sales transactions by category and month, calculating total revenue and month-over-month growth.',
    description: `Given a Pandas DataFrame \`df\` containing sales logs with columns:
- \`'date'\`: string formatted as \`'YYYY-MM-DD'\`
- \`'category'\`: string (e.g. \`'Electronics'\`, \`'Clothing'\`)
- \`'revenue'\`: float (dollar amount)

Write a function \`category_monthly_summary(df: pd.DataFrame) -> pd.DataFrame\` that:
1. Extracts the month string as \`'YYYY-MM'\` into a new column \`'month'\`.
2. Groups by \`['category', 'month']\` and sums \`'revenue'\`.
3. Computes the month-over-month percentage change in revenue **within each category** as a new column \`'mom_growth'\` (using \`.pct_change()\` or shift). The first month for any category should have \`NaN\`.
4. Returns the resulting DataFrame sorted by \`['category', 'month']\`.`,
    examples: [
      {
        input: 'df with Electronics in 2024-01 ($100) and 2024-02 ($150)',
        output: 'mom_growth for 2024-02 is 0.5 (50% increase)',
        explanation: '(150 - 100) / 100 = 0.5.'
      }
    ],
    constraints: [
      'Must handle multiple categories independently.',
      'First month of each category must be NaN for mom_growth.'
    ],
    starterCode: `import pandas as pd

def category_monthly_summary(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes monthly total revenue and MoM growth per category.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import pandas as pd

def category_monthly_summary(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    # Extract YYYY-MM
    df['month'] = pd.to_datetime(df['date']).dt.strftime('%Y-%m')
    
    # Group by category and month
    summary = df.groupby(['category', 'month'], as_index=False)['revenue'].sum()
    summary = summary.sort_values(by=['category', 'month']).reset_index(drop=True)
    
    # Calculate MoM growth within each category
    summary['mom_growth'] = summary.groupby('category')['revenue'].pct_change()
    
    return summary
`,
    testHarness: `
import pandas as pd
import numpy as np

def _run_tests():
    data = {
        'date': ['2024-01-10', '2024-01-15', '2024-02-05', '2024-03-01', '2024-01-20', '2024-02-18'],
        'category': ['Tech', 'Tech', 'Tech', 'Tech', 'Books', 'Books'],
        'revenue': [100.0, 50.0, 300.0, 150.0, 20.0, 40.0]
    }
    df = pd.DataFrame(data)
    result = category_monthly_summary(df)

    # Tech 2024-01 is 150, 2024-02 is 300 (growth: +1.0), 2024-03 is 150 (growth: -0.5)
    # Books 2024-01 is 20, 2024-02 is 40 (growth: +1.0)
    tech_feb_growth = result[(result['category'] == 'Tech') & (result['month'] == '2024-02')]['mom_growth'].values[0]
    books_feb_growth = result[(result['category'] == 'Books') & (result['month'] == '2024-02')]['mom_growth'].values[0]

    p1 = np.isclose(tech_feb_growth, 1.0) and np.isclose(books_feb_growth, 1.0)
    _test_items.append({
        "input": "Sales DataFrame with Tech and Books across months",
        "expected": "Tech Feb growth=1.0, Books Feb growth=1.0",
        "actual": f"Tech Feb={tech_feb_growth:.2f}, Books Feb={books_feb_growth:.2f}",
        "passed": bool(p1)
    })

_run_tests()
`,
    explanation: {
      approach: 'Convert `df[\'date\']` to datetime and extract `dt.strftime(\'%Y-%m\')`. Group by `[\'category\', \'month\']` and sum revenue. Finally, call `.groupby(\'category\')[\'revenue\'].pct_change()` so the percentage change is scoped within each category.',
      timeComplexity: 'O(N log N) for grouping and sorting.',
      spaceComplexity: 'O(N) for output DataFrame.',
      keyTakeaway: 'Always group again before calling `.pct_change()` or `.shift()` on multi-entity time-series data to avoid bleeding values across different categories.'
    },
    hints: [
      'Use `pd.to_datetime(df[\'date\']).dt.strftime(\'%Y-%m\')` to create the month string.',
      'Group by `[\'category\', \'month\']` and sum the revenue.',
      'Group by `\'category\'` and apply `.pct_change()` on the revenue column.'
    ]
  },
  {
    id: 'py-21-pandas-missing-imputation',
    number: 21,
    title: 'Missing Data Imputation by Group & Outlier Clipping',
    slug: 'pandas-missing-imputation',
    track: 'data-manipulation',
    difficulty: 'Medium',
    tags: ['Pandas', 'Imputation', 'Feature Engineering', 'Cleaning'],
    summary: 'Fill missing numeric values with the group median and clip outliers beyond 3 IQR.',
    description: `Real-world tabular data has missing values and extreme outliers that skew models.

Given a DataFrame \`df\` with columns \`'department'\` (string) and \`'salary'\` (float, contains \`NaN\`s):
Write \`clean_salaries(df: pd.DataFrame) -> pd.DataFrame\` that:
1. Imputes missing \`'salary'\` values using the **median salary of the respective department** (using \`transform('median')\`).
2. Calculates the 25th percentile ($Q_1$) and 75th percentile ($Q_3$) of salaries across the whole dataset (after imputation), and computes $\\text{IQR} = Q_3 - Q_1$.
3. Clips all salaries to the boundary $[Q_1 - 1.5 \\times \\text{IQR}, Q_3 + 1.5 \\times \\text{IQR}]$.
4. Returns the modified copy of \`df\`.`,
    examples: [
      {
        input: 'df with Eng ($100k, NaN, $120k) and HR ($50k, NaN)',
        output: 'Eng NaN replaced by $110k (Eng median), HR NaN replaced by $50k',
        explanation: 'Each missing value is imputed using its departmental cohort median.'
      }
    ],
    constraints: [
      'Do not modify the input DataFrame in-place.',
      'Salaries are strictly non-negative.'
    ],
    starterCode: `import pandas as pd

def clean_salaries(df: pd.DataFrame) -> pd.DataFrame:
    """
    Imputes missing salaries by department median and clips IQR outliers.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import pandas as pd

def clean_salaries(df: pd.DataFrame) -> pd.DataFrame:
    res = df.copy()
    # 1. Impute by department median
    dept_medians = res.groupby('department')['salary'].transform('median')
    res['salary'] = res['salary'].fillna(dept_medians)
    
    # 2. Compute IQR boundaries
    q1 = res['salary'].quantile(0.25)
    q3 = res['salary'].quantile(0.75)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    
    # 3. Clip
    res['salary'] = res['salary'].clip(lower=lower, upper=upper)
    return res
`,
    testHarness: `
import pandas as pd
import numpy as np

def _run_tests():
    data = {
        'department': ['Eng', 'Eng', 'Eng', 'HR', 'HR', 'Eng'],
        'salary': [100.0, np.nan, 120.0, 50.0, np.nan, 1000.0]  # 1000 is an outlier
    }
    df = pd.DataFrame(data)
    cleaned = clean_salaries(df)

    p1 = not cleaned['salary'].isna().any()
    # Eng median without outlier is 110 or 120 depending on group
    eng_imputed = cleaned.loc[1, 'salary']
    p2 = np.isclose(eng_imputed, 120.0) or np.isclose(eng_imputed, 110.0)
    # The extreme value 1000 should be clipped
    p3 = cleaned.loc[5, 'salary'] < 1000.0

    passed = p1 and p3
    _test_items.append({
        "input": "Salaries with NaNs and extreme outlier 1000",
        "expected": "No NaNs and outlier clipped",
        "actual": f"NaNs count={cleaned['salary'].isna().sum()}, max_salary={cleaned['salary'].max():.2f}",
        "passed": bool(passed)
    })

_run_tests()
`,
    explanation: {
      approach: '`df.groupby(\'department\')[\'salary\'].transform(\'median\')` broadcasts group medians back to the original index. Then `.fillna()` replaces missing entries. Next, `.quantile(0.25)` and `.quantile(0.75)` compute IQR, and `.clip(lower, upper)` truncates values.',
      timeComplexity: 'O(N) linear time.',
      spaceComplexity: 'O(N) for output copy.',
      keyTakeaway: '`transform()` in Pandas aligns aggregated results back to the original row shape, making it the premier method for group-level imputations and normalizations.'
    },
    hints: [
      'Use `res.groupby(\'department\')[\'salary\'].transform(\'median\')`.',
      'Fill NaNs using `res[\'salary\'].fillna(dept_medians)`.',
      'Compute `q1` and `q3` with `.quantile()`, then use `.clip(lower, upper)`.'
    ]
  },
  {
    id: 'py-22-pandas-top-k-per-group',
    number: 22,
    title: 'Top-K Highest Earners per Department',
    slug: 'pandas-top-k-per-department',
    track: 'data-manipulation',
    difficulty: 'Medium',
    tags: ['Pandas', 'Window Functions', 'Ranking', 'SQL Parity'],
    summary: 'Find the top N highest earners in each department using Pandas ranking or groupby.',
    description: `This question frequently appears in data analyst and data science interviews (the Pandas equivalent of SQL \`DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC)\`).

Given a DataFrame \`df\` with columns \`['employee_id', 'department', 'salary']\`:
Write \`top_n_earners(df: pd.DataFrame, n: int = 2) -> pd.DataFrame\` that:
1. Returns the employees who have the top \`n\` highest salaries within each department.
2. Ties in salary should receive the same rank (dense ranking: \`method='dense'\`).
3. The returned DataFrame should be sorted by \`['department', 'salary']\` (with department ascending and salary descending).`,
    examples: [
      {
        input: 'Eng has salaries [150k, 120k, 110k, 120k]. n=2',
        output: 'Eng returns 150k (rank 1) and both 120k employees (rank 2)',
        explanation: 'Dense rank means tied salaries both qualify for rank 2.'
      }
    ],
    constraints: [
      'n >= 1',
      'Tied salaries should both be included using dense rank.'
    ],
    starterCode: `import pandas as pd

def top_n_earners(df: pd.DataFrame, n: int = 2) -> pd.DataFrame:
    """
    Finds top n earners per department using dense ranking.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import pandas as pd

def top_n_earners(df: pd.DataFrame, n: int = 2) -> pd.DataFrame:
    df = df.copy()
    ranks = df.groupby('department')['salary'].rank(method='dense', ascending=False)
    filtered = df[ranks <= n]
    return filtered.sort_values(by=['department', 'salary'], ascending=[True, False]).reset_index(drop=True)
`,
    testHarness: `
import pandas as pd

def _run_tests():
    data = {
        'employee_id': [1, 2, 3, 4, 5, 6],
        'department': ['Eng', 'Eng', 'Eng', 'Eng', 'Sales', 'Sales'],
        'salary': [150000, 120000, 120000, 90000, 80000, 70000]
    }
    df = pd.DataFrame(data)
    res = top_n_earners(df, n=2)
    # Eng should have employee 1 (150k), 2 and 3 (120k)
    # Sales should have employee 5 (80k), 6 (70k)
    eng_emp_ids = set(res[res['department'] == 'Eng']['employee_id'])
    p1 = eng_emp_ids == {1, 2, 3}
    _test_items.append({
        "input": "Eng salaries [150k, 120k, 120k, 90k], n=2",
        "expected": "Employees 1, 2, 3 included for Eng",
        "actual": f"Included Eng IDs: {eng_emp_ids}",
        "passed": bool(p1)
    })

_run_tests()
`,
    explanation: {
      approach: 'Use `df.groupby(\'department\')[\'salary\'].rank(method=\'dense\', ascending=False)`. Filter rows where `rank <= n`, and sort by `[\'department\', \'salary\']` with `ascending=[True, False]`.',
      timeComplexity: 'O(N log N) dominated by sorting.',
      spaceComplexity: 'O(N) memory for the output.',
      keyTakeaway: 'The `method` argument in `.rank()` is critical: `dense` matches SQL DENSE_RANK, `min` matches RANK, and `first` matches ROW_NUMBER.'
    },
    hints: [
      'Check the documentation for `Series.rank()`: what does `method=\'dense\'` do?',
      'Compute ranks grouped by department: `df.groupby(\'department\')[\'salary\'].rank(...)`.',
      'Filter for `rank <= n`.'
    ]
  },
  {
    id: 'py-23-pandas-rolling-bollinger-bands',
    number: 23,
    title: 'Rolling Moving Average & Bollinger Bands',
    slug: 'pandas-rolling-bollinger-bands',
    track: 'data-manipulation',
    difficulty: 'Medium',
    tags: ['Pandas', 'Rolling Windows', 'Time Series', 'Finance Analytics'],
    summary: 'Compute a 7-period rolling mean and +/- 2 standard deviation Bollinger Bands on a price series.',
    description: `Bollinger Bands are a technical analysis indicator consisting of:
- **Middle Band**: $N$-period rolling simple moving average (SMA).
- **Upper Band**: Middle Band $+ (k \\times N\\text{-period rolling standard deviation})$.
- **Lower Band**: Middle Band $- (k \\times N\\text{-period rolling standard deviation})$.

Given a DataFrame \`df\` with a column \`'price'\` (floats):
Write \`bollinger_bands(df: pd.DataFrame, window: int = 5, k: float = 2.0) -> pd.DataFrame\` that:
1. Adds column \`'sma'\`: the rolling mean of \`'price'\` over \`window\` periods.
2. Adds column \`'upper_band'\`: \`sma + k * rolling_std\`.
3. Adds column \`'lower_band'\`: \`sma - k * rolling_std\`.
4. Leaves the initial periods where fewer than \`window\` observations exist as \`NaN\`.
5. Returns a copy of \`df\` with these three new columns.`,
    examples: [
      {
        input: 'df with prices [10, 11, 12, 11, 12, 13], window=3, k=2',
        output: 'At index 2 (window=3): sma=11.0, std=1.0, upper=13.0, lower=9.0',
        explanation: 'Prices [10, 11, 12] has mean 11 and std 1.0.'
      }
    ],
    constraints: [
      'window >= 2',
      'k > 0',
      'Do not modify input df in-place.'
    ],
    starterCode: `import pandas as pd

def bollinger_bands(df: pd.DataFrame, window: int = 5, k: float = 2.0) -> pd.DataFrame:
    """
    Calculates rolling SMA, upper band, and lower band.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import pandas as pd

def bollinger_bands(df: pd.DataFrame, window: int = 5, k: float = 2.0) -> pd.DataFrame:
    res = df.copy()
    rolling = res['price'].rolling(window=window)
    res['sma'] = rolling.mean()
    rolling_std = rolling.std()
    res['upper_band'] = res['sma'] + (k * rolling_std)
    res['lower_band'] = res['sma'] - (k * rolling_std)
    return res
`,
    testHarness: `
import pandas as pd
import numpy as np

def _run_tests():
    prices = [10.0, 12.0, 14.0, 16.0, 18.0]
    df = pd.DataFrame({'price': prices})
    res = bollinger_bands(df, window=3, k=2.0)

    # At row index 2 (prices 10, 12, 14), mean is 12, sample std is 2.0
    # upper = 12 + 2*2 = 16, lower = 12 - 4 = 8
    sma2 = res.loc[2, 'sma']
    up2 = res.loc[2, 'upper_band']
    low2 = res.loc[2, 'lower_band']

    p1 = np.isclose(sma2, 12.0) and np.isclose(up2, 16.0) and np.isclose(low2, 8.0)
    _test_items.append({
        "input": "prices=[10, 12, 14, 16, 18], window=3, k=2",
        "expected": "row 2: sma=12.0, upper=16.0, lower=8.0",
        "actual": f"sma={sma2:.1f}, up={up2:.1f}, low={low2:.1f}",
        "passed": bool(p1)
    })

    # Rows 0 and 1 must be NaN for window=3
    p2 = pd.isna(res.loc[0, 'sma']) and pd.isna(res.loc[1, 'sma'])
    _test_items.append({
        "input": "Check incomplete window rows (0, 1)",
        "expected": "NaN for initial rows < window",
        "actual": f"row 0 isna={pd.isna(res.loc[0, 'sma'])}",
        "passed": bool(p2)
    })

_run_tests()
`,
    explanation: {
      approach: 'Create a rolling window object: `rolling = res[\'price\'].rolling(window=window)`. Calculate `sma = rolling.mean()` and `rolling_std = rolling.std()`. Then construct the upper and lower bands.',
      timeComplexity: 'O(N) single pass sliding window.',
      spaceComplexity: 'O(N) memory for columns.',
      keyTakeaway: 'In Pandas, `.rolling(window=w)` uses unbiased sample standard deviation ($N-1$ degrees of freedom) by default, matching statistical finance standards.'
    },
    hints: [
      'Call `res[\'price\'].rolling(window=window)`.',
      'Extract `.mean()` and `.std()` from that rolling object.',
      'Multiply standard deviation by `k` and add/subtract from the mean.'
    ]
  },

  {
    id: 'py-42-numpy-2d-convolution-strides',
    number: 42,
    title: 'Vectorized 2D Convolution via NumPy Stride Tricks (as_strided)',
    slug: 'numpy-2d-convolution-stride-tricks',
    track: 'data-manipulation',
    difficulty: 'Hard',
    tags: ['NumPy', 'Stride Tricks', 'Vectorization', 'Image Processing', 'CNN'],
    summary: 'Implement sliding-window 2D spatial convolution without Python loops using NumPy stride tricks.',
    description: `Writing spatial convolutions with nested Python loops is notoriously slow. In computer vision and deep learning frameworks, 2D convolution and pooling operations create virtual sliding-window views using memory strides.

Given a 2D float image \`image\` of shape \`(H, W)\` and a 2D filter kernel \`kernel\` of shape \`(kH, kW)\`:
Implement \`conv2d_strided(image, kernel, stride=1)\` to compute the 2D valid convolution without allocating duplicate memory buffers for each sliding window.

### Requirements:
1. Use \`np.lib.stride_tricks.as_strided\` to create a 4D view of shape \`(out_H, out_W, kH, kW)\`.
2. Compute the element-wise sum of products using \`np.einsum('ijkl,kl->ij', ...)\` or tensor contractions.
3. Support arbitrary positive \`stride\`.
4. Output must be a 2D NumPy array of shape \`((H - kH) // stride + 1, (W - kW) // stride + 1)\`.`,
    examples: [
      {
        input: 'image = 4x4 matrix, kernel = 2x2 matrix, stride = 1',
        output: '3x3 convolved output matrix',
        explanation: 'Each 2x2 spatial patch is multiplied element-wise by kernel and summed.'
      }
    ],
    constraints: [
      'image.ndim == 2, kernel.ndim == 2',
      'H >= kH >= 1, W >= kW >= 1',
      'stride >= 1',
      'No Python for-loops over pixels allowed.'
    ],
    starterCode: `import numpy as np

def conv2d_strided(image: np.ndarray, kernel: np.ndarray, stride: int = 1) -> np.ndarray:
    """
    Computes 2D spatial convolution using NumPy stride tricks and einsum.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import numpy as np

def conv2d_strided(image: np.ndarray, kernel: np.ndarray, stride: int = 1) -> np.ndarray:
    H, W = image.shape
    kH, kW = kernel.shape
    out_H = (H - kH) // stride + 1
    out_W = (W - kW) // stride + 1
    
    # 4D view: (out_H, out_W, kH, kW)
    shape = (out_H, out_W, kH, kW)
    strides = (
        image.strides[0] * stride,
        image.strides[1] * stride,
        image.strides[0],
        image.strides[1]
    )
    
    windows = np.lib.stride_tricks.as_strided(image, shape=shape, strides=strides)
    return np.einsum('ijkl,kl->ij', windows, kernel)
`,
    testHarness: `
import numpy as np

def _run_tests():
    # Test 1: 4x4 image with 2x2 kernel
    img = np.array([
        [1.0, 2.0, 3.0, 0.0],
        [0.0, 1.0, 2.0, 3.0],
        [3.0, 0.0, 1.0, 2.0],
        [2.0, 3.0, 0.0, 1.0]
    ], dtype=float)
    ker = np.array([
        [2.0, 0.0],
        [0.0, 2.0]
    ], dtype=float)
    
    out1 = conv2d_strided(img, ker, stride=1)
    exp1 = np.array([
        [4.0, 8.0, 12.0],
        [0.0, 4.0, 8.0],
        [12.0, 0.0, 4.0]
    ], dtype=float)
    p1 = np.allclose(out1, exp1)
    _test_items.append({
        "input": "4x4 image * 2x2 diagonal kernel (stride=1)",
        "expected": str(exp1.tolist()),
        "actual": str(out1.tolist()),
        "passed": bool(p1)
    })

    # Test 2: Stride 2 downsampling
    out2 = conv2d_strided(img, ker, stride=2)
    exp2 = np.array([
        [4.0, 12.0],
        [12.0, 4.0]
    ], dtype=float)
    p2 = np.allclose(out2, exp2)
    _test_items.append({
        "input": "4x4 image * 2x2 diagonal kernel (stride=2)",
        "expected": str(exp2.tolist()),
        "actual": str(out2.tolist()),
        "passed": bool(p2)
    })

    # Test 3: Kernel equal to image size (output 1x1)
    out3 = conv2d_strided(ker, ker, stride=1)
    exp3 = np.array([[8.0]])
    p3 = np.allclose(out3, exp3)
    _test_items.append({
        "input": "2x2 image * 2x2 kernel (1x1 output)",
        "expected": "[[8.0]]",
        "actual": str(out3.tolist()),
        "passed": bool(p3)
    })

_run_tests()
`,
    explanation: {
      approach: 'Create a 4D view of shape `(out_H, out_W, kH, kW)` using `as_strided`. The first two dimensions index which patch is selected (stepping by `image.strides * stride`), while the last two dimensions index pixels within that patch (stepping by standard `image.strides`). `np.einsum("ijkl,kl->ij", windows, kernel)` multiplies and sums along patch dimensions without allocating memory.',
      timeComplexity: 'O(out_H * out_W * kH * kW) in heavily optimized C/BLAS without Python loop interpreter overhead.',
      spaceComplexity: 'O(1) memory allocation for the window view (virtual memory strides).',
      keyTakeaway: '`as_strided` allows viewing overlapping sub-arrays in O(1) memory, serving as the mathematical backbone of NumPy and PyTorch im2col operations.'
    },
    hints: [
      'Calculate `out_H = (H - kH) // stride + 1` and `out_W = (W - kW) // stride + 1`.',
      'The 4D strides tuple is `(image.strides[0]*stride, image.strides[1]*stride, image.strides[0], image.strides[1])`.',
      'Use `np.einsum("ijkl,kl->ij", windows, kernel)` to contract the patch.'
    ]
  },

  {
    id: 'py-43-pandas-asof-trade-matcher',
    number: 43,
    title: 'High-Throughput As-Of Execution Matching with Slippage (Pandas)',
    slug: 'pandas-asof-trade-matcher',
    track: 'data-manipulation',
    difficulty: 'Hard',
    tags: ['Pandas', 'merge_asof', 'Time Series', 'Financial Engineering', 'Quantitative Analytics'],
    summary: 'Perform high-throughput asynchronous execution matching between trade prints and order book quotes.',
    description: `In quantitative trading and execution analytics, trades executed on an exchange must be matched against the prevailing National Best Bid and Offer (NBBO) quote that was active immediately prior to the trade execution timestamp.

Given two DataFrames:
1. \`trades_df\`: Columns \`['timestamp', 'symbol', 'price_trade']\`
2. \`quotes_df\`: Columns \`['timestamp', 'symbol', 'bid', 'ask']\`

Implement \`match_trades_to_quotes(trades_df, quotes_df, tolerance_ms=50)\`:
1. Both dataframes must be sorted by \`timestamp\`.
2. Perform a backward as-of join (\`pd.merge_asof\`) matching each trade to the most recent quote for the same \`symbol\`.
3. If the quote timestamp is older than \`tolerance_ms\` milliseconds relative to the trade timestamp, the quote is rejected (leaving quote columns as \`NaN\`).
4. Compute a new column \`slippage = (price_trade - bid).abs()\`.

### Requirements:
1. Use Pandas \`pd.merge_asof\` with \`direction='backward'\`, \`by='symbol'\`, and \`tolerance=pd.Timedelta(milliseconds=tolerance_ms)\`.
2. Return the enriched trade dataframe.`,
    examples: [
      {
        input: 'trades at 10:00:00.010 and 10:00:00.100; quotes at 10:00:00.000 (bid=150.00)',
        output: 'Trade 1 matched with slippage 0.05; Trade 2 unmatched (diff 100ms > tolerance 50ms)',
        explanation: 'As-of merge respects temporal ordering and tolerance limits.'
      }
    ],
    constraints: [
      'trades_df and quotes_df have valid datetime timestamps.',
      'tolerance_ms > 0',
      'Must handle multiple symbols without cross-symbol pollution.'
    ],
    starterCode: `import pandas as pd

def match_trades_to_quotes(trades_df: pd.DataFrame, quotes_df: pd.DataFrame, tolerance_ms: int = 50) -> pd.DataFrame:
    """
    Matches trades to the prevailing quote via backward as-of merge with tolerance.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import pandas as pd

def match_trades_to_quotes(trades_df: pd.DataFrame, quotes_df: pd.DataFrame, tolerance_ms: int = 50) -> pd.DataFrame:
    t_sorted = trades_df.sort_values('timestamp')
    q_sorted = quotes_df.sort_values('timestamp')
    
    merged = pd.merge_asof(
        t_sorted,
        q_sorted,
        on='timestamp',
        by='symbol',
        direction='backward',
        tolerance=pd.Timedelta(milliseconds=tolerance_ms)
    )
    
    # Calculate execution slippage
    merged['slippage'] = (merged['price_trade'] - merged['bid']).abs()
    return merged
`,
    testHarness: `
import pandas as pd
import numpy as np

def _run_tests():
    t_data = pd.DataFrame({
        'timestamp': pd.to_datetime(['2026-01-01 10:00:00.010', '2026-01-01 10:00:00.100']),
        'symbol': ['AAPL', 'AAPL'],
        'price_trade': [150.05, 150.50]
    })
    q_data = pd.DataFrame({
        'timestamp': pd.to_datetime(['2026-01-01 10:00:00.000', '2026-01-01 10:00:00.020']),
        'symbol': ['AAPL', 'AAPL'],
        'bid': [150.00, 150.10],
        'ask': [150.02, 150.12]
    })

    res = match_trades_to_quotes(t_data, q_data, tolerance_ms=50)

    # Test 1: First trade matched to quote at 10:00:00.000 (10ms diff <= 50ms)
    slip1 = res.iloc[0]['slippage']
    p1 = np.isclose(slip1, 0.05)
    _test_items.append({
        "input": "Trade 1 at 10ms matched to quote at 0ms (diff 10ms)",
        "expected": "slippage = 0.05",
        "actual": f"slippage = {slip1:.2f}",
        "passed": bool(p1)
    })

    # Test 2: Second trade at 100ms exceeds 50ms tolerance from 20ms quote -> bid is NaN
    p2 = pd.isna(res.iloc[1]['bid']) and pd.isna(res.iloc[1]['slippage'])
    _test_items.append({
        "input": "Trade 2 at 100ms vs latest quote at 20ms (diff 80ms > 50ms)",
        "expected": "bid is NaN, slippage is NaN",
        "actual": f"bid={res.iloc[1]['bid']}, slippage={res.iloc[1]['slippage']}",
        "passed": bool(p2)
    })

_run_tests()
`,
    explanation: {
      approach: 'Sort both frames by `timestamp`. Use `pd.merge_asof` matching on `timestamp` partitioned `by="symbol"`. Specifying `direction="backward"` guarantees taking the latest quote prior to trade execution. Supplying `tolerance=pd.Timedelta(milliseconds=tolerance_ms)` automatically invalidates outdated quotes without manual looping.',
      timeComplexity: 'O(T log T + Q log Q + T + Q) using binary search / merge pointer traversal.',
      spaceComplexity: 'O(T + Q) merged dataframe.',
      keyTakeaway: '`pd.merge_asof` executes temporal fuzzy joins without generating Cartesian products, making it thousands of times faster than standard SQL outer joins for tick data.'
    },
    hints: [
      'Both DataFrames must be sorted by `timestamp` before calling `merge_asof`.',
      'Pass `direction="backward"` and `tolerance=pd.Timedelta(milliseconds=tolerance_ms)`.',
      'Set `by="symbol"` to match within the same ticker.'
    ]
  }
];
