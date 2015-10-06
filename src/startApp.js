
const memo = {}

export default function startApp(initialState, initStateP, onStateChange) {
  if (typeof initStateP !== "function" || typeof onStateChange !== "function") {
    throw new Error(
      "Invalid startApp usage, three arguments are needed: \n" +
      "  startApp([initialState], [(state) => property], [(state) => ()])>"
    )
  }

  if (!process.browser) {
    throw new Error("startApp can't be called from node.js environment")
  }

  let state = initialState
  if (memo.unsubscribe) {
    memo.unsubscribe()
    state = memo.lastState
  }

  memo.unsubscribe = initStateP(state).onValue(state => {
    try {
      memo.lastState = state
      onStateChange(state)
    } catch (e) {
      console.error("State change callback threw an unexpected error")
      console.error(e)
    }
  })

}
