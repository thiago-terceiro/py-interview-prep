import type { Question } from '../../types';


export const mlEngineeringQuestions: Question[] = [
  {
    id: 'py-24-cross-entropy-softmax',
    number: 24,
    title: 'Numerically Stable Softmax & Cross-Entropy Loss',
    slug: 'cross-entropy-softmax',
    track: 'ml-engineering',
    difficulty: 'Medium',
    tags: ['Machine Learning', 'Deep Learning', 'Loss Functions', 'NumPy'],
    summary: 'Implement numerically stable softmax and categorical cross-entropy loss with gradients.',
    description: `Directly computing $\\frac{e^{z_i}}{\\sum e^{z_j}}$ causes floating point overflow when logits $z_i$ are large (e.g. $e^{1000} \\to \\infty$).

In ML engineering interviews, you are expected to know the **Log-Sum-Exp trick**: subtract $\\max(z)$ from logits before exponentiating.

Write two functions:
1. \`softmax(logits: np.ndarray) -> np.ndarray\`: Given 2D logits of shape \`(N, C)\`, compute softmax probabilities stably along \`axis=-1\`.
2. \`cross_entropy_loss(probs: np.ndarray, y_true: np.ndarray, eps: float = 1e-15) -> float\`:
   Given predicted probabilities \`probs\` of shape \`(N, C)\` and integer true labels \`y_true\` of shape \`(N,)\`, compute the mean negative log-likelihood:
   $$\\mathcal{L} = -\\frac{1}{N} \\sum_{i=1}^N \\log(\\text{probs}_{i, y_i} + \\epsilon)$$`,
    examples: [
      {
        input: 'logits = np.array([[1000.0, 1000.0]])',
        output: 'probs = array([[0.5, 0.5]]), no NaN/Inf overflow',
        explanation: 'Subtracting max logit 1000 yields [0, 0], giving exp([0, 0]) = [1, 1] / 2 = [0.5, 0.5].'
      }
    ],
    constraints: [
      'logits is 2D array of shape (N, C).',
      'y_true is 1D array of integers 0 <= y[i] < C.',
      'Must not trigger runtime warnings or produce NaNs.'
    ],
    starterCode: `import numpy as np

def softmax(logits: np.ndarray) -> np.ndarray:
    """
    Computes numerically stable softmax along the last axis.
    """
    # Write your solution here
    pass

def cross_entropy_loss(probs: np.ndarray, y_true: np.ndarray, eps: float = 1e-15) -> float:
    """
    Computes average categorical cross-entropy loss.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import numpy as np

def softmax(logits: np.ndarray) -> np.ndarray:
    # Subtract max per row to prevent overflow
    shifted = logits - np.max(logits, axis=-1, keepdims=True)
    exp_z = np.exp(shifted)
    return exp_z / np.sum(exp_z, axis=-1, keepdims=True)

def cross_entropy_loss(probs: np.ndarray, y_true: np.ndarray, eps: float = 1e-15) -> float:
    n_samples = probs.shape[0]
    # Pick the probability assigned to the true class
    true_class_probs = probs[np.arange(n_samples), y_true]
    clipped = np.clip(true_class_probs, eps, 1.0)
    return float(-np.mean(np.log(clipped)))
`,
    testHarness: `
import numpy as np

def _run_tests():
    # Test 1: Extreme values to test numerical stability
    huge_logits = np.array([[1000.0, 1000.0], [500.0, 500.0]])
    probs1 = softmax(huge_logits)
    p1 = np.allclose(probs1, [[0.5, 0.5], [0.5, 0.5]], atol=1e-5)
    _test_items.append({
        "input": "huge_logits = [[1000, 1000], [500, 500]]",
        "expected": "[[0.5, 0.5], [0.5, 0.5]] without overflow",
        "actual": np.array2string(np.round(probs1, 2), separator=', '),
        "passed": bool(p1)
    })

    # Test 2: Cross entropy loss check
    probs2 = np.array([[0.7, 0.3], [0.1, 0.9]])
    y_true = np.array([0, 1])
    loss = cross_entropy_loss(probs2, y_true)
    # Expected: -0.5 * (log(0.7) + log(0.9)) ~ -0.5 * (-0.35667 - 0.10536) = 0.2310
    exp_loss = -0.5 * (np.log(0.7) + np.log(0.9))
    p2 = np.isclose(loss, exp_loss, atol=1e-4)
    _test_items.append({
        "input": "probs=[[0.7, 0.3], [0.1, 0.9]], y=[0, 1]",
        "expected": f"Loss ~ {exp_loss:.4f}",
        "actual": f"Loss = {loss:.4f}",
        "passed": bool(p2)
    })

_run_tests()
`,
    explanation: {
      approach: 'Softmax is shift-invariant: $\\frac{e^{z_i}}{\\sum e^{z_j}} = \\frac{e^{z_i - c}}{\\sum e^{z_j - c}}$. Setting $c = \\max(z)$ ensures the largest exponent is $e^0 = 1$, completely avoiding overflow. In cross-entropy, index true class probabilities via `probs[np.arange(N), y_true]` and clip with `eps` before `log` to avoid $\\log(0) = -\\infty$.',
      timeComplexity: 'O(N * C) vectorized.',
      spaceComplexity: 'O(N * C) for probabilities.',
      keyTakeaway: 'Always subtract $\\max(z)$ in softmax and clip probabilities before $\\log$ in cross-entropy to ensure numerical stability.'
    },
    hints: [
      'In softmax, compute `shifted = logits - np.max(logits, axis=-1, keepdims=True)` before `np.exp()`.',
      'Normalize by dividing by `np.sum(..., axis=-1, keepdims=True)`.',
      'For cross entropy, extract true class probabilities with `probs[np.arange(N), y_true]`.'
    ]
  },
  {
    id: 'py-25-linear-regression-gradient-descent',
    number: 25,
    title: 'Ridge Regression & Gradient Descent Step',
    slug: 'ridge-regression-gradient-descent',
    track: 'ml-engineering',
    difficulty: 'Medium',
    tags: ['Optimization', 'Gradient Descent', 'L2 Regularization', 'Matrix Math'],
    summary: 'Implement one gradient descent optimization step for Ridge Regression with L2 penalty.',
    description: `Ridge regression adds an $L_2$ penalty to the Mean Squared Error (MSE) objective:
$$\\mathcal{L}(w) = \\frac{1}{2N} \\|Xw - y\\|_2^2 + \\frac{\\lambda}{2} \\|w\\|_2^2$$

The gradient with respect to weight vector $w$ is:
$$\\nabla_w \\mathcal{L} = \\frac{1}{N} X^T (Xw - y) + \\lambda w$$

Write a function \`gradient_step_ridge(X, y, w, lr=0.01, l2_reg=0.1)\` that:
1. Computes predictions $\\hat{y} = Xw$.
2. Computes the gradient $\\nabla_w \\mathcal{L}$.
3. Updates weights: $w_{\\text{new}} = w - \\text{lr} \\times \\nabla_w \\mathcal{L}$.
4. Returns a tuple \`(w_new, loss)\` where \`loss\` is the scalar float objective value before the step.`,
    examples: [
      {
        input: 'X shape (100, 5), y shape (100,), w shape (5,)',
        output: 'Returns (w_new, current_loss)',
        explanation: 'Performs matrix multiplications X @ w and X.T @ error.'
      }
    ],
    constraints: [
      'X is 2D (N, D), y is 1D (N,), w is 1D (D,).',
      'lr > 0, l2_reg >= 0.',
      'Must use vectorized NumPy operations (@ or np.dot).'
    ],
    starterCode: `import numpy as np
from typing import Tuple

def gradient_step_ridge(
    X: np.ndarray,
    y: np.ndarray,
    w: np.ndarray,
    lr: float = 0.01,
    l2_reg: float = 0.1
) -> Tuple[np.ndarray, float]:
    """
    Computes loss and updates weights using one step of gradient descent.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import numpy as np
from typing import Tuple

def gradient_step_ridge(
    X: np.ndarray,
    y: np.ndarray,
    w: np.ndarray,
    lr: float = 0.01,
    l2_reg: float = 0.1
) -> Tuple[np.ndarray, float]:
    n_samples = X.shape[0]
    
    # 1. Prediction and error
    y_pred = X @ w
    error = y_pred - y
    
    # 2. Compute Ridge loss
    mse_loss = (1.0 / (2.0 * n_samples)) * np.sum(error ** 2)
    l2_penalty = (l2_reg / 2.0) * np.sum(w ** 2)
    loss = float(mse_loss + l2_penalty)
    
    # 3. Compute gradient
    grad = (1.0 / n_samples) * (X.T @ error) + (l2_reg * w)
    
    # 4. Gradient update
    w_new = w - (lr * grad)
    
    return w_new, loss
`,
    testHarness: `
import numpy as np

def _run_tests():
    # Simple deterministic test
    X = np.array([[1.0, 2.0], [3.0, 4.0]])
    y = np.array([5.0, 11.0])
    w = np.array([1.0, 1.0])  # y_pred = [3, 7], error = [-2, -4]
    
    w_new, loss = gradient_step_ridge(X, y, w, lr=0.1, l2_reg=0.0)
    # n=2. MSE = 0.5/2 * (4 + 16) = 5.0
    # grad = 1/2 * [[1, 3], [2, 4]] @ [-2, -4] = 1/2 * [-14, -20] = [-7, -10]
    # w_new = [1, 1] - 0.1 * [-7, -10] = [1.7, 2.0]
    p1 = np.isclose(loss, 5.0) and np.allclose(w_new, [1.7, 2.0])
    _test_items.append({
        "input": "2x2 simple system with zero regularization",
        "expected": "loss=5.0, w_new=[1.7, 2.0]",
        "actual": f"loss={loss:.1f}, w_new={list(np.round(w_new, 2))}",
        "passed": bool(p1)
    })

_run_tests()
`,
    explanation: {
      approach: 'Compute error $e = Xw - y$. The MSE gradient is $\\frac{1}{N} X^T e$, and the $L_2$ regularization gradient is $\\lambda w$. Combine them into `grad` and apply the gradient step `w - lr * grad`.',
      timeComplexity: 'O(N * D) for matrix multiplications.',
      spaceComplexity: 'O(D) for weight vector.',
      keyTakeaway: 'The matrix form $X^T (Xw - y)$ computes the inner product between each feature column and the residual error vector in a single BLAS GEMV call.'
    },
    hints: [
      'Prediction: `y_pred = X @ w`.',
      'Error: `error = y_pred - y`.',
      'Gradient: `grad = (1.0 / n_samples) * (X.T @ error) + (l2_reg * w)`.',
      'New weights: `w - lr * grad`.'
    ],
    visualizerId: 'gradient-descent'
  },
  {
    id: 'py-26-binary-classification-metrics',
    number: 26,
    title: 'Binary Classification Metrics (Precision, Recall, F1)',
    slug: 'binary-classification-metrics',
    track: 'ml-engineering',
    difficulty: 'Easy',
    tags: ['Metrics', 'Classification', 'F1-Score', 'Confusion Matrix'],
    summary: 'Calculate TP, FP, TN, FN, Precision, Recall, and F1 score from raw predictions without sklearn.',
    description: `Given true binary labels \`y_true\` ($0$ or $1$) and predicted probabilities \`y_pred_probs\` (floats in $[0, 1]$), along with a classification decision \`threshold = 0.5\`:

Write \`evaluate_binary_model(y_true, y_pred_probs, threshold=0.5) -> dict\` returning a dictionary containing:
- \`'tp'\`: True Positives
- \`'fp'\`: False Positives
- \`'tn'\`: True Negatives
- \`'fn'\`: False Negatives
- \`'precision'\`: $\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$ (return \`0.0\` if denominator is 0)
- \`'recall'\`: $\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$ (return \`0.0\` if denominator is 0)
- \`'f1'\`: $2 \\times \\frac{\\text{precision} \\times \\text{recall}}{\\text{precision} + \\text{recall}}$ (return \`0.0\` if denominator is 0)

Must be implemented with pure Python / NumPy without using \`sklearn\`.`,
    examples: [
      {
        input: 'y_true = [1, 1, 0, 0], probs = [0.9, 0.4, 0.2, 0.8], threshold = 0.5',
        output: 'tp=1, fp=1, tn=1, fn=1, precision=0.5, recall=0.5, f1=0.5',
        explanation: 'Predictions are [1, 0, 0, 1]. Exactly one of each confusion matrix quadrant.'
      }
    ],
    constraints: [
      'Handle zero-division gracefully by returning 0.0.',
      'Must return rounded floats or exact float values.'
    ],
    starterCode: `import numpy as np

def evaluate_binary_model(y_true: np.ndarray, y_pred_probs: np.ndarray, threshold: float = 0.5) -> dict:
    """
    Computes TP, FP, TN, FN, precision, recall, and F1 score.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import numpy as np

def evaluate_binary_model(y_true: np.ndarray, y_pred_probs: np.ndarray, threshold: float = 0.5) -> dict:
    y_true = np.asarray(y_true, dtype=int)
    y_pred = (np.asarray(y_pred_probs) >= threshold).astype(int)
    
    tp = int(np.sum((y_true == 1) & (y_pred == 1)))
    fp = int(np.sum((y_true == 0) & (y_pred == 1)))
    tn = int(np.sum((y_true == 0) & (y_pred == 0)))
    fn = int(np.sum((y_true == 1) & (y_pred == 0)))
    
    precision = float(tp / (tp + fp)) if (tp + fp) > 0 else 0.0
    recall = float(tp / (tp + fn)) if (tp + fn) > 0 else 0.0
    f1 = float(2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0
    
    return {
        'tp': tp,
        'fp': fp,
        'tn': tn,
        'fn': fn,
        'precision': round(precision, 4),
        'recall': round(recall, 4),
        'f1': round(f1, 4)
    }
`,
    testHarness: `
import numpy as np

def _run_tests():
    y_t = np.array([1, 1, 0, 0])
    y_p = np.array([0.9, 0.4, 0.2, 0.8])
    metrics = evaluate_binary_model(y_t, y_p, 0.5)
    
    p1 = (metrics['tp'] == 1 and metrics['fp'] == 1 and 
          metrics['tn'] == 1 and metrics['fn'] == 1 and 
          np.isclose(metrics['f1'], 0.5))
    _test_items.append({
        "input": "4 samples with one of each TP, FP, TN, FN",
        "expected": "tp=1, fp=1, tn=1, fn=1, f1=0.5",
        "actual": f"tp={metrics['tp']}, fp={metrics['fp']}, f1={metrics['f1']}",
        "passed": bool(p1)
    })

    # Test edge case: All negative predictions (zero division test)
    metrics2 = evaluate_binary_model(np.array([1, 0]), np.array([0.1, 0.1]), 0.5)
    p2 = metrics2['precision'] == 0.0 and metrics2['recall'] == 0.0 and metrics2['f1'] == 0.0
    _test_items.append({
        "input": "Zero positive predictions (test zero division guard)",
        "expected": "precision=0.0, recall=0.0, f1=0.0",
        "actual": f"precision={metrics2['precision']}, recall={metrics2['recall']}",
        "passed": bool(p2)
    })

_run_tests()
`,
    explanation: {
      approach: 'Convert probabilities to binary decisions with `y_pred = y_pred_probs >= threshold`. Use bitwise AND `&` with NumPy masks to count TP, FP, TN, FN. Guard against zero division by returning 0.0 when denominators are zero.',
      timeComplexity: 'O(N) single vectorized pass.',
      spaceComplexity: 'O(N) for boolean mask arrays.',
      keyTakeaway: 'Always address the edge case where the model predicts zero positives ($TP + FP = 0$), otherwise evaluating rare classes in production crashes with `ZeroDivisionError`.'
    },
    hints: [
      'Threshold predictions: `y_pred = (y_pred_probs >= threshold).astype(int)`.',
      'Use `np.sum((y_true == 1) & (y_pred == 1))` for TP, etc.',
      'Check if denominator is 0 before dividing!'
    ]
  },
  {
    id: 'py-27-minibatch-generator',
    number: 27,
    title: 'Mini-Batch Data Generator with Shuffling',
    slug: 'minibatch-generator-shuffling',
    track: 'ml-engineering',
    difficulty: 'Easy',
    tags: ['Data Loader', 'Generators', 'PyTorch Concepts', 'NumPy'],
    summary: 'Write a generator yielding mini-batches with optional random shuffling and remainder handling.',
    description: `Training deep learning models requires streaming mini-batches of data into GPU memory.

Implement a generator function \`batch_generator(X, y, batch_size=32, shuffle=True, seed=None)\`:
1. If \`shuffle=True\`, randomly permute the data before slicing into batches (if \`seed\` is provided, use \`np.random.RandomState(seed)\`).
2. Yield tuples of \`(batch_X, batch_y)\`.
3. Handle remainders: if the dataset length is not divisible by \`batch_size\`, the final batch should contain the remaining elements.
4. \`X\` and \`y\` must maintain their corresponding sample alignments after shuffling.`,
    examples: [
      {
        input: 'X = np.arange(10), y = np.arange(10)*2, batch_size = 4, shuffle = False',
        output: 'Batch 1: size 4, Batch 2: size 4, Batch 3: size 2',
        explanation: 'Three batches yielded sequentially.'
      }
    ],
    constraints: [
      'X and y have the same first dimension length N.',
      'batch_size >= 1.',
      'Must be an efficient generator using yield.'
    ],
    starterCode: `import numpy as np
from typing import Generator, Tuple

def batch_generator(
    X: np.ndarray,
    y: np.ndarray,
    batch_size: int = 32,
    shuffle: bool = True,
    seed: int = None
) -> Generator[Tuple[np.ndarray, np.ndarray], None, None]:
    """
    Yields (batch_X, batch_y) batches.
    """
    # Write your generator here
    pass
`,
    solutionCode: `import numpy as np
from typing import Generator, Tuple

def batch_generator(
    X: np.ndarray,
    y: np.ndarray,
    batch_size: int = 32,
    shuffle: bool = True,
    seed: int = None
) -> Generator[Tuple[np.ndarray, np.ndarray], None, None]:
    n_samples = len(X)
    indices = np.arange(n_samples)
    
    if shuffle:
        rng = np.random.RandomState(seed)
        rng.shuffle(indices)
        
    for start_idx in range(0, n_samples, batch_size):
        batch_idx = indices[start_idx : start_idx + batch_size]
        yield X[batch_idx], y[batch_idx]
`,
    testHarness: `
import numpy as np

def _run_tests():
    X = np.arange(10).reshape(-1, 1)
    y = np.arange(10) * 10
    
    # Test 1: No shuffle remainder check
    batches = list(batch_generator(X, y, batch_size=4, shuffle=False))
    p1 = len(batches) == 3 and len(batches[0][0]) == 4 and len(batches[2][0]) == 2
    _test_items.append({
        "input": "10 samples, batch_size=4, shuffle=False",
        "expected": "3 batches with sizes [4, 4, 2]",
        "actual": f"Batch sizes: {[len(b[0]) for b in batches]}",
        "passed": bool(p1)
    })

    # Test 2: Alignment check under shuffle
    batches_shuffled = list(batch_generator(X, y, batch_size=3, shuffle=True, seed=42))
    all_aligned = True
    for bx, by in batches_shuffled:
        if not np.all(bx.ravel() * 10 == by):
            all_aligned = False
            break
            
    _test_items.append({
        "input": "Alignment check after random shuffling",
        "expected": "Each batch retains X*10 == y alignment",
        "actual": f"All aligned: {all_aligned}",
        "passed": bool(all_aligned)
    })

_run_tests()
`,
    explanation: {
      approach: 'Create an array of indices `np.arange(n_samples)`. Shuffle the indices rather than shuffling `X` and `y` separately, ensuring both arrays stay synchronized. Loop in steps of `batch_size` and yield slices indexed by the permuted indices.',
      timeComplexity: 'O(N) per epoch iteration.',
      spaceComplexity: 'O(N) for indices array.',
      keyTakeaway: 'Always permute indices rather than arrays in-place to keep multimodal or feature/target pairs synchronized without copying bulky data.'
    },
    hints: [
      'Create `indices = np.arange(len(X))`.',
      'Use `np.random.RandomState(seed).shuffle(indices)` if `shuffle=True`.',
      'Loop `range(0, len(X), batch_size)` and slice `X[batch_idx]` and `y[batch_idx]`.'
    ]
  },
  {
    id: 'py-28-kmeans-step',
    number: 28,
    title: 'K-Means: Pairwise Distance & Centroid Update',
    slug: 'kmeans-clustering-step',
    track: 'ml-engineering',
    difficulty: 'Medium',
    tags: ['K-Means', 'Clustering', 'Broadcasting', 'Vectorized Distance'],
    summary: 'Implement one iteration of K-Means: assign points to nearest centroids and recalculate centroids.',
    description: `Given data points \`X\` of shape \`(N, D)\` and current cluster centroids \`centroids\` of shape \`(K, D)\`:

Implement \`kmeans_step(X: np.ndarray, centroids: np.ndarray) -> Tuple[np.ndarray, np.ndarray]\`:
1. **Assignment step**: Compute the squared Euclidean distance between every point $x_i$ and every centroid $c_k$:
   $$d(x_i, c_k)^2 = \\sum_{d=1}^D (x_{i, d} - c_{k, d})^2$$
   Assign each point to its nearest centroid index in \`labels\` (shape \`(N,)\`).
2. **Update step**: Recompute each centroid as the mean of all points assigned to that cluster. If a cluster has 0 points assigned, keep its centroid unchanged.
3. Return \`(new_centroids, labels)\`.
4. Avoid Python loops over the $N$ data points (use NumPy broadcasting).`,
    examples: [
      {
        input: 'X = [[0, 0], [1, 0], [10, 10], [11, 10]], centroids = [[0, 0], [10, 10]]',
        output: 'labels = [0, 0, 1, 1], new_centroids = [[0.5, 0], [10.5, 10]]',
        explanation: 'Points assign to closest centroid, then centroids move to group means.'
      }
    ],
    constraints: [
      'N >= K >= 1.',
      'Dimension D >= 1.',
      'Must not crash if a cluster is empty.'
    ],
    starterCode: `import numpy as np
from typing import Tuple

def kmeans_step(X: np.ndarray, centroids: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    """
    Performs one assignment and update step in K-Means clustering.
    """
    # Write your solution here
    pass
`,
    solutionCode: `import numpy as np
from typing import Tuple

def kmeans_step(X: np.ndarray, centroids: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    # 1. Broadcasting to compute pairwise distances: (N, 1, D) - (1, K, D) -> (N, K, D)
    diff = X[:, np.newaxis, :] - centroids[np.newaxis, :, :]
    dist_sq = np.sum(diff ** 2, axis=2)  # shape (N, K)
    
    # Nearest centroid for each point
    labels = np.argmin(dist_sq, axis=1)  # shape (N,)
    
    # 2. Update centroids
    k = centroids.shape[0]
    new_centroids = np.copy(centroids)
    for c_idx in range(k):
        mask = (labels == c_idx)
        if np.any(mask):
            new_centroids[c_idx] = np.mean(X[mask], axis=0)
            
    return new_centroids, labels
`,
    testHarness: `
import numpy as np

def _run_tests():
    X = np.array([
        [0.0, 0.0],
        [1.0, 0.0],
        [10.0, 10.0],
        [11.0, 10.0]
    ])
    centroids = np.array([
        [0.0, 0.0],
        [10.0, 10.0]
    ])
    new_c, labels = kmeans_step(X, centroids)
    
    p1 = list(labels) == [0, 0, 1, 1]
    p2 = np.allclose(new_c, [[0.5, 0.0], [10.5, 10.0]])
    _test_items.append({
        "input": "4 points partitioned into 2 clusters",
        "expected": "labels=[0, 0, 1, 1], new_centroids=[[0.5, 0], [10.5, 10]]",
        "actual": f"labels={list(labels)}, new_c={new_c.tolist()}",
        "passed": bool(p1 and p2)
    })

_run_tests()
`,
    explanation: {
      approach: 'Use 3D broadcasting `X[:, np.newaxis, :] - centroids[np.newaxis, :, :]` to compute the $(N, K, D)$ differences simultaneously without loops over $N$. Sum along the feature axis and use `np.argmin(dist_sq, axis=1)` to assign clusters.',
      timeComplexity: 'O(N * K * D) vectorized.',
      spaceComplexity: 'O(N * K * D) for distance matrix.',
      keyTakeaway: 'The `np.newaxis` technique turns double loops into vectorized tensor operations in NumPy.'
    },
    hints: [
      'Expand dims: `X[:, np.newaxis, :]` has shape `(N, 1, D)`.',
      'Centroids `centroids[np.newaxis, :, :]` has shape `(1, K, D)`.',
      'Their difference broadcasts to `(N, K, D)`. Square and sum over `axis=2`.'
    ]
  },
  {
    id: 'py-29-bpe-tokenizer-merge',
    number: 29,
    title: 'Byte-Pair Encoding (BPE) Merge Step',
    slug: 'bpe-tokenizer-merge',
    track: 'ml-engineering',
    difficulty: 'Medium',
    tags: ['NLP', 'Tokenization', 'LLMs', 'BPE', 'Data Structures'],
    summary: 'Implement one merge operation for Byte Pair Encoding (BPE) subword tokenization.',
    description: `Modern LLMs (GPT-4, LLaMA, Claude) use Byte-Pair Encoding (BPE) to tokenize text into subwords.

In BPE, a corpus is initially represented as a dictionary of split word tuples with frequency counts:
e.g. \`{('l', 'o', 'w'): 5, ('l', 'o', 'w', 'e', 'r'): 2, ('n', 'e', 'w'): 6}\`

Write two functions:
1. \`get_stats(vocab: dict) -> dict\`: Count frequencies of all adjacent pairs across all words, weighted by word count. Return \`pair_counts\` mapping \`(sym1, sym2)\` to total frequency.
2. \`merge_vocab(pair: tuple, vocab: dict) -> dict\`: Replace every consecutive occurrence of \`pair\` (e.g. \`('l', 'o')\`) in word tuples with the merged symbol string (e.g. \`'lo'\`), returning the updated vocab dictionary.`,
    examples: [
      {
        input: "vocab = {('l', 'o', 'w'): 5, ('n', 'e', 'w'): 2}, pair = ('l', 'o')",
        output: "vocab = {('lo', 'w'): 5, ('n', 'e', 'w'): 2}",
        explanation: "('l', 'o') is replaced by 'lo'."
      }
    ],
    constraints: [
      'vocab maps tuple of string tokens to integer frequency > 0.',
      'Handles multiple consecutive pairs inside a word correctly.'
    ],
    starterCode: `from typing import Dict, Tuple

def get_stats(vocab: Dict[Tuple[str, ...], int]) -> Dict[Tuple[str, str], int]:
    """
    Counts frequency of adjacent symbol pairs across vocabulary.
    """
    # Write your solution here
    pass

def merge_vocab(pair: Tuple[str, str], vocab: Dict[Tuple[str, ...], int]) -> Dict[Tuple[str, ...], int]:
    """
    Merges all occurrences of pair in vocabulary tuples.
    """
    # Write your solution here
    pass
`,
    solutionCode: `from typing import Dict, Tuple
from collections import defaultdict

def get_stats(vocab: Dict[Tuple[str, ...], int]) -> Dict[Tuple[str, str], int]:
    pairs = defaultdict(int)
    for word, freq in vocab.items():
        for i in range(len(word) - 1):
            pair = (word[i], word[i + 1])
            pairs[pair] += freq
    return dict(pairs)

def merge_vocab(pair: Tuple[str, str], vocab: Dict[Tuple[str, ...], int]) -> Dict[Tuple[str, ...], int]:
    new_vocab = {}
    first, second = pair
    merged_symbol = first + second
    
    for word, freq in vocab.items():
        new_word = []
        i = 0
        while i < len(word):
            if i < len(word) - 1 and word[i] == first and word[i + 1] == second:
                new_word.append(merged_symbol)
                i += 2
            else:
                new_word.append(word[i])
                i += 1
        new_vocab[tuple(new_word)] = freq
        
    return new_vocab
`,
    testHarness: `
def _run_tests():
    vocab = {
        ('l', 'o', 'w'): 5,
        ('l', 'o', 'w', 'e', 'r'): 2,
        ('n', 'e', 'w'): 6
    }
    stats = get_stats(vocab)
    # ('l', 'o') appears in 'low' (5) and 'lower' (2) -> 7 times
    # ('e', 'w') appears in 'new' (6) -> 6 times
    p1 = stats.get(('l', 'o')) == 7 and stats.get(('e', 'w')) == 6
    _test_items.append({
        "input": "Vocab with low:5, lower:2, new:6",
        "expected": "('l', 'o') count=7, ('e', 'w') count=6",
        "actual": f"('l', 'o')={stats.get(('l', 'o'))}, ('e', 'w')={stats.get(('e', 'w'))}",
        "passed": bool(p1)
    })

    # Test merge
    merged = merge_vocab(('l', 'o'), vocab)
    p2 = ('lo', 'w') in merged and ('lo', 'w', 'e', 'r') in merged
    _test_items.append({
        "input": "Merge ('l', 'o')",
        "expected": "('lo', 'w') with freq 5",
        "actual": f"Keys in merged: {list(merged.keys())}",
        "passed": bool(p2)
    })

_run_tests()
`,
    explanation: {
      approach: 'In `get_stats`, loop over each word tuple and tally each adjacent `(word[i], word[i+1])` multiplied by word frequency. In `merge_vocab`, use a while-loop pointer through each word: if `word[i] == first` and `word[i+1] == second`, append `first + second` and advance `i += 2`.',
      timeComplexity: 'O(V * L) where V is vocabulary size and L is average word length.',
      spaceComplexity: 'O(V * L) for the new vocabulary representation.',
      keyTakeaway: 'BPE iteratively compresses character sequences into subword vocabularies by iteratively selecting the most frequent adjacent bigram.'
    },
    hints: [
      'For `get_stats`: iterate over `range(len(word) - 1)` and add `freq` to `pairs[(word[i], word[i+1])]`.',
      'For `merge_vocab`: use a `while i < len(word)` loop to check two characters at once.',
      'Remember to advance `i += 2` when you merge, and `i += 1` otherwise.'
    ]
  },
  {
    id: 'py-30-scaled-dot-product-attention',
    number: 30,
    title: 'Scaled Dot-Product Attention with Causal Masking',
    slug: 'scaled-dot-product-attention',
    track: 'ml-engineering',
    difficulty: 'Medium',
    tags: ['Transformers', 'Attention', 'LLMs', 'Deep Learning', 'PyTorch Concepts'],
    summary: 'Implement the Attention(Q, K, V) mechanism with optional causal upper-triangular masking.',
    description: `The foundation of modern Transformers ("Attention Is All You Need"):
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d_k}} + M \\right) V$$

Given query matrix \`Q\` of shape \`(T, d_k)\`, key matrix \`K\` of shape \`(T, d_k)\`, and value matrix \`V\` of shape \`(T, d_v)\`:
Implement \`scaled_dot_product_attention(Q, K, V, causal=False)\`:
1. Calculate raw scores: $S = \\frac{Q K^T}{\\sqrt{d_k}}$.
2. If \`causal=True\`, apply an upper-triangular mask ($M_{i, j} = -\\infty$ where $j > i$) to prevent positions from attending to future tokens.
3. Compute attention weights $A = \\text{softmax}(S, \\text{axis}=-1)$ using stable softmax.
4. Output the context representation: $O = A V$ of shape \`(T, d_v)\`.`,
    examples: [
      {
        input: 'Q, K, V of shape (3, 4) with causal=True',
        output: 'Attention matrix row 0 attends only to token 0; row 1 attends to tokens 0 and 1.',
        explanation: 'Future positions receive 0 probability after softmax(-inf).'
      }
    ],
    constraints: [
      'Q and K have identical second dimension d_k.',
      'V has second dimension d_v.',
      'Must support both causal=True and causal=False.'
    ],
    starterCode: `import numpy as np

def scaled_dot_product_attention(
    Q: np.ndarray,
    K: np.ndarray,
    V: np.ndarray,
    causal: bool = False
) -> np.ndarray:
    """
    Computes Scaled Dot-Product Attention: softmax(Q @ K.T / sqrt(d_k) + mask) @ V
    """
    # Write your solution here
    pass
`,
    solutionCode: `import numpy as np

def scaled_dot_product_attention(
    Q: np.ndarray,
    K: np.ndarray,
    V: np.ndarray,
    causal: bool = False
) -> np.ndarray:
    d_k = Q.shape[-1]
    # 1. Scaled dot products
    scores = (Q @ K.T) / np.sqrt(d_k)
    
    # 2. Causal masking
    if causal:
        t = Q.shape[0]
        # Upper triangle without diagonal is set to -1e9 (effective -infinity)
        mask = np.triu(np.ones((t, t), dtype=bool), k=1)
        scores[mask] = -1e9
        
    # 3. Softmax along last axis
    shifted = scores - np.max(scores, axis=-1, keepdims=True)
    exp_scores = np.exp(shifted)
    weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    
    # 4. Context vectors
    return weights @ V
`,
    testHarness: `
import numpy as np

def _run_tests():
    # Test 1: Simple attention
    T, d_k, d_v = 3, 4, 2
    rng = np.random.RandomState(42)
    Q = rng.randn(T, d_k)
    K = rng.randn(T, d_k)
    V = rng.randn(T, d_v)

    out = scaled_dot_product_attention(Q, K, V, causal=False)
    p1 = out.shape == (T, d_v)
    _test_items.append({
        "input": "Q(3, 4), K(3, 4), V(3, 2), causal=False",
        "expected": "Output shape (3, 2)",
        "actual": f"Shape: {out.shape}",
        "passed": bool(p1)
    })

    # Test 2: Causal masking verification
    # When causal=True, row 0 of attention weights must be [1.0, 0.0, 0.0]
    # Therefore out[0] must equal V[0]
    out_causal = scaled_dot_product_attention(Q, K, V, causal=True)
    p2 = np.allclose(out_causal[0], V[0], atol=1e-5)
    _test_items.append({
        "input": "causal=True check: token 0 must only attend to itself",
        "expected": "out[0] == V[0]",
        "actual": f"out[0]={list(np.round(out_causal[0], 2))}, V[0]={list(np.round(V[0], 2))}",
        "passed": bool(p2)
    })

_run_tests()
`,
    explanation: {
      approach: 'Compute $QK^T / \\sqrt{d_k}$. For causal masking, create a boolean mask using `np.triu(..., k=1)` and set masked elements to $-10^9$. Apply softmax along `axis=-1` and multiply by $V$.',
      timeComplexity: 'O(T^2 d_k + T^2 d_v) where T is sequence length.',
      spaceComplexity: 'O(T^2) for attention score matrix.',
      keyTakeaway: 'The scaling factor $1/\\sqrt{d_k}$ prevents the dot products from growing excessively large for high dimensions, which would otherwise push softmax into vanishing gradient regions.'
    },
    hints: [
      'Scale by `np.sqrt(d_k)`.',
      'For causal masking, use `np.triu(np.ones((t, t), dtype=bool), k=1)` to find upper elements.',
      'Replace masked values with `-1e9` before computing softmax.'
    ]
  }
];
