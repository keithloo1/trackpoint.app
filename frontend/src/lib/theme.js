export const THEME_STORAGE_KEY = 'trackpoint-theme'

/** @returns {'light' | 'dark'} */
export function getStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    if (v === 'dark' || v === 'light') return v
  } catch {
    /* ignore */
  }
  return 'light'
}

/** @param {'light' | 'dark'} theme */
export function applyThemeClass(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

/** @param {'light' | 'dark'} theme */
export function persistTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}
