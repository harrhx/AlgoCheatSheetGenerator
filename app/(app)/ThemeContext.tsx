import React, { createContext, useContext, useState, useMemo } from "react";

type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  accent: string;
  inputBg: string;
  inputBorder: string;
  link: string;
  footerText: string;
  footerBg?: string;
};

const LIGHT_COLORS: ThemeColors = {
  background: "#f9fafb",
  card: "#fff",
  text: "#222",
  subtext: "#6b7280",
  accent: "#2563eb",
  inputBg: "#fff",
  inputBorder: "#e5e5e5",
  link: "#2563eb",
  footerText: "#a1a1aa",
  footerBg: "#111827",
};
const DARK_COLORS: ThemeColors = {
  background: "#18181b",
  card: "#23232b",
  text: "#f3f4f6",
  subtext: "#a1a1aa",
  accent: "#60a5fa",
  inputBg: "#23232b",
  inputBorder: "#333",
  link: "#60a5fa",
  footerText: "#6b7280",
  footerBg: "#030712",
};

type ThemeType = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  colors: ThemeColors;
}>({
  theme: 'light',
  setTheme: () => {},
  colors: LIGHT_COLORS,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('light');
  const colors = theme === "light" ? LIGHT_COLORS : DARK_COLORS;
  const value = useMemo(() => ({ theme, setTheme, colors }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
