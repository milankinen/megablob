# MEGABLOB

Utilities for React + Bacon MEGABLOB development

[![npm version](https://badge.fury.io/js/megablob.svg)](http://badge.fury.io/js/megablob)
[![Build Status](https://travis-ci.org/milankinen/megablob.svg)](https://travis-ci.org/milankinen/megablob)


## Motivation

MEGABLOB architecture is awesome. However, there is some boilerplate
that must be written before the actual development can begin. This
project contains some essential utilities which can deal the
boilerplate and enable rapid development startup.

## Installation

You need to install this package, `react` and `baconjs`

    npm i --save react baconjs megablob

## Usage

MEGABLOB provides a set of functions / React components that can be
used by requiring the package

```javascript
const {<functions/components...>} = require("megablob")
```

## API

### `createAction :: () => fn`

Creates a new action that can be called as normal function taking
single argument. Internally this uses `Bacon.Bus` and `.push` and
binds the bus instance to the function so that no `bus.push.bind(bus)`
is needed.

In addition it detects the calling environment so that in `nodejs`
environment the returned functions are no-op, thus enabling some memory
and performance improvements (because no extra buses are created).

The underlying bus can be accessed by using `.$` member variable.

Usage:

```javascript
// actions.js
const {createAction} = require("megablob")
export const increment = createAction()

// state.js
const {increment} = require("./actions")
export default initState({counter = 0}) {
  return increment.$.map(1).scan(counter, (state, step) => state + step)
}

// component.js
const {increment} = require("./actions")
export default React.createClass({
  render() {
    return <button onClick={increment}>+</button>
  }
})
```

### `startApp :: (state, ((state) => property), ((state) =>)) => `

This function takes three arguments:

1. Initial state of the application
2. Function which takes state as an input value and returns "application state property" `Bacon.Property` (aka MEGABLOB)
3. Function which is called every time when the "application state" changes. The new state is given as a parameter

This function is meant to be used in the entry point of the browser
application (top level). It deals automatically the live reloading / hot
module replacement if such thing is used with Browserify/Webpack.

**ATTENTION**: At the moment only one `startApp` call per application
is supported!

Usage:

```javascript
// appState.js
export function appState(initialState = {}) {
  return Bacon.combineTemplate({
    ...init state...
  })
}

// entry.js
const {startApp} = require("megablob")
const appState = require("./appState")

startApp(window.INITIAL_STATE, appState, state => {
  React.render(<MyApp {...state} />, document.getElementById("app"))
})
```

## License

MIT

## Contributing

Any important utility function/component missing that should be
included? Please raise an issue or create a pull request. All
contributions are welcome!
