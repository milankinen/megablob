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

### `createAction`

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

### `startApp`

    (state, Function<state,Property<state>>, Function<state,_>) => _

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

### `flatUpdate`

    flatUpdate :: (state, [Observable+, [Function<(state,args),Observable<A>>, Function<(state, A),newState>]]+) => Observable<state>

This function is the successor of **[Bacon.update](https://github.com/baconjs/bacon.js/#bacon-update)**.
It is fully backwards compatible with `Bacon.update` syntax but it also enables "2-stage" async state
updating by using two separate functions

1. The first function receives the current state and triggering event stream values.
It can returns an (asynchronous) stream.
2. The second function processes the values from the first stream and synchronously
returns the new state based on those values

Usage example:

```javascript
const stateP = flatUpdate(initialState,
 [event1S], (state, newState) => newState,                   // supports normal Bacon.update
 [event2S], (state, newState) => Bacon.later(100, newState)  // supports delayed state updating
 [event3S], [submitForm, handleSubmitResult]                 // supports 2-stage state updating
)
function submitForm(state, event) {
  return Bacon.later(1000, doSomethingWith(state, event))  // simulate "server"
}
function handleSubmitResult(state, resultFromServer) {
 return {...state, ...resultFromServer}   // resultFromServer === doSomething(state, event)
}
```

## License

MIT

## Contributing

Any important utility function/component missing that should be
included? Please raise an issue or create a pull request. All
contributions are welcome!
