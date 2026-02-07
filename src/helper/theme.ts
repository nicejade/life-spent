import { writable, type Writable } from 'svelte/store';

const THEME_STORAGE_KEY = 'life-spent-theme';

// Detect system preference
function detectSystemTheme(): 'dark' | 'light' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

// Get initial theme from localStorage or system preference
function getInitialTheme(): 'dark' | 'light' {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch {
      // Ignore localStorage errors
    }
  }
  return detectSystemTheme();
}

// Create theme store
export const theme: Writable<'dark' | 'light'> = writable(getInitialTheme());

// Apply theme to document
function applyThemeToDocument(themeValue: 'dark' | 'light') {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('light', themeValue === 'light');
    document.documentElement.setAttribute('data-theme', themeValue);
  }
}

// Subscribe to theme changes
if (typeof window !== 'undefined') {
  theme.subscribe((value) => {
    applyThemeToDocument(value);
    
    try {
      localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch {
      // Ignore localStorage errors
    }
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const systemTheme = e.matches ? 'dark' : 'light';
    theme.update(() => systemTheme);
  });
}