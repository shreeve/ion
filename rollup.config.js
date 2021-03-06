import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'

import coffeePlugin from 'rollup-plugin-coffee-script'

// needed to support svelte-compact
import autoProcess from 'svelte-preprocess'
import { pug, coffeescript } from 'svelte-preprocess'
import stripIndent from 'strip-indent'

const pugCompiler = pug().markup
const coffeeCompiler = coffeescript().script

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/app.coffee',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js'
  },
  plugins: [
    coffeePlugin(),
    svelte({

      // enable svelte-compact files
      preprocess: [{
        markup({ content, filename }) {
          const regex = /(?<=\n|^)(pug|coffee|stylus)([ \t]*.*?)(?:\n|$)([\s\S]*?)(\n(?=\S)|$)/g
          const types = {
            pug: 'template',
            coffee: 'script',
            stylus: 'style'
          }
          const code = content.replace(regex, function (data, lang, misc, body) {

            // allow the destiny operator in CoffeeScript
            if (lang == "coffee") { // enable "$:" support (the destiny operator), using "b « a + 1" (b gets a + 1)
              body = body.replace(/^([ \t]*)\$:[ \t]*([$\w]+)[ \t]*=/mg, "$1$2 «") // $: -> destiny
              data = coffeeCompiler({ content: stripIndent(body), attributes: { lang: 'coffeescript' }, filename }) // compile
              data.code = data.code.replace(/^([ \t]*)([$\w]+)\(«\(([\s\S]*?)\)\);/mg, "$1$$: $2 = $3") // destiny -> $:
              return `<script${misc}>\n${data.code}\n</script>\n` // final JS
            }

            // wrap SFC sections in tags
            return `<${types[lang]} lang='${lang}'${misc}>\n${body}</${types[lang]}>\n`
          });

          return { code };
        }
      },
        autoProcess()
      ],

      // enable run-time checks when not in production
      dev: !production,

      // extract CSS to a file, better performance
      css: css => {
        css.write('public/bundle.css')
      }
    }),

    // external deps will probably need these plugins
    // See: https://github.com/rollup/rollup-plugin-commonjs
    resolve(),
    commonjs(),

    // live reload changes to 'public', unless in production
    !production && livereload('public'),

    // minify, if in production mode
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
}
