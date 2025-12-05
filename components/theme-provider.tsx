'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

interface Props extends ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: Props) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Pendant le SSR, on ne met pas de classe
  if (!mounted) return <>{children}</>

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
