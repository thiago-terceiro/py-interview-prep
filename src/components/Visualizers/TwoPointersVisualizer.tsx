import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, CheckCircle2, ArrowDown } from 'lucide-react';

interface Step {
  left: number;
  right: number;
  sum: number;
  target: number;
  status: 'searching' | 'too-small' | 'too-large' | 'found';
  message: string;
  movedPointer: 'left' | 'right' | 'none';
  detail: string;
}

export const TwoPointersVisualizer: React.FC = () => {
  const defaultArray = [2, 7, 11, 15, 18, 21, 24];
  const [array] = useState<number[]>(defaultArray);
  const [target, setTarget] = useState<number>(26);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [prevTarget, setPrevTarget] = useState<number>(target);

  if (target !== prevTarget) {
    setPrevTarget(target);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  // Compute all execution steps with explicit pointer focus tracking
  const steps = useMemo<Step[]>(() => {
    const computedSteps: Step[] = [];
    let l = 0;
    let r = array.length - 1;
    let lastMoved: 'left' | 'right' | 'none' = 'none';
    let prevL = l;
    let prevR = r;

    while (l < r) {
      const sum = array[l] + array[r];
      if (sum === target) {
        computedSteps.push({
          left: l,
          right: r,
          sum,
          target,
          status: 'found',
          movedPointer: lastMoved,
          message: `Match Found! nums[${l}] (${array[l]}) + nums[${r}] (${array[r]}) = ${sum} == target ${target}. Return 1-based indices [${l + 1}, ${r + 1}].`,
          detail: `Optimal target ${target} matched! Left index ${l} and Right index ${r} solve the problem.`,
        });
        break;
      } else if (sum < target) {
        computedSteps.push({
          left: l,
          right: r,
          sum,
          target,
          status: 'too-small',
          movedPointer: lastMoved,
          message: `Current sum (${array[l]} + ${array[r]} = ${sum}) is less than target (${target}). Increment Left pointer from index ${l} to ${l + 1} to test larger numbers.`,
          detail: lastMoved === 'left'
            ? `Focus: Left pointer advanced from index ${prevL} (${array[prevL]}) → index ${l} (${array[l]}).`
            : lastMoved === 'right'
            ? `Focus: Right pointer decremented from index ${prevR} (${array[prevR]}) → index ${r} (${array[r]}).`
            : `Initial check at boundaries: Left index 0, Right index ${r}.`,
        });
        prevL = l;
        prevR = r;
        l++;
        lastMoved = 'left';
      } else {
        computedSteps.push({
          left: l,
          right: r,
          sum,
          target,
          status: 'too-large',
          movedPointer: lastMoved,
          message: `Current sum (${array[l]} + ${array[r]} = ${sum}) is greater than target (${target}). Decrement Right pointer from index ${r} to ${r - 1} to test smaller numbers.`,
          detail: lastMoved === 'right'
            ? `Focus: Right pointer decremented from index ${prevR} (${array[prevR]}) → index ${r} (${array[r]}).`
            : lastMoved === 'left'
            ? `Focus: Left pointer advanced from index ${prevL} (${array[prevL]}) → index ${l} (${array[l]}).`
            : `Initial check at boundaries: Left index 0, Right index ${r}.`,
        });
        prevL = l;
        prevR = r;
        r--;
        lastMoved = 'right';
      }
    }

    if (l >= r && (computedSteps.length === 0 || computedSteps[computedSteps.length - 1].status !== 'found')) {
      computedSteps.push({
        left: l,
        right: r,
        sum: 0,
        target,
        status: 'too-small',
        movedPointer: lastMoved,
        message: 'No pair sums to target in this array.',
        detail: 'Pointers crossed without finding a matching pair.',
      });
    }

    return computedSteps;
  }, [array, target]);

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= steps.length - 1) {
      const timer = setTimeout(() => setIsPlaying(false), 0);
      return () => clearTimeout(timer);
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
    movedPointer: 'none',
    message: 'Starting traversal...',
    detail: 'Initializing pointers...',
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
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <label className="text-xs text-slate-400 font-medium">Select Target:</label>
          <div className="flex flex-wrap gap-1.5">
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
      <div className="py-6 px-3 sm:px-4 bg-[#0d1117] rounded-xl border border-slate-800/80 overflow-hidden max-w-full">
        <div className="flex justify-center items-end gap-1.5 sm:gap-2.5 md:gap-3">
          {array.map((val, idx) => {
            const isLeft = idx === curr.left;
            const isRight = idx === curr.right;
            const isFound = curr.status === 'found' && (isLeft || isRight);
            const isInactive = idx < curr.left || idx > curr.right;
            const isLeftMoved = isLeft && curr.movedPointer === 'left';
            const isRightMoved = isRight && curr.movedPointer === 'right';

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Pointer Indicators */}
                <div className="h-10 sm:h-12 flex flex-col items-center justify-end">
                  {isLeft && (
                    <div className={`flex flex-col items-center transition-all ${isLeftMoved ? 'animate-bounce scale-110 z-20' : 'animate-bounce'}`}>
                      <span className={`text-[9px] sm:text-[10px] font-extrabold tracking-wider px-1.5 py-0.5 rounded border transition-all ${
                        isLeftMoved
                          ? 'text-white bg-sky-600 border-sky-300 shadow-lg shadow-sky-500/50 ring-2 ring-sky-400'
                          : 'text-sky-400 bg-sky-950/80 border-sky-400/40'
                      }`}>
                        LEFT (i={idx}){isLeftMoved ? ' ▶' : ''}
                      </span>
                      <ArrowDown className={`w-3.5 h-3.5 -mt-0.5 ${isLeftMoved ? 'text-white font-bold' : 'text-sky-400'}`} />
                    </div>
                  )}
                  {isRight && !isLeft && (
                    <div className={`flex flex-col items-center transition-all ${isRightMoved ? 'animate-bounce scale-110 z-20' : 'animate-bounce'}`}>
                      <span className={`text-[9px] sm:text-[10px] font-extrabold tracking-wider px-1.5 py-0.5 rounded border transition-all ${
                        isRightMoved
                          ? 'text-white bg-purple-600 border-purple-300 shadow-lg shadow-purple-500/50 ring-2 ring-purple-400'
                          : 'text-purple-400 bg-purple-950/80 border-purple-400/40'
                      }`}>
                        {isRightMoved ? '◀ ' : ''}RIGHT (j={idx})
                      </span>
                      <ArrowDown className={`w-3.5 h-3.5 -mt-0.5 ${isRightMoved ? 'text-white font-bold' : 'text-purple-400'}`} />
                    </div>
                  )}
                </div>

                {/* Array Box */}
                <div
                  className={`w-10 sm:w-13 md:w-14 h-11 sm:h-13 md:h-14 rounded-lg flex flex-col items-center justify-center font-mono text-sm sm:text-base font-bold transition-all duration-300 relative ${
                    isFound
                      ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40 scale-105 z-10'
                      : isLeftMoved
                      ? 'bg-sky-500/30 text-sky-200 border-2 border-sky-300 ring-4 ring-sky-400/50 scale-105 z-10'
                      : isRightMoved
                      ? 'bg-purple-500/30 text-purple-200 border-2 border-purple-300 ring-4 ring-purple-400/50 scale-105 z-10'
                      : isLeft
                      ? 'bg-sky-500/20 text-sky-300 border-2 border-sky-400 shadow-md shadow-sky-500/20'
                      : isRight
                      ? 'bg-purple-500/20 text-purple-300 border-2 border-purple-400 shadow-md shadow-purple-500/20'
                      : isInactive
                      ? 'bg-slate-900/40 text-slate-600 border border-slate-800/40 opacity-40'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  <span className={isFound ? 'text-black font-extrabold' : ''}>{val}</span>
                  <span className={`text-[10px] font-mono -mt-0.5 ${isFound ? 'text-black font-bold' : 'text-slate-400'}`}>
                    [{idx}]
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pointer Movement Focus Callout */}
      {curr.movedPointer !== 'none' && (
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="font-semibold text-slate-400">Pointer Action:</span>
          {curr.movedPointer === 'right' ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-[11px] font-medium">
              ◀ Moving Right Pointer inward: {curr.detail}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono text-[11px] font-medium">
              Moving Left Pointer inward ▶: {curr.detail}
            </span>
          )}
        </div>
      )}

      {/* Computation State Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Current Sum:</span>
          <span className="font-mono text-sm sm:text-base font-bold text-white">
            nums[{curr.left}] + nums[{curr.right}] ({array[curr.left]} + {array[curr.right]}) = <span className="text-amber-400">{curr.sum}</span>
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
            {curr.status === 'found' ? '✓ Solution Found' : curr.status === 'too-small' ? 'Sum < Target (Increment Left)' : 'Sum > Target (Decrement Right)'}
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
            aria-label="Previous step"
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
            aria-label="Next step"
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
