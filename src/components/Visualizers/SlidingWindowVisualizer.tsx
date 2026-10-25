import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

interface WindowStep {
  right: number;
  left: number;
  char: string;
  seenMap: Record<string, number>;
  duplicateFound: boolean;
  maxLen: number;
  message: string;
}

export const SlidingWindowVisualizer: React.FC = () => {
  const [inputString, setInputString] = useState<string>('abcabcbb');
  const [steps, setSteps] = useState<WindowStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const computedSteps: WindowStep[] = [];
    const seen: Record<string, number> = {};
    let left = 0;
    let maxLen = 0;

    for (let right = 0; right < inputString.length; right++) {
      const char = inputString[right];
      const isDuplicate = char in seen && seen[char] >= left;

      if (isDuplicate) {
        const oldPos = seen[char];
        left = oldPos + 1;
        seen[char] = right;
        const currentLen = right - left + 1;
        maxLen = Math.max(maxLen, currentLen);
        computedSteps.push({
          right,
          left,
          char,
          seenMap: { ...seen },
          duplicateFound: true,
          maxLen,
          message: `Duplicate '${char}' detected (previously at index ${oldPos}). Shrink left pointer to ${left}. Current window "${inputString.slice(left, right + 1)}" (len ${currentLen}).`,
        });
      } else {
        seen[char] = right;
        const currentLen = right - left + 1;
        maxLen = Math.max(maxLen, currentLen);
        computedSteps.push({
          right,
          left,
          char,
          seenMap: { ...seen },
          duplicateFound: false,
          maxLen,
          message: `Added '${char}' at index ${right}. All characters in window "${inputString.slice(left, right + 1)}" are unique (len ${currentLen}).`,
        });
      }
    }

    setSteps(computedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [inputString]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, 1300);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  const curr = steps[currentStepIndex] || {
    right: 0,
    left: 0,
    char: '',
    seenMap: {},
    duplicateFound: false,
    maxLen: 0,
    message: 'Starting sliding window...',
  };

  const sampleStrings = ['abcabcbb', 'pwwkew', 'abba', 'tmmzuxt'];

  return (
    <div className="bg-[#161b22] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs bg-sky-500/20 text-sky-400 border border-sky-500/40">
              Sliding Window Pattern
            </span>
            Longest Substring Without Repeating Characters
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing dynamic window expansion and contraction using a hash map of last seen indices.
          </p>
        </div>

        {/* Input String Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium">Select String:</label>
          <div className="flex gap-1.5">
            {sampleStrings.map(s => (
              <button
                key={s}
                onClick={() => setInputString(s)}
                className={`px-2.5 py-1 text-xs rounded font-mono font-medium transition ${
                  inputString === s
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                "{s}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* String Characters Track */}
      <div className="py-6 px-4 bg-[#0d1117] rounded-xl border border-slate-800/80 overflow-x-auto">
        <div className="flex justify-center items-center gap-2.5 min-w-[500px]">
          {inputString.split('').map((ch, idx) => {
            const inWindow = idx >= curr.left && idx <= curr.right;
            const isLeft = idx === curr.left;
            const isRight = idx === curr.right;
            const isCollision = curr.duplicateFound && isRight;

            return (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-500 mb-1">{idx}</span>
                <div
                  className={`w-12 h-14 rounded-lg flex flex-col items-center justify-center font-mono text-lg font-bold transition-all duration-300 relative ${
                    isCollision
                      ? 'bg-rose-500/20 text-rose-300 border-2 border-rose-500 shadow-lg shadow-rose-500/20 animate-pulse'
                      : inWindow
                      ? 'bg-sky-500/20 text-sky-200 border-2 border-sky-400 shadow-md shadow-sky-500/10'
                      : 'bg-slate-800/40 text-slate-500 border border-slate-800'
                  }`}
                >
                  {ch}
                  {isLeft && (
                    <span className="absolute -bottom-5 text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1 rounded border border-emerald-500/30">
                      L
                    </span>
                  )}
                  {isRight && !isLeft && (
                    <span className="absolute -bottom-5 text-[9px] font-bold text-sky-400 bg-sky-950/80 px-1 rounded border border-sky-500/30">
                      R
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* State & Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Current Window:</div>
          <div className="font-mono text-base font-bold text-sky-400 truncate mt-0.5">
            "{inputString.slice(curr.left, curr.right + 1)}"
          </div>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Window Length:</div>
          <div className="font-mono text-base font-bold text-white mt-0.5">
            {curr.right - curr.left + 1}
          </div>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Max Length So Far:</div>
          <div className="font-mono text-base font-bold text-emerald-400 mt-0.5">
            {curr.maxLen}
          </div>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Seen Map:</div>
          <div className="font-mono text-xs text-slate-300 truncate mt-1">
            {Object.entries(curr.seenMap)
              .map(([k, v]) => `${k}:${v}`)
              .join(' ')}
          </div>
        </div>
      </div>

      {/* Narrative Step Banner */}
      <div
        className={`p-3.5 rounded-lg border text-sm flex items-start gap-3 transition-colors ${
          curr.duplicateFound
            ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}
      >
        <AlertCircle
          className={`w-5 h-5 shrink-0 mt-0.5 ${curr.duplicateFound ? 'text-rose-400' : 'text-sky-400'}`}
        />
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
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-md shadow-sky-500/20"
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

        <div className="text-xs font-mono text-slate-500">Time Complexity: O(N) | Space: O(min(N, M))</div>
      </div>
    </div>
  );
};
