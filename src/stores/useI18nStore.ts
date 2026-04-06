import { create } from 'zustand';
import { en } from '@/src/i18n/en';
import { ko } from '@/src/i18n/ko';

export type Language = 'en' | 'ko';

interface I18nState {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  lang: 'ko',
  setLang: (lang) => set({ lang }),
}));

function resolvePath(dict: object, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = dict;
  for (const key of keys) {
    if (current === null || typeof current !== 'object' || !(key in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

export function useTranslation() {
  const lang = useI18nStore((state) => state.lang);
  const dict = lang === 'en' ? en : ko;

  /** 문자열 번역. 미경로일 경우 path 자체를 fallback으로 반환. */
  const t = (path: string, values?: Record<string, string | number>): string => {
    const resolved = resolvePath(dict, path);
    if (typeof resolved !== 'string') return path;

    if (!values) return resolved;
    return Object.entries(values).reduce(
      (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
      resolved,
    );
  };

  /** 배열 번역. 미경로이거나 배열이 아닐 경우 빈 배열 반환. */
  const tArray = (path: string): string[] => {
    const resolved = resolvePath(dict, path);
    if (!Array.isArray(resolved)) return [];
    return resolved.filter((item): item is string => typeof item === 'string');
  };

  return { t, tArray, lang, setLang: useI18nStore.getState().setLang };
}
