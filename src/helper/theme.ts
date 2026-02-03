import { writable } from 'svelte/store';

export type Theme = 'dark' | 'light';

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return 'dark';
};

export const theme = writable<Theme>(getInitialTheme());

theme.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', value);
    document.documentElement.classList.toggle('light', value === 'light');
  }
});
