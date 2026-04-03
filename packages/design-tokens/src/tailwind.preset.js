import { designTokens } from "./tokens.js";

const preset = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: designTokens.colors.primary,
          deep: designTokens.colors.primaryDeep,
          accent: designTokens.colors.accent,
          secondary: designTokens.colors.secondary,
          surface: designTokens.colors.surface,
          ink: designTokens.colors.ink
        },
        neutral: designTokens.colors.neutral
      },
      borderRadius: {
        sm: designTokens.radius.sm,
        md: designTokens.radius.md,
        lg: designTokens.radius.lg,
        xl: designTokens.radius.xl
      },
      fontFamily: {
        sans: [designTokens.fonts.sans, "system-ui", "sans-serif"],
        arabic: [designTokens.fonts.arabic, designTokens.fonts.sans, "system-ui", "sans-serif"],
        heading: [designTokens.fonts.heading, "serif"]
      }
    }
  }
};

export default preset;
