import React, { useState, useRef, useEffect } from 'react';
import {
  Accessibility,
  Languages,
  Sun,
  Moon,
  LaptopMinimal,
  X,
  Check,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme, type Theme } from '../context/ThemeProvider';
import type { Language } from '../locales';

export const A11yMenu: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Outside Click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const languageOptions: Array<{
    code: Language;
    label: string;
    sublabel: string;
    flag: string;
  }> = [
    { code: 'en', label: 'English', sublabel: 'US / Global', flag: '🇺🇸' },
    { code: 'pt-BR', label: 'Português', sublabel: 'Brasil', flag: '🇧🇷' },
    { code: 'es', label: 'Español', sublabel: 'Hispanoamérica / España', flag: '🇪🇸' },
  ];

  const themeOptions: Array<{
    value: Theme;
    labelKey: 'themeSystem' | 'themeDark' | 'themeLight';
    Icon: typeof Sun;
  }> = [
    { value: 'dark', labelKey: 'themeDark', Icon: Moon },
    { value: 'light', labelKey: 'themeLight', Icon: Sun },
    { value: 'system', labelKey: 'themeSystem', Icon: LaptopMinimal },
  ];

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* A11y Icon Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={t('a11yPreferences')}
        title={t('a11yPreferences')}
        className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
          isOpen
            ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-md shadow-sky-500/20'
            : 'bg-[#161b22] text-slate-300 hover:text-white border-slate-800 hover:border-slate-700 hover:bg-slate-800'
        }`}
      >
        <Accessibility className="w-4 h-4 text-sky-400" />
      </button>

      {/* Preferences Popover Dropdown */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('a11yPreferences')}
          className="absolute right-0 mt-2 w-80 sm:w-88 bg-[#161b22] border border-slate-700/80 rounded-2xl p-4 shadow-2xl z-50 animate-fadeIn space-y-4 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Accessibility className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide">
                  {t('a11yPreferences')}
                </h3>
                <p className="text-[10px] text-slate-400">{t('a11yPreferencesDesc')}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={t('close')}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Interface Language */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Languages className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('language')}</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5" role="radiogroup" aria-label={t('language')}>
              {languageOptions.map(({ code, label, sublabel, flag }) => {
                const isSelected = language === code;
                return (
                  <button
                    key={code}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setLanguage(code)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition active:scale-[0.98] min-h-[44px] ${
                      isSelected
                        ? 'bg-sky-500/10 border-sky-500/40 text-white shadow-sm'
                        : 'bg-[#0d1117] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base" aria-hidden="true">
                        {flag}
                      </span>
                      <div className="text-left">
                        <div className="font-semibold text-white">{label}</div>
                        <div className="text-[10px] text-slate-400">{sublabel}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Appearance & Theme */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 pt-2">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('themeSection')}</span>
            </div>

            <div
              className="grid grid-cols-3 gap-1.5 bg-[#0d1117] p-1 rounded-xl border border-slate-800"
              role="radiogroup"
              aria-label={t('themeSection')}
            >
              {themeOptions.map(({ value, labelKey, Icon }) => {
                const isSelected = theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setTheme(value)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition active:scale-95 min-h-[44px] ${
                      isSelected
                        ? 'bg-slate-800 text-sky-400 font-bold shadow-sm border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[11px]">{t(labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
