import { en, type TranslationKey } from './en';
import { ptBR } from './ptBR';
import { es } from './es';

export type Language = 'en' | 'pt-BR' | 'es';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en,
  'pt-BR': ptBR,
  es,
};

export type { TranslationKey };
