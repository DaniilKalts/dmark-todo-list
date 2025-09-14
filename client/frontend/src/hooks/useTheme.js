import { useEffect, useState, useCallback } from 'react';

const THEME_KEY = 'theme';

export function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export default function useTheme(initial = getInitialTheme()) {
  const [theme, setTheme] = useState(initial);

  useEffect(() => {
    const body = document.body;
    if (theme === 'dark') body.classList.add('dark');
    else body.classList.remove('dark');

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, isDark: theme === 'dark', setTheme, toggle };
}
