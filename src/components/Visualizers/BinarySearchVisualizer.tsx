import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Target, ArrowDown } from 'lucide-react';

interface BSStep {
  low: number;
  mid: number;
  high: number;
  found: boolean;
  sortedHalf: 'left' | 'right';
  message: string;
}

const DEFAULT_ROTATED_ARRAY = [4, 5, 6, 7, 0, 1, 2];

export const BinarySearchVisualizer: React.FC = () => {
  const array = DEFAULT_ROTATED_ARRAY;
  const [target, setTarget] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [prevTarget, setPrevTarget] = useState<number>(target);

  if (target !== prevTarget) {
    setPrevTarget(target);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  const steps = useMemo<BSStep[]>(() => {
    const computedSteps: BSStep[] = [];
    let low = 0;
    let high = array.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const isLeftSorted = array[low] <= array[mid];

      if (array[mid] === target) {
        computedSteps.push({
          low,
          mid,
          high,
          found: true,
          sortedHalf: isLeftSorted ? 'left' : 'right',
          message: `Target ${target} found at index ${mid}! O(log N) search terminated.`,
        });
        break;
      }

      if (isLeftSorted) {
        // Left half [low..mid] is normally sorted
        if (array[low] <= target && target < array[mid]) {
          computedSteps.push({
            low,
            mid,
            high,
            found: false,
            sortedHalf: 'left',
            message: `Left half [${low}..${mid}] is sorted (${array[low]} <= ${array[mid]}). Target ${target} lies within [${array[low]}..${array[mid]}). Discard right half by setting high = ${mid - 1}.`,
          });
          high = mid - 1;
        } else {
          computedSteps.push({
            low,
            mid,
            high,
            found: false,
            sortedHalf: 'left',
            message: `Left half [${low}..${mid}] is sorted, but target ${target} is NOT in [${array[low]}..${array[mid]}). Search right half by setting low = ${mid + 1}.`,
          });
          low = mid + 1;
        }
      } else {
        // Right half [mid..high] is normally sorted
        if (array[mid] < target && target <= array[high]) {
          computedSteps.push({
            low,
            mid,
            high,
            found: false,
            sortedHalf: 'right',
            message: `Right half [${mid}..${high}] is sorted (${array[mid]} <= ${array[high]}). Target ${target} lies within (${array[mid]}..${array[high]}]. Discard left half by setting low = ${mid + 1}.`,
          });
          low = mid + 1;
        } else {
          computedSteps.push({
            low,
            mid,
            high,
            found: false,
            sortedHalf: 'right',
            message: `Right half [${mid}..${high}] is sorted, but target ${target} is NOT in (${array[mid]}..${array[high]}]. Discard right half by setting high = ${mid - 1}.`,
          });
          high = mid - 1;
        }
      }
    }

    if (computedSteps.length === 0 || !computedSteps[computedSteps.length - 1].found) {
      computedSteps.push({
        low,
        mid: Math.floor((low + high) / 2),
        high,
        found: false,
        sortedHalf: 'left',
        message: `low (${low}) > high (${high}): Target ${target} does not exist in array. Return -1.`,
      });
    }

    return computedSteps;
  }, [array, target]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= steps.length - 1) {
      const timer = setTimeout(() => setIsPlaying(false), 0);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  const curr = steps[currentStepIndex] || {
    low: 0,
    mid: 3,
    high: array.length - 1,
    found: false,
    sortedHalf: 'left',
    message: 'Starting binary search...',
  };

  return (
    <div className="bg-[#161b22] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs bg-violet-500/20 text-violet-400 border border-violet-500/40">
              Binary Search Pattern
            </span>
            Rotated Sorted Array Search
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Observe how binary search partitions a shifted array in $O(\log N)$ by identifying the sorted half.
          </p>
        </div>

        {/* Target Buttons */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium">Select Target:</label>
          <div className="flex gap-1.5">
            {[0, 6, 2, 3].map(t => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`px-2.5 py-1 text-xs rounded font-mono font-medium transition ${
                  target === t
                    ? 'bg-violet-500 text-slate-950 font-bold shadow-md shadow-violet-500/20'
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
            const isMid = idx === curr.mid;
            const isLow = idx === curr.low;
            const isHigh = idx === curr.high;
            const inActiveRange = idx >= curr.low && idx <= curr.high;
            const isFound = curr.found && isMid;

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Flags Header */}
                <div className="h-10 flex flex-col items-center justify-end">
                  {isMid && (
                    <div className="flex flex-col items-center animate-bounce">
                      <span className="text-[10px] font-bold text-violet-400 bg-violet-950/80 px-1.5 py-0.5 rounded border border-violet-400/40">
                        MID
                      </span>
                      <ArrowDown className="w-3.5 h-3.5 text-violet-400 -mt-0.5" />
                    </div>
                  )}
                </div>

                {/* Number Box */}
                <div
                  className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center font-mono text-base font-bold transition-all duration-300 relative ${
                    isFound
                      ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 scale-105'
                      : isMid
                      ? 'bg-violet-500/20 text-violet-300 border-2 border-violet-400 shadow-lg shadow-violet-500/20'
                      : inActiveRange
                      ? 'bg-slate-800 text-slate-200 border border-slate-700'
                      : 'bg-slate-900/30 text-slate-700 border border-slate-900 opacity-30 line-through'
                  }`}
                >
                  {val}
                  <span className="text-[10px] font-normal text-slate-500 -mt-0.5">[{idx}]</span>
                  {isLow && inActiveRange && (
                    <span className="absolute -bottom-5 text-[9px] font-bold text-sky-400 bg-sky-950/80 px-1 rounded border border-sky-500/30">
                      LOW
                    </span>
                  )}
                  {isHigh && inActiveRange && !isLow && (
                    <span className="absolute -bottom-5 text-[9px] font-bold text-amber-400 bg-amber-950/80 px-1 rounded border border-amber-500/30">
                      HIGH
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* State Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Search Window:</div>
          <div className="font-mono text-base font-bold text-white mt-0.5">
            [{curr.low} .. {curr.high}]
          </div>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Mid Index & Value:</div>
          <div className="font-mono text-base font-bold text-violet-400 mt-0.5">
            idx {curr.mid} = {array[curr.mid]}
          </div>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Sorted Partition:</div>
          <div className="font-mono text-base font-bold text-sky-400 mt-0.5 uppercase">
            {curr.sortedHalf} Half
          </div>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Target Value:</div>
          <div className="font-mono text-base font-bold text-emerald-400 mt-0.5">
            {target}
          </div>
        </div>
      </div>

      {/* Narrative Step Banner */}
      <div
        className={`p-3.5 rounded-lg border text-sm flex items-start gap-3 transition-colors ${
          curr.found
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}
      >
        <Target className={`w-5 h-5 shrink-0 mt-0.5 ${curr.found ? 'text-emerald-400' : 'text-violet-400'}`} />
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
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold text-xs transition shadow-md shadow-violet-500/20"
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

        <div className="text-xs font-mono text-slate-500">Time Complexity: O(log N) | Space: O(1)</div>
      </div>
    </div>
  );
};
