coffee
  export count = 100
  export name = null

  # add 10 for every click
  click = -> count += 10

  # add 100 every 5 seconds
  interval = setInterval () =>
    count += 100
  , 5000

stylus
  p
    color: blue

pug
  button(on:click="{click}")
    | Clicked {count} {count === 1 ? 'time' : 'times'}
  p Hello, {name}!
