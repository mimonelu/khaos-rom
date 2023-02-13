import adapter from "@sveltejs/adapter-static"
import autoprefixer from "autoprefixer"
import sveltePreprocess from "svelte-preprocess"

export default {
  kit: {
    paths: {
      base: process.argv.includes("dev") ? "" : "/khaos-rom",
    },
    adapter: adapter({
      pages: "docs",
      assets: "docs",
      fallback: "index.html",
      precompress: false,
      strict: !true,
      prerender: {
        enabled: false,
      },
      ssr: false,
    }),
    appDir: "app",
    files: {
      appTemplate: "src/index.html",
    },
  },
  preprocess: [
    sveltePreprocess({
      postcss: {
        plugins: [autoprefixer()],
      },
    }),
  ],
  // `a11y` is stands for `an eleven yellow shits 💩` .
  onwarn: (warning, handler) => {
    if ([
      // SEE: https://svelte.jp/docs#accessibility-warnings-a11y-click-events-have-key-events
      "a11y-click-events-have-key-events",
      "a11y-missing-content",
    ].includes(warning.code)) return
    handler(warning)
  },
}
