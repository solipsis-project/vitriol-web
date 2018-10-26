// adapted from https://github.com/ngryman/reading-time

function ansiWordBound(c) {
  return (
    (' ' === c) ||
    ('\n' === c) ||
    ('\r' === c) ||
    ('\t' === c)
  )
}

export default function readingTime(text, options = { wpm: 200, wb: ansiWordBound }) {
  let words = 0
  let start = 0
  let end = text.length - 1
  const { wb, wpm } = options

  while (wb(text[start])) start++
  while (wb(text[end])) end--

  // number of words
  for (let i = start; i <= end;) {
    for (; i <= end && !wb(text[i]); i++) ;
    words++
    for (; i <= end && wb(text[i]); i++) ;
  }

  // stats
  const minutes = words / wpm
  const time = minutes * 60 * 1000
  const displayed = Math.ceil(minutes.toFixed(2))

  return {
    text: displayed + ' min read',
    minutes: minutes,
    time: time,
    words: words
  }
}