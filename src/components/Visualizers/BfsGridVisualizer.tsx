import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Dices, Layers } from 'lucide-react';

interface GridStep {
  gridState: string[][];
  visited: boolean[][];
  currentCell: [number, number] | null;
  queueSnapshot: Array<[number, number]>;
  islandCount: number;
  message: string;
}

const DEFAULT_GRID = [
  ['1', '1', '0', '0', '0'],
  ['1', '1', '0', '1', '1'],
  ['0', '0', '0', '0', '0'],
  ['0', '1', '1', '0', '1'],
];

export const BfsGridVisualizer: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(DEFAULT_GRID);
  const [steps, setSteps] = useState<GridStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Toggle cell on user click
  const toggleCell = (r: number, c: number) => {
    if (isPlaying) return;
    const newGrid = grid.map((row, ri) =>
      row.map((val, ci) => (ri === r && ci === c ? (val === '1' ? '0' : '1') : val))
    );
    setGrid(newGrid);
  };

  const randomizeGrid = () => {
    const newGrid = grid.map(row =>
      row.map(() => (Math.random() > 0.6 ? '1' : '0'))
    );
    setGrid(newGrid);
  };

  // Compute BFS steps
  useEffect(() => {
    const rows = grid.length;
    const cols = grid[0].length;
    const workingGrid = grid.map(row => [...row]);
    const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
    const computedSteps: GridStep[] = [];
    let islandCount = 0;

    computedSteps.push({
      gridState: workingGrid.map(r => [...r]),
      visited: visited.map(r => [...r]),
      currentCell: null,
      queueSnapshot: [],
      islandCount: 0,
      message: 'Grid initialized. Click any cell to toggle Land (1) / Water (0), or press Play to run BFS.',
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (workingGrid[r][c] === '1' && !visited[r][c]) {
          islandCount++;
          const queue: Array<[number, number]> = [[r, c]];
          visited[r][c] = true;

          computedSteps.push({
            gridState: workingGrid.map(row => [...row]),
            visited: visited.map(row => [...row]),
            currentCell: [r, c],
            queueSnapshot: [...queue],
            islandCount,
            message: `Discovered new Island #${islandCount} at (${r}, ${c})! Push to queue and begin BFS expansion.`,
          });

          while (queue.length > 0) {
            const [currR, currC] = queue.shift()!;

            computedSteps.push({
              gridState: workingGrid.map(row => [...row]),
              visited: visited.map(row => [...row]),
              currentCell: [currR, currC],
              queueSnapshot: [...queue],
              islandCount,
              message: `Popped (${currR}, ${currC}) from queue. Inspecting 4 orthogonal neighbors (Up, Down, Left, Right).`,
            });

            const directions = [
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
            ];

            for (const [dr, dc] of directions) {
              const nr = currR + dr;
              const nc = currC + dc;
              if (
                nr >= 0 &&
                nr < rows &&
                nc >= 0 &&
                nc < cols &&
                workingGrid[nr][nc] === '1' &&
                !visited[nr][nc]
              ) {
                visited[nr][nc] = true;
                queue.push([nr, nc]);
              }
            }

            if (queue.length > 0) {
              computedSteps.push({
                gridState: workingGrid.map(row => [...row]),
                visited: visited.map(row => [...row]),
                currentCell: [currR, currC],
                queueSnapshot: [...queue],
                islandCount,
                message: `Enqueued adjacent unvisited land cells. Queue now contains: [${queue.map(q => `(${q[0]},${q[1]})`).join(', ')}].`,
              });
            }
          }
        }
      }
    }

    computedSteps.push({
      gridState: workingGrid.map(row => [...row]),
      visited: visited.map(row => [...row]),
      currentCell: null,
      queueSnapshot: [],
      islandCount,
      message: `BFS Traversal Finished! Total distinct islands found: ${islandCount}.`,
    });

    setSteps(computedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [grid]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, 1100);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  const curr = steps[currentStepIndex] || {
    gridState: grid,
    visited: Array.from({ length: grid.length }, () => Array(grid[0].length).fill(false)),
    currentCell: null,
    queueSnapshot: [],
    islandCount: 0,
    message: 'Starting BFS...',
  };

  return (
    <div className="bg-[#161b22] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Graph BFS Pattern
            </span>
            Number of Islands 2D Grid Traversal
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Click cells to toggle Land/Water, then step through BFS to observe connected component traversal.
          </p>
        </div>

        <button
          onClick={randomizeGrid}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
        >
          <Dices className="w-3.5 h-3.5" /> Randomize Grid
        </button>
      </div>

      {/* Grid Canvas */}
      <div className="py-6 px-4 bg-[#0d1117] rounded-xl border border-slate-800/80 flex flex-col items-center">
        <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}>
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isCurrent = curr.currentCell && curr.currentCell[0] === r && curr.currentCell[1] === c;
              const isVisited = curr.visited[r] && curr.visited[r][c];
              const isLand = val === '1';

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => toggleCell(r, c)}
                  className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center font-mono font-bold transition-all duration-300 relative ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 scale-105 z-10'
                      : isVisited
                      ? 'bg-emerald-600/30 text-emerald-300 border-2 border-emerald-500 shadow-md shadow-emerald-500/20'
                      : isLand
                      ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700 hover:bg-emerald-800/50 cursor-pointer'
                      : 'bg-slate-900/60 text-slate-600 border border-slate-800 hover:bg-slate-800/60 cursor-pointer'
                  }`}
                >
                  <span className="text-lg">{isLand ? '1' : '0'}</span>
                  <span className="text-[9px] font-normal opacity-60">
                    ({r},{c})
                  </span>
                </button>
              );
            })
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-900/60 border border-emerald-700" /> Land (1)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800" /> Water (0)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-400" /> Active BFS Node
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600/30 border border-emerald-500" /> Visited Island
          </div>
        </div>
      </div>

      {/* State & Queue Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Total Islands Counted:</div>
          <div className="font-mono text-xl font-bold text-emerald-400 mt-0.5">
            {curr.islandCount}
          </div>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800 md:col-span-2">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>BFS Queue:</span>
            <span className="font-mono">{curr.queueSnapshot.length} pending</span>
          </div>
          <div className="font-mono text-xs text-sky-300 mt-1 truncate">
            {curr.queueSnapshot.length > 0
              ? curr.queueSnapshot.map(c => `(${c[0]},${c[1]})`).join(' → ')
              : '(Empty Queue)'}
          </div>
        </div>
      </div>

      {/* Narrative Step Banner */}
      <div className="p-3.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-300 text-sm flex items-start gap-3">
        <Layers className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
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

        <div className="text-xs font-mono text-slate-500">Time: O(M × N) | Space: O(min(M, N))</div>
      </div>
    </div>
  );
};
