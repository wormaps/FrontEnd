import { create } from 'zustand';
import { en } from '../i18n/en';
import { ko } from '../i18n/ko';

type Language = 'en' | 'ko';

interface I18nState {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  lang: 'ko', // default to Korean
  setLang: (lang) => set({ lang }),
}));

export function useTranslation() {
  const lang = useI18nStore((state) => state.lang);
  const dict = lang === 'en' ? en : ko;

  const t = (path: string, values?: Record<string, string | number>) => {
    const keys = path.split('.');
    let current: any = dict;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        return path; // fallback
      }
      current = current[key];
    }
    
    let result = current as string;
    if (values) {
      Object.entries(values).forEach(([k, v]) => {
        result = result.replace(`{${k}}`, String(v));
      });
    }
    
    return result;
  };

  return { t, lang, setLang: useI18nStore.getState().setLang };
}
