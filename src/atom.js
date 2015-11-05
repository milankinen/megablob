import Bacon from "baconjs"

export default function atom(initialValue) {
  const bus = new Bacon.Bus()
  const atom = bus.scan(initialValue, (state, fn) => fn(state))
  atom.reset = val => bus.push(_ => val)
  atom.swap = fn => bus.push(fn)
  return atom
}
