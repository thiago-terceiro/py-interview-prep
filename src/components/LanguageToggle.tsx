import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../locales';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languageOptions: Array<{
    code: Language;
    shortLabel: string;
    fullLabel: string;
    flag: string;
  }> = [
    { code: 'en', shortLabel: 'EN', fullLabel: 'English', flag: '🇺🇸' },
    { code: 'pt-BR', shortLabel: 'PT', fullLabel: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'es', shortLabel: 'ES', fullLabel: 'Español', flag: '🇪🇸' },
  ];

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-xl border border-slate-800 bg-[#161b22] p-1"
      role="group"
      aria-label={t('selectLanguage')}
    >
      <div className="pl-1.5 pr-1 text-slate-500 flex items-center justify-center" aria-hidden="true">
        <Languages className="w-3.5 h-3.5" />
      </div>
      {languageOptions.map(({ code, shortLabel, fullLabel }) => {
        const isActive = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-label={`Change language to ${fullLabel}`}
            aria-pressed={isActive}
            title={fullLabel}
            className={`min-h-[32px] px-2 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all duration-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
              isActive
                ? 'bg-slate-800 text-sky-400 shadow-sm border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            {shortLabel}
          </button>
        );
      })}
    </div>
  );
};
