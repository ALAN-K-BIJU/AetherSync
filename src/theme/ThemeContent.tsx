import React, { createContext, useContext, useMemo, useState } from 'react'
import { createTheme, ThemeProvider, CssBaseline, type PaletteMode } from '@mui/material'

interface ThemeContextProps {
  mode: PaletteMode
  toggleMode: () => void
}

const ColorModeContext = createContext<ThemeContextProps | undefined>(undefined)

export const useColorMode = () => {
  const context = useContext(ColorModeContext)
  if (!context) throw new Error('useColorMode must be used within ColorModeProvider')
  return context
}

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>('light')

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        typography: {
          fontFamily: 'Inter, Roboto, sans-serif',
        },
      }),
    [mode]
  )

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
