const Bacon = require("baconjs")


export default function flatUpdate(initial, ...patterns) {
  const updateBus  = new Bacon.Bus(),
    lazyUpdate = [updateBus, (state, update) => update(state)]

  const streams   = patterns.filter((_, i) => i % 2 === 0),
        callbacks = patterns.filter((_, i) => i % 2 !== 0).map(toUpdateHandler),
        args      = streams.map((_, i) => [streams[i], callbacks[i]]).reduce((memo, pair) => [...memo, ...pair], lazyUpdate)

  return Bacon.update(...[initial, ...args])

  function toUpdateHandler(cb) {
    if (cb instanceof Array) {
      if (cb.length !== 2) {
        throw new Error("Update pattern must be [Function<(state, ...args), Observable<A>>, Function<(state, A), state>")
      }
      return (state, ...args) => {
        const [fetch, resolve] = cb
        const result = fetch(state, ...args)
        if (result instanceof Bacon.Observable) {
          updateBus.plug(result.map(val => state => resolve(state, val)))
          return state
        } else {
          return result
        }
      }
    } else {
      return (state, ...args) => {
        const result = cb.apply(null, [state, ...args])
        if (result instanceof Bacon.Observable) {
          updateBus.plug(result.map(newState => () => newState))
          return state
        } else {
          return result
        }
      }
    }
  }
}
