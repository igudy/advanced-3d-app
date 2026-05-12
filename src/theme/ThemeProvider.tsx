import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'advanced3d-ui-night'

type ThemeContextValue = {
  night: boolean
  setNight: (value: boolean) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}

function readStoredNight(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) === '1'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [night, setNightState] = useState(readStoredNight)

  useLayoutEffect(() => {
    if (night) {
      document.documentElement.dataset.ui = 'night'
    } else {
      delete document.documentElement.dataset.ui
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, night ? '1' : '0')
    } catch {
      /* ignore quota / private mode */
    }
    window.dispatchEvent(new CustomEvent('sport-theme'))
  }, [night])

  const setNight = useCallback((value: boolean) => {
    setNightState(value)
  }, [])

  const toggle = useCallback(() => {
    setNightState((n) => !n)
  }, [])

  const value = useMemo(
    () => ({
      night,
      setNight,
      toggle,
    }),
    [night, setNight, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
