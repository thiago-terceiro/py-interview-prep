import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  badgeColor?: string;
  badgeBg?: string;
  count?: number;
}

export interface SlidingTabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
  pillClassName?: string;
  ariaLabel?: string;
}

/**
 * Reusable animated tab strip with a fast-sliding active container pill.
 * The active background pill physically and rapidly slides from one tab to the next.
 */
export function SlidingTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className = '',
  pillClassName = 'bg-slate-800 border-slate-700 shadow-md',
  ariaLabel = 'Tab navigation',
}: SlidingTabsProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<T, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });

  const updateIndicator = useCallback(() => {
    const activeEl = tabRefs.current.get(activeTab);
    const container = containerRef.current;
    if (activeEl && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeEl.getBoundingClientRect();
      setIndicator({
        left: tabRect.left - containerRect.left + container.scrollLeft,
        width: tabRect.width,
        ready: true,
      });
    }
  }, [activeTab]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, tabs]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    const timer = setTimeout(updateIndicator, 50);
    return () => {
      window.removeEventListener('resize', updateIndicator);
      clearTimeout(timer);
    };
  }, [updateIndicator]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className={`relative flex items-center gap-1.5 p-1 bg-[#161b22] border border-slate-800 rounded-xl overflow-x-auto scrollbar-none select-none ${className}`}
    >
      {/* Sliding Active Pill Container */}
      {indicator.ready && (
        <div
          aria-hidden="true"
          className={`absolute top-1 bottom-1 rounded-lg border pointer-events-none ${pillClassName}`}
          style={{
            transform: `translateX(${indicator.left - 4}px)`,
            width: `${indicator.width}px`,
            transition: 'transform 140ms cubic-bezier(0.2, 0, 0, 1), width 140ms cubic-bezier(0.2, 0, 0, 1)',
            willChange: 'transform, width',
          }}
        />
      )}

      {/* Tab Buttons */}
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
              else tabRefs.current.delete(tab.id);
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 shrink-0 ${
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${
                  tab.badgeColor || 'border-slate-700 text-slate-300'
                }`}
              >
                {tab.badge}
              </span>
            )}
            {tab.count !== undefined && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-slate-300">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
