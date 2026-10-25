import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, CheckCircle2, ArrowDown } from 'lucide-react';

interface Step {
  left: number;
  right: number;
  sum: number;
  target: number;
  status: 'searching' | 'too-small' | 'too-large' | 'found';
  message: string;
}

export const TwoPointersVisualizer: React.FC = () => {
  const defaultArray = [2, 7, 11, 15, 18, 21, 24];
  const [array] = useState<number[]>(defaultArray);
  const [target, setTarget] = useState<number>(26);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Compute all execution steps
  useEffect(() => {
    const computedSteps: Step[] = [];
    let l = 0;
    let r = array.length - 1;

    while (l < r) {
      const sum = array[l] + array[r];
      if (sum === target) {
        computedSteps.push({
          left: l,
          right: r,
          sum,
          target,
          status: 'found',
          message: `Match Found! nums[${l}] (${array[l]}) + nums[${r}] (${array[r]}) = ${sum} == target ${target}. Return indices [${l + 1}, ${r + 1}].`,
        });
        break;
      } else if (sum < target) {
        computedSteps.push({
          left: l,
          right: r,
          sum,
          target,
          status: 'too-small',
          message: `Current sum (${array[l]} + ${array[r]} = ${sum}) is less than target (${target}). Increment left pointer to increase sum.`,
        });
        l++;
      } else {
        computedSteps.push({
          left: l,
          right: r,
          sum,
          target,
          status: 'too-large',
          message: `Current sum (${array[l]} + ${array[r]} = ${sum}) is greater than target (${target}). Decrement right pointer to reduce sum.`,
        });
        r--;
      }
    }

    if (l >= r && (computedSteps.length === 0 || computedSteps[computedSteps.length - 1].status !== 'found')) {
      computedSteps.push({
        left: l,
        right: r,
        sum: 0,
        target,
        status: 'too-small',
        message: 'No pair sums to target in this array.',
      });
    }

    setSteps(computedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [array, target]);

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  const curr = steps[currentStepIndex] || {
    left: 0,
    right: array.length - 1,
    sum: 0,
    target,
    status: 'searching',
    message: 'Starting traversal...',
  };

  return (
    <div className="bg-[#161b22] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Two Pointers Pattern
            </span>
            Two Sum II Sorted Inward Traversal
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Watch the Left (L) and Right (R) pointers converge inward in $O(N)$ time and $O(1)$ space.
          </p>
        </div>

        {/* Target Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium">Select Target:</label>
          <div className="flex gap-1.5">
            {[18, 26, 32, 35].map(t => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`px-2.5 py-1 text-xs rounded font-mono font-medium transition ${
                  target === t
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Array Track */}
      <div className="py-6 px-4 bg-[#0d1117] rounded-xl border border-slate-800/80 overflow-x-auto">
        <div className="flex justify-center items-end gap-3 min-w-[500px]">
          {array.map((val, idx) => {
            const isLeft = idx === curr.left;
            const isRight = idx === curr.right;
            const isFound = curr.status === 'found' && (isLeft || isRight);
            const isInactive = idx < curr.left || idx > curr.right;

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Pointer Indicators */}
                <div className="h-10 flex flex-col items-center justify-end">
                  {isLeft && (
                    <div className="animate-bounce flex flex-col items-center">
                      <span className="text-[10px] font-bold tracking-wider text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-400/40">
                        LEFT (i={idx})
                      </span>
                      <ArrowDown className="w-3.5 h-3.5 text-sky-400 -mt-0.5" />
                    </div>
                  )}
                  {isRight && !isLeft && (
                    <div className="animate-bounce flex flex-col items-center">
                      <span className="text-[10px] font-bold tracking-wider text-purple-400 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-400/40">
                        RIGHT (j={idx})
                      </span>
                      <ArrowDown className="w-3.5 h-3.5 text-purple-400 -mt-0.5" />
                    </div>
                  )}
                </div>

                {/* Array Box */}
                <div
                  className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center font-mono text-base font-bold transition-all duration-300 ${
                    isFound
                      ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 scale-105'
                      : isLeft
                      ? 'bg-sky-500/20 text-sky-300 border-2 border-sky-400 shadow-lg shadow-sky-500/20'
                      : isRight
                      ? 'bg-purple-500/20 text-purple-300 border-2 border-purple-400 shadow-lg shadow-purple-500/20'
                      : isInactive
                      ? 'bg-slate-900/40 text-slate-600 border border-slate-800/40 opacity-40'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  {val}
                  <span className="text-[10px] font-normal text-slate-400 -mt-0.5">#{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Computation State Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Current Sum:</span>
          <span className="font-mono text-base font-bold text-white">
            {array[curr.left]} + {array[curr.right]} = <span className="text-amber-400">{curr.sum}</span>
          </span>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Target Value:</span>
          <span className="font-mono text-base font-bold text-emerald-400">{target}</span>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Step Status:</span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${
              curr.status === 'found'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : curr.status === 'too-small'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {curr.status === 'found' ? '✓ Solution Found' : curr.status === 'too-small' ? 'Sum < Target' : 'Sum > Target'}
          </span>
        </div>
      </div>

      {/* Step Explanation Banner */}
      <div
        className={`p-3.5 rounded-lg border text-sm flex items-start gap-3 transition-colors ${
          curr.status === 'found'
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}
      >
        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${curr.status === 'found' ? 'text-emerald-400' : 'text-slate-500'}`} />
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
          <div className="mt-0.5 leading-relaxed font-sans">{curr.message}</div>
        </div>
      </div>

      {/* Stepper Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <button
          onClick={() => {
            setCurrentStepIndex(0);
            setIsPlaying(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>

        <div className="flex items-center gap-2">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(prev => Math.max(0, prev - 1));
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(p => !p)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            disabled={currentStepIndex >= steps.length - 1}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs font-mono text-slate-500">Time Complexity: O(N) | Space: O(1)</div>
      </div>
    </div>
  );
};
