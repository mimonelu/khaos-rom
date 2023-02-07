import adapter from "@sveltejs/adapter-static"
import autoprefixer from "autoprefixer"
import sveltePreprocess from "svelte-preprocess"

export default {
  kit: {
    paths: {
      base: process.argv.includes("dev") ? "" : "/khaos",
    },
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "app.html",
      precompress: false,
      strict: true,
      prerender: {
        enabled: false,
      },
      ssr: false,
    })
  },
  preprocess: [
    sveltePreprocess({
      postcss: {
        plugins: [autoprefixer()],
      },
    }),
  ],
}
