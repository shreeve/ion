import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'

// needed to support svelte-compact
import autoProcess from 'svelte-preprocess'
import stripIndent from 'strip-indent'
import { pug, coffee } from 'svelte-preprocess'

const pugCompiler = pug().markup
const coffeeCompiler = coffee().script

const production = !process.env.ROLLUP_WATCH

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
    file: 'public/bundle.js'
	},
	plugins: [
		svelte({

			// enable svelte-compact files, via an onBefore() handler
			preprocess: autoProcess({
				onBefore({ content, filename }) {
					const regex = /(?<=\n|^)(pug|coffee|stylus)([ \t]*.*?)(?:\n|$)([\s\S]*?)(\n(?=\S)|$)/g
					const types = {
						pug: 'template',
						coffee: 'script',
						stylus: 'style'
          }
					return content.replace(regex, function (data, lang, misc, body) {
						if (lang == "pug") { // workaround autoProcess bug
							return pugCompiler({content: stripIndent(body), filename}).code + "\n"
            } else if (lang == "coffee") { // enable "$:" support (the destiny operator), using "b ≈ a + 1" (b gets a + 1)
              body = body.replace(/^([ \t]*)\$:[ \t]*([$\w]+)[ \t]*=(\s*)/mg, "$1$2 ≈$3") // $: -> destiny
              data = coffeeCompiler({content: stripIndent(body), attributes: { lang: 'coffeescript' }, filename}) // compile
              data.code = data.code.replace(/^([ \t]*)([$\w]+)\(≈\(([\s\S]*?)\)\);/mg, "$1$$: $2 = $3") // destiny -> $:
              return `<script${misc}>\n${data.code}\n</script>\n` // final JS
						}
						return `<${types[lang]} lang='${lang}'${misc}>\n${body}</${types[lang]}>\n`
					})
				},
			}),

			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
        css.write('public/bundle.css')
      }
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve(),
		commonjs(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
    production && terser()
	],
	watch: {
		clearScreen: false
	}
}
