const test  = require("tape"),
      Bacon = require("baconjs")

const startApp = require("../src/startApp")


test("'startApp' throws an exception if it was called from nodejs context", t => {
  t.throws(() => {
    startApp({msg: "tsers"}, ({msg}) => Bacon.constant({msg}), () => {})
  })
  t.end()
})
