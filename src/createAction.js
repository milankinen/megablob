const Bacon = require("baconjs")

export default function createAction() {
  return process.browser ? createBrowserAction() : createNoopAction()
}

function createBrowserAction() {
  const bus = new Bacon.Bus()
  const action = value => bus.push(value)
  action.$ = bus
  return action
}

function createNoopAction() {
  const action = () => {
    console.warn(
      "Actions should be called only from browser.",
      "Nothing was dispatched"
    )
  }
  action.$ = Bacon.never()
  return action
}
