import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, TrendingDown } from 'lucide-react';

interface GDStep {
  step: number;
  w: number;
  loss: number;
  gradient: number;
  message: string;
}

export const GradientDescentVisualizer: React.FC = () => {
  const [learningRate, setLearningRate] = useState<number>(0.2);
  const initialWeight = 5.5;
  const [steps, setSteps] = useState<GDStep[]>([]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Target objective function: L(w) = (w - 2.0)^2 + 1.0
  // Optimal w* = 2.0, min loss = 1.0
  // Gradient: dL/dw = 2 * (w - 2.0)
  const lossFunc = (w: number) => (w - 2.0) ** 2 + 1.0;
  const gradFunc = (w: number) => 2 * (w - 2.0);

  useEffect(() => {
    const computedSteps: GDStep[] = [];
    let w = initialWeight;
    const maxSteps = 15;

    for (let i = 0; i < maxSteps; i++) {
      const loss = lossFunc(w);
      const grad = gradFunc(w);
      const isConverged = Math.abs(grad) < 0.01;
      const isExploding = Math.abs(w) > 20;

      let msg = `Step ${i}: w = ${w.toFixed(3)}, Loss = ${loss.toFixed(3)}, Gradient = ${grad.toFixed(3)}.`;
      if (isConverged) {
        msg += ' Gradient near zero: Converged to local/global minimum!';
      } else if (isExploding) {
        msg += ' Exploding weight! Learning rate is too high, leading to divergence.';
      } else {
        msg += ` Updating w <- w - (${learningRate} * ${grad.toFixed(3)}).`;
      }

      computedSteps.push({
        step: i,
        w,
        loss,
        gradient: grad,
        message: msg,
      });

      if (isConverged || isExploding) break;
      w = w - learningRate * grad;
    }

    setSteps(computedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [learningRate, initialWeight]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  const curr = steps[currentStepIndex] || {
    step: 0,
    w: initialWeight,
    loss: lossFunc(initialWeight),
    gradient: gradFunc(initialWeight),
    message: 'Ready.',
  };

  // SVG coordinate transformation
  // Curve domain: w in [-1.5, 6.0], Loss in [0, 16]
  const svgWidth = 540;
  const svgHeight = 220;
  const wMin = -1.5;
  const wMax = 6.0;
  const lMin = 0.5;
  const lMax = 15.0;

  const toSvgX = (wVal: number) => ((wVal - wMin) / (wMax - wMin)) * (svgWidth - 60) + 30;
  const toSvgY = (lVal: number) => svgHeight - 25 - ((lVal - lMin) / (lMax - lMin)) * (svgHeight - 50);

  // Generate SVG path for quadratic curve
  const curvePoints: string[] = [];
  for (let x = wMin; x <= wMax; x += 0.2) {
    const y = lossFunc(x);
    curvePoints.push(`${toSvgX(x)},${toSvgY(y)}`);
  }
  const curvePath = `M ${curvePoints.join(' L ')}`;

  const currentSvgX = toSvgX(Math.max(wMin, Math.min(wMax, curr.w)));
  const currentSvgY = toSvgY(Math.max(lMin, Math.min(lMax, curr.loss)));

  return (
    <div className="bg-[#161b22] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/40">
              ML Optimization Pattern
            </span>
            Gradient Descent on Loss Curve
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Observe parameter updates w := w - α · ∇L(w). Adjust learning rate to see convergence vs oscillation.
          </p>
        </div>

        {/* Learning Rate Presets */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium">Learning Rate (α):</label>
          <div className="flex gap-1.5">
            {[0.08, 0.2, 0.6, 1.05].map(lr => (
              <button
                key={lr}
                onClick={() => setLearningRate(lr)}
                className={`px-2.5 py-1 text-xs rounded font-mono font-medium transition ${
                  learningRate === lr
                    ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lr} {lr > 1.0 ? '(Diverges)' : lr === 0.2 ? '(Optimal)' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive SVG Curve Canvas */}
      <div className="py-4 px-2 bg-[#0d1117] rounded-xl border border-slate-800/80 flex flex-col items-center">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[620px] h-auto overflow-visible">
          {/* Grid lines */}
          <line x1="30" y1={svgHeight - 25} x2={svgWidth - 30} y2={svgHeight - 25} stroke="#30363d" strokeWidth="1" />
          <line x1="30" y1="20" x2="30" y2={svgHeight - 25} stroke="#30363d" strokeWidth="1" />

          {/* Loss Curve */}
          <path d={curvePath} fill="none" stroke="#a855f7" strokeWidth="3" className="drop-shadow" />

          {/* Minimum Point Indicator */}
          <circle cx={toSvgX(2.0)} cy={toSvgY(1.0)} r="4" fill="#10b981" />
          <text x={toSvgX(2.0) - 25} y={toSvgY(1.0) + 18} fill="#10b981" fontSize="10" fontFamily="monospace">
            Min (w=2.0)
          </text>

          {/* Current Ball Position */}
          <circle
            cx={currentSvgX}
            cy={currentSvgY}
            r="8"
            fill="#38bdf8"
            stroke="#ffffff"
            strokeWidth="2"
            className="animate-pulse shadow-lg"
          />

          {/* Tangent Line Indicator */}
          <line
            x1={currentSvgX - 25}
            y1={currentSvgY + curr.gradient * 4}
            x2={currentSvgX + 25}
            y2={currentSvgY - curr.gradient * 4}
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
        </svg>

        <div className="flex items-center gap-5 text-xs text-slate-400 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-purple-500 rounded" /> Loss Curve L(w)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-white" /> Current Parameter w
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-b border-amber-400 border-dashed" /> Gradient Slope ∇L(w)
          </div>
        </div>

      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Current Parameter (w):</div>
          <div className="font-mono text-base font-bold text-sky-400 mt-0.5">
            {curr.w.toFixed(4)}
          </div>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Objective Loss:</div>
          <div className="font-mono text-base font-bold text-white mt-0.5">
            {curr.loss.toFixed(4)}
          </div>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Gradient (dL/dw):</div>
          <div className="font-mono text-base font-bold text-amber-400 mt-0.5">
            {curr.gradient.toFixed(4)}
          </div>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
          <div className="text-xs text-slate-400">Step Step Size (-α·g):</div>
          <div className="font-mono text-base font-bold text-purple-400 mt-0.5">
            {(-learningRate * curr.gradient).toFixed(4)}
          </div>
        </div>
      </div>

      {/* Narrative Step Banner */}
      <div className="p-3.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-300 text-sm flex items-start gap-3">
        <TrendingDown className="w-5 h-5 shrink-0 mt-0.5 text-purple-400" />
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
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition shadow-md shadow-purple-500/20"
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

        <div className="text-xs font-mono text-slate-500">Update Rule: w := w - α ∇L</div>
      </div>
    </div>
  );
};
