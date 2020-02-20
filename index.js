const processEachFile = require('./src/solution')

const dataSets = [
  'a_example.txt',
  'b_read_on.txt',
  'c_incunabula.txt',
  'd_tough_choices.txt',
  'e_so_many_books.txt',
  'f_libraries_of_the_world.txt',
]

dataSets.map(x => processEachFile(x))
