Sudoku.js
==========

A Sudoku puzzle **generator** and **solver* JavaScript library.

Based on ["Solving Every Sudoku Puzzle"][1] by Peter Norvig, and 
Michael Anderson's [generator/solver][2].


Puzzles are represented by a string of digits, 1-9, and '.' as spaces. Each
character represents a square, e.g., 

    "52...6.........7.13...........4..8..6......5...........418.........3..2...87....."
    
Represents the following board:

    5 2 .   . . 6   . . .   
    . . .   . . .   7 . 1   
    3 . .   . . .   . . .   
    
    . . .   4 . .   8 . .   
    6 . .   . . .   . 5 .   
    . . .   . . .   . . .   
    
    . 4 1   8 . .   . . .   
    . . .   . 3 .   . 2 .   
    . . 8   7 . .   . . .


Usage:
------

**Generate** a board:

    >>> var board = sudoku.generate(17)
    
    "...9...2........6......6.........6....5.4.......7...8....4.2378..8.......47.....6"

**Solve** a board:

    >>> sudoku.solve(board)
    
    "136954827254178963789236145472385619815649732693721584561492378328567491947813256"

Get all candidates for every square:

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

Display a board to the console:

    >>> sudoku.display_board(board)
    
    . . .   9 . .   . 2 .   
    . . .   . . .   . 6 .   
    . . .   . . 6   . . .   
    
    . . .   . . .   6 . .   
    . . 5   . 4 .   . . .   
    . . .   7 . .   . 8 .   
    
    . . .   4 . 2   3 7 8   
    . . 8   . . .   . . .   
    . 4 7   . . .   . . 6 
    

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
