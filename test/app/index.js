import React from "react"
import {render} from "react-dom"
import Bacon from "baconjs"
import {sum} from "lodash"

import {atom} from "megablob"
import {Combinator, combineVDOM, createComponent} from "megablob/react"


function init() {
  const counters = atom([atom(0)])
  const total =
    counters.flatMapLatest(Bacon.combineAsArray).map(sum)

  return Bacon.constant(
    <Combinator>
      <div>
        Total counters: {counters.map(".length")} (total: {total})<br />
        <button onClick={() => counters.swap(c => [...c, atom(0)])}>
          Add
        </button>
        {counters.map(c => c.map(renderCounter))}
      </div>
    </Combinator>
  )
}

const renderCounter = counter => {
  const step = atom(1)
  const incStep = step.map(s => _ => counter.swap(c => c + s))

  return (
    <Combinator>
      <div>
        <div>
          Counter {counter}
        </div>
        <button onClick={incStep}>
          Counter +{step}
        </button>
        <button onClick={() => step.swap(s => s + 1)}>
          Step ++
        </button>
      </div>
    </Combinator>
  )
}

const $app = document.getElementById("app")
init().onValue(app => render(app, $app))
