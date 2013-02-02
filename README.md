Sudoku.js
==========

A Sudoku puzzle **generator** and **solver** JavaScript library.

Based on ["Solving Every Sudoku Puzzle"][1] by Peter Norvig, and 
Michael Anderson's [generator/solver][2].


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

    "easy":         61
    "medium":       52
    "hard":         43
    "very-hard":    34
    "insane":       25
    "inhuman":      17
    
    
You may also enter a custom number of squares to give, e.g.,

```javascript
>>> sudoku.generate(60)
"8941376521532687497269548...72.9158.538.4219..19.852..3874.69.52415793689658.34.."
```

The number of givens must be a number between 17 and 81 inclusive. If it's 
outside of that range, the number of givens will be set to the closest bound, 
e.g., 0 will be treated as 17, and 100 as81.


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

Board string to a grid:

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

Board grid to a string:

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

Get the candidates of every square, i.e., the possible values of each square:

```javascript
>>> sudoku.get_candidates(board)

{"A1":"1345678","A2":"135678","A3":"1346","A4":"9","A5":"13578",
"A6":"134578","A7":"14578","A8":"2","A9":"13457","B1":"12345789",
"B2":"1235789","B3":"12349","B4":"12358","B5":"123578",
"B6":"134578","B7":"145789","B8":"6","B9":"134579","C1":"12345789",
"C2":"1235789","C3":"12349","C4":"12358","C5":"123578","C6":"6",
"C7":"145789","C8":"13459","C9":"134579","D1":"1234789",
"D2":"123789","D3":"12349","D4":"12358","D5":"123589","D6":"13589",
"D7":"6","D8":"13459","D9":"1234579","E1":"1236789","E2":"1236789",
"E3":"5","E4":"12368","E5":"4","E6":"1389","E7":"1279","E8":"139",
"E9":"12379","F1":"123469","F2":"12369","F3":"123469","F4":"7",
"F5":"123569","F6":"1359","F7":"12459","F8":"8","F9":"123459",
"G1":"1569","G2":"1569","G3":"169","G4":"4","G5":"1569","G6":"2",
"G7":"3","G8":"7","G9":"8","H1":"123569","H2":"123569","H3":"8",
"H4":"1356","H5":"135679","H6":"13579","H7":"12459","H8":"1459",
"H9":"12459","I1":"12359","I2":"4","I3":"7","I4":"1358",
"I5":"13589","I6":"13589","I7":"1259","I8":"159","I9":"6"}
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

- ["Solving Every Sudoku Puzzle"][1] by Peter Norvig
- Michael Anderson's Python [generator/solver][2] for Mac OS X
- ["Sudoku"][3] on Wikipedia
- [95 Sudoku Puzzles][4]
- Andrew Stuart's [online Sudoku Solver][5]


[1]: http://norvig.com/sudoku.html
[2]: https://github.com/andermic/cousins/tree/master/sudoku
[3]: http://en.wikipedia.org/wiki/Sudoku
[4]: http://magictour.free.fr/top95
[5]: http://www.sudokuwiki.org/sudoku.htm
