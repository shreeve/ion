## ion

Ion is a test app based on [Svelte 3](https://svelte.dev/) ([:octocat:](https://github.com/sveltejs/svelte)).

A key element of Ion is that it uses the following technologies with Svelte:

* [CoffeeScript](https://coffeescript.org/)
* [Stylus](http://stylus-lang.com/)
* [Pug](https://pugjs.org/api/getting-started.html)

### Svelte SFC files

Svelte provides support for Single File Components, similar to that of [VueJS](https://vuejs.org/v2/guide/single-file-components.html). However, when using the above three languages (`coffee`, `stylus`, and `pug`), each of which is succinct and concise, it seems a little heavy to use the standard language tags to delimit the various components of Svelte SFC files. Instead, Ion uses an abbreviated version, called "Svelte Compact", that allows each component language in a Svelte SFC file to be specified on a line by itself, as follows:

```text
coffee
  export count = 100
  export name = null
  export foo = count

  # add 10 for every click
  click = -> count += 10
  foo ≈ count + 10000 # can also use "$: foo = ..." #!# NOTE: no need for COMPUTED VALUES!!!

  # add 100 every 3 seconds
  interval = setInterval () =>
    count += 100
  , 3000

stylus
  p
    color: blue

pug
  button(on:click="{click}")
    | Clicked {count} {count === 1 ? 'time' : 'times'}
  p Hello, {name}!
  p Foo is now... {foo}! Can you believe it?
```

### Tooling support

VS Code tooling support for the above is possible by adding a few lines to the syntax file from the standard Svelte VS Code extension.

The code required to support actually compiling the above Svelte Compact SFC files is possible by adding an `onBefore()` handler to the `rollup.config.js` file.

### The "destiny operator"

Svelte supports a "destiny operator", which is a beautifully elegant way to improve the idea of reactivity. Use of the destiny operator allows relationships between variables to be created, which have native reactivity, just like a spreadsheet. This creates a sort of "entanglement" among the variables, such that when one value changes, all dependencies are updated in an extremely performant and simple way.

There are two ways to use the destiny operator in Ion. The first is the standard `$:` Svelte prefix. The second is to use the `≈` ("approximates" or "follows") sigil. Both are shown here:

```
a = 10
b ≈ a + 1
```

```
a = 10
$: b = a + 1
```

### Run it yourself

```bash
yarn
yarn serve
```
