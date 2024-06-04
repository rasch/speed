#!/usr/bin/env node
//                            _________
//    ______________________________  /
//   __  ___/__  __ \  _ \  _ \  __  /
//   _(__  )__  /_/ /  __/  __/ /_/ /
//   /____/ _  .___/\___/\___/\__,_/
//          /_/
// -------------------------------------
//    speed read text in the terminal
// -------------------------------------

import readline from "node:readline"

const rl = readline.createInterface({ input: process.stdin })
const wpm = process.argv[2] || 250
const startAtWord = process.argv[3] || 1
const speed = 60000 / wpm
const pad = " ".repeat(10)

const ansi = {
  red: "\u001b[31m",
  default: "\u001b[39m",
  clearRt: "\u001b[K",
  clearUp: "\u001b[1J",
  cursorOff: "\u001b[?25l",
  cursorOn: "\u001b[?25h",
  cursorHome: "\u001b[H",
}

let count = 0
let chars = 0
let history = []
let queue = []

// orp :: String -> Integer
const orp = word => word.length > 13 ? 4 : Math.round(word.length * 0.25)

// pieces :: Integer -> String -> [String, String, String]
const pieces = x => str => [str.slice(0, x), str[x], str.slice(x + 1)]

// display :: String -> String
const display = word => {
  const x = orp(word)
  const [p1, p2, p3] = pieces(x)(word)

  count += 1
  chars += word.length
  history = [...history, word].slice(-9)

  return `
    ${pad}|
    ${pad.slice(x)}${p1}${ansi.red}${p2}${ansi.default}${p3}${ansi.clearRt}
    ${pad}|\n`
}

// stats :: Date -> String
const stats = start => {
  const time = ((new Date()) - start) / 1000
  const truewpm = Math.round(count / (time / 60))

  return `${time}s, ${count} words, ${chars} chars, ${truewpm} true wpm\n`
}

rl.on("line", line => {
  queue = [...queue, ...line.split(/(?:-|\s)+/).filter(e => e)]
}).on("close", () => {
  let interval
  let start

  queue = queue.slice(startAtWord - 1)

  process.on("SIGINT", () => {
    const c1 = history.join(" ")
    const c2 = queue[0]
    const c3 = queue.slice(1, 11).join(" ")
    const context = `${c1} ${ansi.red}${c2}${ansi.default}\n${c3}\n\n`

    clearInterval(interval)

    process.stdout.write(
      ansi.cursorHome + display(queue.shift()) + context + stats(start) +
      `To resume from this point, pipe text into \`speed.js ${wpm} ${count}\`\n` +
      ansi.cursorOn
    )
  })

  if (queue.length) {
    process.stdout.write(
      ansi.cursorOff + ansi.clearUp + ansi.cursorHome + ansi.clearRt +
      display(queue.shift())
    )

    setTimeout(() => {
      start = new Date()
      interval = setInterval(() => {
        if (queue.length) {
          process.stdout.write(ansi.cursorHome + display(queue.shift()))
        } else {
          clearInterval(interval)
          process.stdout.write(stats(start) + ansi.cursorOn)
        }
      }, speed)
    }, 300)
  }
})
