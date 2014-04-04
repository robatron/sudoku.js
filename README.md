Sudoku.js
==========

A Sudoku puzzle **generator** and **solver** JavaScript library.

Check out the [online demo][demo] to see it in action.

Implementation ideas borrowed from
["Solving Every Sudoku Puzzle"][norvig-sudoku] by 
[Peter Norvig][norvig], and a [generator/solver][anderson-sudoku] by 
[Michael Anderson][anderson].

[demo]:http://htmlpreview.github.com/?https://github.com/robatron/sudoku.js/blob/master/demo/index.html

Intro
--------------------------------------------------------------------------------

Puzzles are represented by a string of digits, 1-9, and '.' as spaces. Each
character represents a square, e.g., 

    "52...6.........7.13...........4..8..6......5...........418.........3..2...87....."
    
Represents the following board:

    5 2 . | . . 6 | . . .   
    . . . | . . . | 7 . 1   
    3 . . | . . . | . . .   
    ------+-------+------
    . . . | 4 . . | 8 . .   
    6 . . | . . . | . 5 .   
    . . . | . . . | . . .   
    ------+-------+------
    . 4 1 | 8 . . | . . .   
    . . . | . 3 . | . 2 .   
    . . 8 | 7 . . | . . .

(See the included [converstion functions](#board-string-%E2%86%94-grid) to 
convert between string representations and grids, i.e., two-dimensional arrays.)


Generate a Sudoku puzzle
--------------------------------------------------------------------------------

Generage a Sudoku puzzle of a particular difficulty, e.g,

```javascript
>>> sudoku.generate("easy")
"672819345193..4862485..3197824137659761945283359...714.38..1426.174.6.38.463...71"

>>> sudoku.generate("medium")
"8.4.71.9.976.3....5.196....3.7495...692183...4.5726..92483591..169847...753612984"

>>> sudoku.generate("hard")
".17..69..356194.2..89..71.6.65...273872563419.43...685521......798..53..634...59."
```

Valid difficulties are as follows, and represent the number of given squares:

    "easy":         62
    "medium":       53
    "hard":         44
    "very-hard":    35
    "insane":       26
    "inhuman":      17
    
    
You may also enter a custom number of squares to give, e.g.,

```javascript
>>> sudoku.generate(60)
"8941376521532687497269548...72.9158.538.4219..19.852..3874.69.52415793689658.34.."
```

The number of givens must be a number between 17 and 81 inclusive. If it's 
outside of that range, the number of givens will be set to the closest bound, 
e.g., 0 will be treated as 17, and 100 as 81.


By default, the puzzles should have unique solutions, unless you set `unique` to
false, e.g., 

```javascript
sudoku.generate("easy", false)
```

Note: **Puzzle uniqueness is not yet implemented**, so puzzles are *not* 
guaranteed to have unique solutions.


Solve a Sudoku puzzle
--------------------------------------------------------------------------------

Solve a Sudoku puzzle given a Sudoku puzzle represented as a string, e.g.,

```javascript
>>> sudoku.solve(".17..69..356194.2..89..71.6.65...273872563419.43...685521......798..53..634...59.");
"217386954356194728489257136165948273872563419943712685521439867798625341634871592"
```


Board string ↔ grid
--------------------------------------------------------------------------------

Board string → grid:

```javascript
>>> sudoku.board_string_to_grid("23.94.67.8..3259149..76.32.1.....7925.321.4864..68.5317..1....96598721433...9...7")
[
    ["2","3",".","9","4",".","6","7","."],
    ["8",".",".","3","2","5","9","1","4"],
    ["9",".",".","7","6",".","3","2","."],
    ["1",".",".",".",".",".","7","9","2"],
    ["5",".","3","2","1",".","4","8","6"],
    ["4",".",".","6","8",".","5","3","1"],
    ["7",".",".","1",".",".",".",".","9"],
    ["6","5","9","8","7","2","1","4","3"],
    ["3",".",".",".","9",".",".",".","7"]
]
```

Board grid → string:

```javascript
>>> sudoku.board_grid_to_string([
    ["2","3",".","9","4",".","6","7","."],
    ["8",".",".","3","2","5","9","1","4"],
    ["9",".",".","7","6",".","3","2","."],
    ["1",".",".",".",".",".","7","9","2"],
    ["5",".","3","2","1",".","4","8","6"],
    ["4",".",".","6","8",".","5","3","1"],
    ["7",".",".","1",".",".",".",".","9"],
    ["6","5","9","8","7","2","1","4","3"],
    ["3",".",".",".","9",".",".",".","7"]
])
"23.94.67.8..3259149..76.32.1.....7925.321.4864..68.5317..1....96598721433...9...7"
```


Get candidates
--------------------------------------------------------------------------------

Get a grid of squares and their candidate values, propagating constraints, i.e.,
candidates restrict their peer candidates.

```javascript
>>> sudoku.get_candidates("4.25..389....4.265..523.147..1652.7.6..1945322543876915....3.1....4..9.....8....3")
[
    ["4",     "167",    "2",    "5",  "167",  "16",   "3",   "8",  "9"  ],
    ["13789", "13789",  "3789", "79", "4",    "189",  "2",   "6",  "5"  ],
    ["89",    "689",    "5",    "2",  "3",    "689",  "1",   "4",  "7"  ],
    ["389",   "389",    "1",    "6",  "5",    "2",    "48",  "7",  "48" ],
    ["6",     "78",     "78",   "1",  "9",    "4",    "5",   "3",  "2"  ],
    ["2",     "5",      "4",    "3",  "8",    "7",    "6",   "9",  "1"  ],
    ["5",     "246789", "6789", "79", "267",  "3",    "478", "1",  "468"],
    ["1378",  "123678", "3678", "4",  "1267", "156",  "9",   "25", "68" ],
    ["179",   "124679", "679",  "8",  "1267", "1569", "47",  "25", "3"  ]
]
```


Print a board to the console
----------------------------

```javascript
>>> sudoku.print_board(".17..69..356194.2..89..71.6.65...273872563419.43...685521......798..53..634...59.");
. 1 7   . . 6   9 . .   
3 5 6   1 9 4   . 2 .   
. 8 9   . . 7   1 . 6   

. 6 5   . . .   2 7 3   
8 7 2   5 6 3   4 1 9   
. 4 3   . . .   6 8 5   

5 2 1   . . .   . . .   
7 9 8   . . 5   3 . .   
6 3 4   . . .   5 9 .  
```   


References:
-----------

- ["Solving Every Sudoku Puzzle"][norvig-sudoku] by [Peter Norvig][norvig]
- Sudoku [generator/solver][anderson-sudoku] for Mac OS X by [Michael Anderson][anderson]
- [95 Sudoku Puzzles][95-sudokus]
- Andrew Stuart's [online Sudoku Solver][stuart-sudoku]


[norvig-sudoku]: http://norvig.com/sudoku.html
[anderson-sudoku]: https://github.com/andermic/cousins/tree/master/sudoku
[stuart-sudoku]: http://www.sudokuwiki.org/sudoku.htm
[95-sudokus]: http://magictour.free.fr/top95
[norvig]: http://norvig.com
[anderson]: https://github.com/andermic/



License:
--------

The MIT License (MIT)

Copyright (c) 2014 Rob McGuire-Dale

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
