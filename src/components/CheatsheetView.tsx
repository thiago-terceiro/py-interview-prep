import React from 'react';
import { BookOpen, AlertTriangle, Cpu, Table, Brain } from 'lucide-react';

export const CheatsheetView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" /> Technical Interview Cheatsheet
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          High-Yield Python, Algorithms & ML Knowledge Base
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Quick-reference guides, Big-O complexities, vectorization formulas, and classic interview traps to review before your screen.
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Python Data Structures & Complexities */}
        <div className="bg-[#161b22] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <Cpu className="w-5 h-5" />
            <h3>Python Data Structure Time Complexities</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-2">Operation</th>
                  <th className="pb-2">list</th>
                  <th className="pb-2">collections.deque</th>
                  <th className="pb-2">dict / set</th>
                  <th className="pb-2">heapq</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                <tr>
                  <td className="py-2 text-slate-400 font-sans">Append (right)</td>
                  <td className="text-emerald-400">O(1)*</td>
                  <td className="text-emerald-400">O(1)</td>
                  <td className="text-slate-500">—</td>
                  <td className="text-amber-400">O(log N) (push)</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400 font-sans">Prepend (left)</td>
                  <td className="text-rose-400">O(N) (insert 0)</td>
                  <td className="text-emerald-400">O(1) (appendleft)</td>
                  <td className="text-slate-500">—</td>
                  <td className="text-slate-500">—</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400 font-sans">Pop (right)</td>
                  <td className="text-emerald-400">O(1)</td>
                  <td className="text-emerald-400">O(1)</td>
                  <td className="text-slate-500">—</td>
                  <td className="text-amber-400">O(log N) (pop)</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400 font-sans">Pop (left)</td>
                  <td className="text-rose-400">O(N) (pop(0))</td>
                  <td className="text-emerald-400">O(1) (popleft)</td>
                  <td className="text-slate-500">—</td>
                  <td className="text-slate-500">—</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400 font-sans">Lookup / In</td>
                  <td className="text-rose-400">O(N)</td>
                  <td className="text-rose-400">O(N)</td>
                  <td className="text-emerald-400">O(1) avg</td>
                  <td className="text-rose-400">O(N)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400">
            * Amortized O(1). Never use <code className="text-amber-300">list.pop(0)</code> in BFS queues; always use <code className="text-emerald-300">collections.deque.popleft()</code>.
          </p>
        </div>

        {/* Section 2: Classic Python Interview Gotchas */}
        <div className="bg-[#161b22] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <h3>5 Critical Python Interview Traps</h3>
          </div>
          <ul className="text-xs space-y-2.5 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">1.</span>
              <div>
                <strong className="text-white">Mutable Default Arguments:</strong> Default arguments are evaluated once at function definition time.
                <code className="block bg-[#0d1117] p-1.5 rounded mt-0.5 text-slate-400">
                  def append(item, target=None): target = [] if target is None else target
                </code>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">2.</span>
              <div>
                <strong className="text-white">Shallow vs Deep Copy:</strong> <code className="text-sky-300">list.copy()</code> only copies the outer container. Nested lists still share references. Use <code className="text-sky-300">copy.deepcopy()</code>.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">3.</span>
              <div>
                <strong className="text-white">Generator Exhaustion:</strong> Generators can only be consumed once. Iterating or calling <code className="text-sky-300">list(gen)</code> exhausts the iterator.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">4.</span>
              <div>
                <strong className="text-white">Identity (is) vs Equality (==):</strong> <code className="text-sky-300">==</code> checks value equality; <code className="text-sky-300">is</code> checks memory address. Always use <code className="text-emerald-300">x is None</code>.
              </div>
            </li>
          </ul>
        </div>

        {/* Section 3: NumPy Broadcasting & Vectorization Idioms */}
        <div className="bg-[#161b22] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-base">
            <Table className="w-5 h-5" />
            <h3>NumPy & Vectorization Cheat Sheet</h3>
          </div>
          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <strong className="text-white">Broadcasting Rule:</strong> Two dimensions are compatible if they are equal, or one of them is 1.
              <div className="bg-[#0d1117] p-2 rounded mt-1 font-mono text-[11px] text-sky-300">
                A: (N, 1, D)  -  B: (1, K, D)  →  Result: (N, K, D)
              </div>
            </div>
            <div>
              <strong className="text-white">Preserving Dimensions with keepdims:</strong>
              <div className="bg-[#0d1117] p-2 rounded mt-1 font-mono text-[11px] text-slate-400">
                np.mean(X, axis=0, keepdims=True)  # retains shape (1, D)
              </div>
            </div>
            <div>
              <strong className="text-white">One-Hot Vectorization:</strong>
              <div className="bg-[#0d1117] p-2 rounded mt-1 font-mono text-[11px] text-emerald-400">
                one_hot = np.eye(num_classes)[labels]
              </div>
            </div>
            <div>
              <strong className="text-white">Pairwise Distance Trick without Loops:</strong>
              <div className="bg-[#0d1117] p-2 rounded mt-1 font-mono text-[11px] text-amber-300">
                dist_sq = np.sum((X[:, None, :] - C[None, :, :]) ** 2, axis=2)
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: ML Engineering Math & Architectures */}
        <div className="bg-[#161b22] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-base">
            <Brain className="w-5 h-5" />
            <h3>Machine Learning & Transformers Core Formulas</h3>
          </div>
          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <strong className="text-white">Numerically Stable Softmax:</strong>
              <div className="bg-[#0d1117] p-2 rounded mt-1 font-mono text-[11px] text-purple-300">
                z_shifted = z - np.max(z, axis=-1, keepdims=True)<br />
                softmax = np.exp(z_shifted) / np.sum(np.exp(z_shifted), axis=-1, keepdims=True)
              </div>
            </div>
            <div>
              <strong className="text-white">Ridge Regression Weight Gradient:</strong>
              <div className="bg-[#0d1117] p-2 rounded mt-1 font-mono text-[11px] text-sky-300">
                grad = (1 / N) * X.T @ (X @ w - y) + (lambda_reg * w)
              </div>
            </div>
            <div>
              <strong className="text-white">Transformer Attention:</strong>
              <div className="bg-[#0d1117] p-2 rounded mt-1 font-mono text-[11px] text-emerald-400">
                Attention(Q, K, V) = softmax(Q @ K.T / sqrt(d_k) + Mask) @ V
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
