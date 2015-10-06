const test = require("tape")

const createAction = require("../src/createAction")


test("'createAction' creates a proper action in browser environment", t => {
  process.browser = true
  const action = createAction()

  action.$
    .bufferWithCount(2)
    .onValue(([first, second]) => {
      t.equal(first, "a")
      t.equal(second, "b")
      t.end()
    })
  action("a")
  action("b")
})


test("'createAction' creates a no-op action in node environment", t => {
  delete process.browser
  const action = createAction()

  action.$.subscribe(event => {
    if (event.isEnd()) {
      t.ok("Stream end reached")
      t.end()
    } else {
      t.fail("Not expecting event", event)
    }
  })
  action("tsers")
})
