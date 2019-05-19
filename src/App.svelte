coffee
  export count = 100
  export name = null
  export foo = count

  # add 10 for every click
  click = -> count += 10
  foo « count + 10000 # can also use "$: foo = ..."

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
