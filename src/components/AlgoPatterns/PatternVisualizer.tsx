import React, { useState, useEffect } from 'react';
import type { AlgoPattern, InteractiveStep } from '../../types/patterns';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PatternVisualizerProps {
  pattern: AlgoPattern;
}

export const PatternVisualizer: React.FC<PatternVisualizerProps> = ({ pattern }) => {
  const { t } = useLanguage();
  const presets = pattern.visualizerConfig.presets;
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activePreset = presets[selectedPresetIndex] || presets[0];
  const steps: InteractiveStep[] = activePreset.steps;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Reset step index when preset or pattern changes
  const [prevKey, setPrevKey] = useState(`${selectedPresetIndex}-${pattern.id}`);
  const currentKey = `${selectedPresetIndex}-${pattern.id}`;
  if (currentKey !== prevKey) {
    setPrevKey(currentKey);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  // Autoplay loop
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

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleTogglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      {/* Visualizer Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161b22] border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <label htmlFor="preset-select" className="text-xs font-semibold text-slate-300">
            {t('presetSelector')}
          </label>
          <select
            id="preset-select"
            value={selectedPresetIndex}
            onChange={e => setSelectedPresetIndex(Number(e.target.value))}
            className="bg-[#0d1117] border border-slate-700 text-sky-400 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
          >
            {presets.map((preset, idx) => (
              <option key={preset.id} value={idx}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Step Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-2">
            {t('stepCounter')} <strong className="text-white">{currentStepIndex + 1}</strong> {t('of')}{' '}
            {steps.length}
          </span>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            aria-label={t('prevStep')}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            aria-label={isPlaying ? t('pause') : t('play')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition active:scale-95 shadow-md shadow-sky-600/30 min-h-[36px]"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>{t('pause')}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{t('play')}</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex >= steps.length - 1}
            aria-label={t('nextStep')}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            aria-label={t('resetSimulation')}
            title={t('resetSimulation')}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition active:scale-95 min-h-[36px] min-w-[36px] flex items-center justify-center ml-1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Subtitle description */}
      <div className="text-xs text-slate-400 italic px-1">{activePreset.description}</div>

      {/* Dynamic Visual Stage Container */}
      <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 min-h-[260px] flex flex-col justify-center items-center relative overflow-hidden">
        {renderStage(pattern.visualizerConfig.type, activePreset, currentStep)}
      </div>

      {/* Step Explanation & Live State Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step Explanation (2 cols) */}
        <div className="md:col-span-2 bg-[#161b22] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('visualExplanation')}</span>
            <span className="text-slate-500 font-mono">({currentStep.label})</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {currentStep.description}
          </p>
        </div>

        {/* Live State Snapshot (1 col) */}
        <div className="bg-[#161b22] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('stateInspector')}</span>
          </div>
          <div className="bg-[#0d1117] border border-slate-800/80 rounded-lg p-3 text-xs font-mono text-emerald-400 overflow-x-auto max-h-36">
            <pre>{JSON.stringify(currentStep.stateSnapshot, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper: Custom Stage Renderers by Pattern Type
function renderStage(
  type: string,
  preset: { inputData: any },
  currentStep: InteractiveStep
) {
  const snapshot = currentStep.stateSnapshot;

  switch (type) {
    case 'two-pointers': {
      const arr: number[] = preset.inputData.array || [2, 7, 11, 15, 18, 21, 24];
      const leftIdx = snapshot.left;
      const rightIdx = snapshot.right;
      const isFound = snapshot.status === 'found';

      return (
        <div className="w-full flex flex-col items-center gap-6 py-4">
          <div className="flex flex-wrap justify-center gap-3">
            {arr.map((val, idx) => {
              const isLeft = idx === leftIdx;
              const isRight = idx === rightIdx;
              const isEliminated = idx < leftIdx || idx > rightIdx;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="h-6 flex items-center justify-center">
                    {isLeft && (
                      <span className="text-[10px] font-bold text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-400/40">
                        LEFT
                      </span>
                    )}
                    {isRight && !isLeft && (
                      <span className="text-[10px] font-bold text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-400/40">
                        RIGHT
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-base transition-all duration-300 ${
                      isFound && (isLeft || isRight)
                        ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300'
                        : isLeft
                        ? 'bg-sky-500/20 text-sky-300 border-2 border-sky-400'
                        : isRight
                        ? 'bg-purple-500/20 text-purple-300 border-2 border-purple-400'
                        : isEliminated
                        ? 'bg-slate-900/40 text-slate-600 border border-slate-800/40 opacity-30'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {val}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">i={idx}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <span>
              Target: <strong className="text-amber-400">{snapshot.target}</strong>
            </span>
            <span>•</span>
            <span>
              Current Sum:{' '}
              <strong className={isFound ? 'text-emerald-400' : 'text-sky-300'}>
                {snapshot.sum}
              </strong>
            </span>
            <span>•</span>
            <span
              className={`font-semibold ${
                isFound
                  ? 'text-emerald-400'
                  : snapshot.status === 'too-small'
                  ? 'text-sky-400'
                  : 'text-purple-400'
              }`}
            >
              {snapshot.status === 'found'
                ? 'MATCH FOUND!'
                : snapshot.status === 'too-small'
                ? 'Sum < Target (Move Left →)'
                : 'Sum > Target (← Move Right)'}
            </span>
          </div>
        </div>
      );
    }

    case 'sliding-window': {
      const s: string = preset.inputData.s || 'abcabcbb';
      const leftIdx = snapshot.left ?? 0;
      const rightIdx = snapshot.right ?? 0;

      return (
        <div className="w-full flex flex-col items-center gap-6 py-4">
          <div className="flex flex-wrap justify-center gap-2">
            {s.split('').map((char, idx) => {
              const inWindow = idx >= leftIdx && idx <= rightIdx;
              const isBoundary = idx === leftIdx || idx === rightIdx;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="h-5 flex items-center justify-center">
                    {idx === leftIdx && (
                      <span className="text-[9px] font-bold text-sky-400">L</span>
                    )}
                    {idx === rightIdx && idx !== leftIdx && (
                      <span className="text-[9px] font-bold text-emerald-400">R</span>
                    )}
                  </div>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg transition-all duration-300 ${
                      inWindow
                        ? isBoundary
                          ? 'bg-sky-500/20 text-sky-300 border-2 border-sky-400 shadow-md shadow-sky-500/20'
                          : 'bg-indigo-950/60 text-indigo-200 border border-indigo-500/40'
                        : 'bg-slate-900/40 text-slate-600 border border-slate-800/40 opacity-40'
                    }`}
                  >
                    {char}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5">{idx}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <span>
              Window Content:{' '}
              <strong className="text-sky-300">"{snapshot.window}"</strong>
            </span>
            <span>•</span>
            <span>
              Current Size: <strong className="text-indigo-400">{rightIdx - leftIdx + 1}</strong>
            </span>
            <span>•</span>
            <span>
              Max Length Seen: <strong className="text-emerald-400">{snapshot.maxLen}</strong>
            </span>
          </div>
        </div>
      );
    }

    case 'binary-search': {
      const arr: number[] = preset.inputData.array || [4, 5, 6, 7, 0, 1, 2];
      const left = snapshot.left ?? 0;
      const right = snapshot.right ?? arr.length - 1;
      const mid = snapshot.mid;

      return (
        <div className="w-full flex flex-col items-center gap-6 py-4">
          <div className="flex flex-wrap justify-center gap-2.5">
            {arr.map((val, idx) => {
              const isMid = idx === mid;
              const inRange = idx >= left && idx <= right;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="h-6 flex items-center justify-center">
                    {isMid && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-1 rounded border border-amber-400/40">
                        MID
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                      isMid
                        ? 'bg-amber-500 text-slate-950 scale-105 ring-2 ring-amber-300 shadow-lg shadow-amber-500/20'
                        : inRange
                        ? 'bg-slate-800 text-slate-100 border border-slate-600'
                        : 'bg-slate-900/30 text-slate-700 border border-slate-800/30 opacity-30 line-through'
                    }`}
                  >
                    {val}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">i={idx}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <span>
              Sorted Half:{' '}
              <strong className="text-sky-400 capitalize">{snapshot.sortedHalf || 'Evaluating'}</strong>
            </span>
            <span>•</span>
            <span>
              Discard Action:{' '}
              <strong className="text-rose-400 capitalize">{snapshot.discard || 'None'}</strong>
            </span>
          </div>
        </div>
      );
    }

    case 'stack-matching': {
      const stack: string[] = snapshot.stack || [];

      return (
        <div className="w-full flex flex-col items-center gap-6 py-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Current Character:</span>
            <span className="px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono text-base font-bold border border-indigo-500/40">
              {snapshot.char}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                snapshot.action === 'push'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              Action: {snapshot.action}
            </span>
          </div>

          {/* Stack Bucket */}
          <div className="flex flex-col-reverse items-center justify-start border-b-4 border-x-4 border-slate-700 rounded-b-xl w-36 min-h-[140px] p-2 gap-1.5 bg-slate-900/50">
            {stack.length === 0 ? (
              <span className="text-xs text-slate-600 italic py-8">Empty Stack</span>
            ) : (
              stack.map((item, idx) => (
                <div
                  key={idx}
                  className="w-full py-2 bg-indigo-600/30 border border-indigo-400/50 rounded text-center font-mono font-bold text-sky-300 text-sm animate-fadeIn"
                >
                  {item}
                </div>
              ))
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Top of Stack ↑</span>
        </div>
      );
    }

    case 'linked-list-reversal': {
      return (
        <div className="w-full flex flex-col items-center gap-6 py-4">
          <div className="flex items-center gap-4 font-mono text-sm">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-purple-400 font-bold uppercase">prev</span>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border-2 border-purple-400 text-purple-200 flex items-center justify-center font-bold">
                {snapshot.prevVal ?? 'None'}
              </div>
            </div>

            <span className="text-slate-600 text-xl font-bold">⇄</span>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-sky-400 font-bold uppercase">curr</span>
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 border-2 border-sky-400 text-sky-200 flex items-center justify-center font-bold">
                {snapshot.currVal ?? 'None'}
              </div>
            </div>

            <span className="text-slate-600 text-xl font-bold">→</span>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase">nxt</span>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-200 flex items-center justify-center font-bold">
                {snapshot.nextVal ?? 'None'}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 text-center max-w-md">
            Pointers rewire in-place: <code className="text-sky-300">curr.next = prev</code>, then slide{' '}
            <code className="text-purple-300">prev</code> and <code className="text-sky-300">curr</code>.
          </div>
        </div>
      );
    }

    case 'grid-bfs': {
      return (
        <div className="w-full flex flex-col items-center gap-4 py-2">
          <div className="flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span className="text-slate-300">Land ('1')</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-sky-950 border border-sky-700"></span>
              <span className="text-slate-300">Water / Sunk ('0')</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              Islands Count: <strong>{snapshot.currentIsland ?? 0}</strong>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5 p-3 bg-slate-950 rounded-xl border border-slate-800">
            {preset.inputData.grid?.map((row: string[], rIdx: number) =>
              row.map((val: string, cIdx: number) => {
                const isSunk = snapshot.sankCount && rIdx * 5 + cIdx < snapshot.sankCount;
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-9 h-9 rounded flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                      val === '1' && !isSunk
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-sky-950/80 text-sky-400/50 border border-sky-900/50'
                    }`}
                  >
                    {isSunk ? '0' : val}
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
    }

    case 'dp-coins': {
      const dpTable: Array<number | null> = snapshot.dpTable || [];

      return (
        <div className="w-full flex flex-col items-center gap-4 py-2 overflow-x-auto">
          <span className="text-xs text-slate-400 font-medium">
            1D Tabulation Table (dp[amount] = min coins)
          </span>

          <div className="flex gap-2">
            {dpTable.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-500 mb-1">amt={idx}</span>
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                    val !== null
                      ? 'bg-indigo-600/40 border-2 border-indigo-400 text-white shadow-md'
                      : 'bg-slate-900/60 border border-slate-800 text-slate-600'
                  }`}
                >
                  {val !== null ? val : '∞'}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            Current Subproblem: Amount <strong>{snapshot.currentAmount}</strong>
          </div>
        </div>
      );
    }

    case 'heap-topk': {
      const heap: number[] = snapshot.heap || [];

      return (
        <div className="w-full flex flex-col items-center gap-5 py-2">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>
              Inspecting Element: <strong className="text-amber-400">{snapshot.currentNum}</strong>
            </span>
            <span>•</span>
            <span>
              Min-Heap Root (Poorest VIP):{' '}
              <strong className="text-rose-400">{snapshot.root}</strong>
            </span>
          </div>

          {/* Heap array representation */}
          <div className="flex items-center gap-2">
            {heap.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 font-mono">
                  {idx === 0 ? 'ROOT' : `idx ${idx}`}
                </span>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-base border-2 ${
                    idx === 0
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300 ring-2 ring-rose-400/20'
                      : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  }`}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'prefix-sums': {
      return (
        <div className="w-full flex flex-col items-center gap-5 py-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <span>
              Running Cumulative Sum:{' '}
              <strong className="text-sky-300 text-sm">{snapshot.runningSum}</strong>
            </span>
            <span>•</span>
            <span>
              Valid Subarrays Found:{' '}
              <strong className="text-emerald-400 text-sm">{snapshot.matches}</strong>
            </span>
          </div>

          {/* Hash map inspection */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Prefix Map Frequency:</span>
            <div className="flex gap-2">
              {Object.entries(snapshot.map || {}).map(([sumVal, freq]) => (
                <div
                  key={sumVal}
                  className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono"
                >
                  <span className="text-slate-400">sum </span>
                  <strong className="text-white">{sumVal}</strong>
                  <span className="text-slate-500"> → </span>
                  <strong className="text-emerald-400">{String(freq)}×</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'lru-cache': {
      const list: string[] = snapshot.list || [];

      return (
        <div className="w-full flex flex-col items-center gap-5 py-2">
          <div className="flex items-center gap-3 overflow-x-auto max-w-full py-2">
            <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-400">
              [HEAD]
            </div>

            {list.map((node, idx) => (
              <React.Fragment key={idx}>
                <span className="text-slate-600 font-bold">⇄</span>
                <div className="px-3 py-2 rounded-xl bg-indigo-600/30 border-2 border-indigo-400 text-white font-mono text-xs font-bold shadow-md shadow-indigo-500/20">
                  {node}
                </div>
              </React.Fragment>
            ))}

            <span className="text-slate-600 font-bold">⇄</span>

            <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-400">
              [TAIL]
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span>
              Most Recently Used (MRU):{' '}
              <strong className="text-emerald-400">{snapshot.mruKey}</strong>
            </span>
            <span>•</span>
            <span>
              Least Recently Used (LRU):{' '}
              <strong className="text-rose-400">{snapshot.lruKey}</strong>
            </span>
            {snapshot.evicted && (
              <>
                <span>•</span>
                <span className="text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
                  Evicted Key: {snapshot.evicted}
                </span>
              </>
            )}
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="text-slate-400 text-xs">
          Interactive visualizer state ready for inspection.
        </div>
      );
  }
}
