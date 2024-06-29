import { create } from 'zustand';
import { theme } from 'antd';

interface ThemeStore {
  theme: 'light' | 'dark';
  algorithm: typeof theme.darkAlgorithm | typeof theme.defaultAlgorithm;
  init: () => void;
  switchTheme: () => void;
}

export const useTheme = create<ThemeStore>()((set) => {
  return {
    theme: 'dark',
    algorithm: theme.darkAlgorithm,
    init: () => set(() => {
      const currentTheme = window.localStorage.getItem('theme') as ThemeStore['theme'] ?? 'dark';

      return {
        theme: currentTheme,
        algorithm: currentTheme === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
      };
    }),
    switchTheme: () => set(state => {
      window.localStorage.setItem('theme', state.theme === 'dark' ? 'light' : 'dark');

      return {
        theme: state.theme === 'dark' ? 'light' : 'dark',
        algorithm: state.theme === 'dark' ? theme.defaultAlgorithm : theme.darkAlgorithm,
      };
    }),
  }
});
