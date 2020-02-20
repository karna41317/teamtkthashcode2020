const fs = require('fs')
const os = require('os')
const path = require('path')

const readFile = require('./readFile')

const writeToFile = (fileName, result) => {
  const name = path.basename(fileName, '.txt')
  const outFolder = 'output'

  const writer = fs.createWriteStream(`${outFolder}/${name}.out`, {
    flags: 'w+',
  })

  const writeLine = txt => {
    writer.write(txt.toString())
    writer.write(os.EOL)
  }

  writeLine(result.nrOfLibs)
  for (let library of result.libraries) {
    writeLine(`${library.id} ${library.books.length}`)
    writeLine(library.books.join(' '))
  }

  writer.end()
}

const processEachFile = inputFileName => {
  const input = readFile(inputFileName)
  const { libraries } = input

  const orderedLibraries = [...libraries].sort((a, b) => {
    const firstSortCriteria = a.T - b.T
    if (!firstSortCriteria) {
      return b.M - a.M
    } else {
      return firstSortCriteria
    }
  })

  const orderedBook = arr => {
    const dic = {}

    for (let i = 0; i < arr.length; i++) {
      dic[i] = {
        val: arr[i],
        i,
      }
    }

    return dic
  }

  const result = {
    nrOfLibs: 0,
    libraries: {},
  }

  const createLib = lib => {
    const rLib = {
      id: lib.id,
      books: [],
    }
    result.libraries[lib.id] = rLib
    return rLib
  }

  const books = orderedBook(input.bookScores)
  const signedUpLibs = []
  let sigLib = orderedLibraries.shift()

  const processedBooks = []

  for (let i = 0; i < input.D; i++) {
    // console.info(`Curent day ${i}`)
    if (signedUpLibs.length) {
      for (let signed of signedUpLibs) {
        let rLib = result.libraries[signed.id]
        if (!rLib) {
          rLib = createLib(signed)
        }

        const notProcessdBooks = signed.bookIds
          .map(x => books[x])
          .sort((a, b) => b.val - a.val)

        for (let j = 0; j < signed.M && notProcessdBooks.length; j++) {
          const ub = notProcessdBooks.shift()
          const bkId = ub.i
          processedBooks.push(bkId)
          const index = signed.bookIds.indexOf(bkId)
          if (index > -1) {
            signed.bookIds.splice(index, 1)
          }
          rLib.books.push(bkId)
        }
      }
    }

    if (sigLib) {
      sigLib.T--
      if (!sigLib.T) {
        signedUpLibs.push(sigLib)
        sigLib = orderedLibraries.shift()
        result.nrOfLibs++
      }
    }
  }

  result.libraries = Object.values(result.libraries)
  writeToFile(inputFileName, result)
}

module.exports = processEachFile
