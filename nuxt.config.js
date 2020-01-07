import pkg from "./package.json";

export default {
  mode: "universal",

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#3b8070" },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [{ src: "~/plugins/google-maps", ssr: true }],
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^vue2-google-maps($|\/)/]
  }
};
