"use client"

import { ChakraProvider, defaultConfig, createSystem, defineTokens, defineSemanticTokens } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

const tokens = defineTokens({
  fontSizes: {
    sm: { value: '12px' },
    md: { value: '14px' },
  },
  cursor: {
    button: { value: "pointer" },
  },
})

const semanticTokens = defineSemanticTokens({
  colors: {
    lightGray: {
      solid: { value: "{colors.bg.emphasized}" },
      contrast: { value: "{colors.bg.emphasized}" },
      fg: { value: "{colors.bg.emphasized}" },
      muted: { value: "{colors.bg.emphasized}" },
      subtle: { value: "{colors.bg.emphasized}" },
      emphasized: { value: "{colors.bg.emphasized}" },
      focusRing: { value: "{colors.bg.emphasized}" },
    },
  },
})

export const system = createSystem(defaultConfig, {
  theme: { tokens, semanticTokens },
})

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
