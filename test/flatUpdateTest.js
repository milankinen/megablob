const Bacon = require("baconjs"),
      test  = require("tape")

const flatUpdate = require("../src/flatUpdate")

test("flatUpdate", suite => {

  suite.test("makes server integration easier", t => {
    const userS   = Bacon.once({name: "mla", status: "guest"}),
          submitS = Bacon.once({form: "login"})

    const stateP = flatUpdate({},
      [userS],    (state, user) => ({...state, user}),
      [submitS],  [loginToServer, handleLoginResponse]
    )

    stateP
      .changes()
      .bufferWithCount(3)
      .take(1)
      .onValue(states => {
        t.deepEqual(states, [
          { user: { name: "mla", status: "guest" } },  // after userS
          { user: { name: "mla", status: "guest" } },  // after loginToServer
          { user: { name: "mla", status: "member" } }  // after handleLoginResponse
        ])
        t.end()
      })

    function loginToServer() {
      //console.log("logging in user", state.user.name)
      return Bacon.later(100, {status: "ok"})
    }
    function handleLoginResponse(state, {status}) {
      const {user} = state
      return status === "ok" ? {...state, user: {...user, status: "member"}} : state
    }
  })

  suite.test("works with 'traditional' Bacon.update patterns and multi-stream patterns", t => {
    const ready = Bacon.later(300, 2),
          set   = Bacon.later(100, 1),
          go    = Bacon.later(200, 4)

    const stateP = flatUpdate(10,
      [ready, set, go],     [(_, r, s, g) => Bacon.later(100, r + s + g), (state, sum) => state + sum],
      [go.map(g => g + 1)], (state, g) => state - g
    )

    stateP
      .changes()
      .skipDuplicates()
      .bufferWithCount(2)
      .take(1)
      .onValue(([afterGo, afterAll]) => {
        t.equal(afterGo, 10 - (4 + 1))
        t.equal(afterAll, 10 - (4 + 1) + 2 + 1 + 4)
        t.end()
      })
  })

  suite.test("supports multi-value streams", t => {
    const times = Bacon.once(3)
    const stateP = flatUpdate([],
      [times], [(_, t) => Bacon.interval(10, "tsers").take(t), (state, s) => [...state, s]]
    )

    stateP
      .changes()
      .bufferWithCount(4)
      .take(1)
      .onValue(words => {
        t.deepEqual(words, [[], ["tsers"], ["tsers", "tsers"], ["tsers", "tsers", "tsers"]])
        t.end()
      })
  })

})
