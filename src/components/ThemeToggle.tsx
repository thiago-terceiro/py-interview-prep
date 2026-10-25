import React from 'react';
import { Sun, Moon, LaptopMinimal } from 'lucide-react';
import { useTheme, type Theme } from '../context/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions: Array<{
    value: Theme;
    label: string;
    Icon: typeof Sun;
  }> = [
    { value: 'system', label: 'System', Icon: LaptopMinimal },
    { value: 'dark', label: 'Dark', Icon: Moon },
    { value: 'light', label: 'Light', Icon: Sun },
  ];

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-xl border border-slate-800 bg-[#161b22] p-1"
      role="group"
      aria-label="Theme switcher"
    >
      {themeOptions.map(({ value, label, Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-label={label}
            aria-pressed={isActive}
            title={`Switch to ${label} theme`}
            className={`flex items-center justify-center p-1.5 rounded-lg text-xs transition-transform duration-75 active:scale-95 ${
              isActive
                ? 'bg-slate-800 text-sky-400 shadow-sm border border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        );
      })}
    </div>
  );
};
