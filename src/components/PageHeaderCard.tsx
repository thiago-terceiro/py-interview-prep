import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface PageHeaderCardProps {
  badgeIcon: LucideIcon;
  badgeText: string;
  badgeColor?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Standardized, fixed-height Page Header Card across all pages in PyInterview Pro.
 * Fixed height (md:h-[148px]) prevents cumulative layout shift (CLS = 0) when switching routes.
 * Content that varies per page (search inputs, progress bars, track filters) is pushed down below this card.
 */
export const PageHeaderCard: React.FC<PageHeaderCardProps> = ({
  badgeIcon: BadgeIcon,
  badgeText,
  badgeColor = 'text-indigo-400',
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <header
      className={`bg-gradient-to-r from-indigo-950/40 via-[#0d1117] to-slate-900 border border-slate-800 px-6 sm:px-8 py-5 rounded-2xl relative overflow-hidden shadow-2xl min-h-[148px] md:h-[148px] flex flex-col md:flex-row md:items-center justify-between gap-4 w-full ${className}`}
    >
      <div className="max-w-3xl space-y-1.5 my-auto">
        <div className={`flex items-center gap-2 ${badgeColor} text-xs font-semibold tracking-wider uppercase`}>
          <BadgeIcon className="w-4 h-4 shrink-0" />
          <span>{badgeText}</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight leading-snug">
          {title}
        </h1>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {action && (
        <div className="shrink-0 flex items-center my-auto">
          {action}
        </div>
      )}
    </header>
  );
};
