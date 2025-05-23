// uno.config.ts
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),          // core utilities like Tailwind
    presetAttributify(),  // <div text="red-500" />
    presetIcons(),        // e.g. i-logos-react
  ],
})
