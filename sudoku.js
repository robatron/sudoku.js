/*
    Sudoku.js
    ---------

    A Sudoku puzzle generator and solver JavaScript library based on 
    "Solving Every Sudoku Puzzle" by Peter Norvig[1].

    Puzzles are represented by a string of digits, 1-9, and '.' as spaces. Each
    character represents a square, e.g., 
    
        "52...6.........7.13...........4..8..6......5...........418.........3."+
        ".2...87....."

    Usage:
    TODO: Complete this.
    
        >>> sudoku.solve()
        >>> sudoku.generate()
        >>> sudoku.get_candidates()

    Vocab:
    
        Square:
        Unit:
        Box:
        

    References:
        - Michael Anderson's Python implementation for Mac OS X[2]
        - "Sudoku" on Wikipedia[3]
        - 95 Sudoku Puzzles[4]
        - Andrew Stuart's online Sudoku Solver[5]
        
    [1]: http://norvig.com/sudoku.html
    [2]: https://github.com/andermic/cousins/tree/master/sudoku
    [3]: http://en.wikipedia.org/wiki/Sudoku
    [4]: http://magictour.free.fr/top95
    [5]: http://www.sudokuwiki.org/sudoku.htm
*/

(function(root){
    var sudoku = root.sudoku = {};  // Global reference to the sudoku library

    var DIGITS = "123456789";       // Allowed digits
    var ROWS = "ABCDEFGHI";         // Row lables
    var COLS = DIGITS;              // Column lables
    var SQUARES = null;             // Square IDs

    var UNITS = null;               // All units (row, column, or box)
    var SQUARE_UNITS_MAP = null;    // Squares -> units map
    var SQUARE_PEERS_MAP = null;    // Squares -> peers map

    var BLANK_CHAR = '.';           // How to represent a blank square

    // Init
    // -------------------------------------------------------------------------
    function initialize(){
        /* Initialize the Sudoku library (invoked after library load)
        */
        SQUARES             = sudoku._cross(ROWS, COLS);
        UNITS               = sudoku._get_all_units(ROWS, COLS);
        SQUARE_UNITS_MAP    = sudoku._get_square_units_map(SQUARES, UNITS);
        SQUARE_PEERS_MAP    = sudoku._get_square_peers_map(SQUARES, 
                                    SQUARE_UNITS_MAP);
    }

    // Generate
    // -------------------------------------------------------------------------
    sudoku.generate = function(nr_givens, unique){
        /* Generate a new Sudoku puzzle with `nr_givens` number of given 
        squares. By default, the puzzles are unique, uless you set `unique` to
        false.
        
        (Note: Puzzle uniqueness is not yet implemented.)
        */
        
        // Force nr_givens between 0 and 81 inclusive
        nr_givens = nr_givens < 0 ? 0 : (nr_givens > 81 ? 81: nr_givens);
        
        // Default unique to true
        // TODO: Implement uniqueness!
        unique = unique || true;
        
        // Get a set of squares and all possible candidates for each square
        var blank_board = "";
        for(var i = 0; i < 81; ++i){
            blank_board += '.';
        }
        var candidates = sudoku.get_candidates(blank_board);
        
        // For each item in a shuffled list of squares
        var shuffled_squares = sudoku._shuffle(SQUARES);
        for(var si in shuffled_squares){
            var square = shuffled_squares[si];
            
            // If an assignment of a random chioce causes a contradictoin, give
            // up and try again
            var rand_candidate_idx = 
                    sudoku._rand_range(candidates[square].length);
            var rand_candidate = candidates[square][rand_candidate_idx];
            if(!sudoku._assign(candidates, square, rand_candidate)){
                break;
            }
            
            // Make a list of all single candidates
            var single_candidates = [];
            for(var si in SQUARES){
                var square = SQUARES[si];
                
                if(candidates[square].length == 1){
                    single_candidates.push(candidates[square]);
                }
            }
            
            /*
            # If we have at least N values, and
                if len(ds) >= N and len(set(ds)) >= 8:
                    return ''.join(values[s] if len(values[s])==1 else '.' for s in squares)
            */
            // If we have at least nr_givens, and the unique candidate count is
            // at least 8, return the puzzle!
            if(single_candidates.length >= nr_givens && 
                    sudoku._strip_dups(single_candidates).length >= 8){
                var board = "";
                for(var si in SQUARES){
                    var square = SQUARES[si];
                    if(candidates[square].length == 1){
                        board += candidates[square];
                    } else {
                        board += BLANK_CHAR;
                    }
                }
                return board;
            }
        }
        
        // Give up and try a new puzzle
        return sudoku.generate(nr_givens);
    }

    // Solve
    // -------------------------------------------------------------------------
    sudoku.solve = function(board){
        /* Solve a sudoku puzzle given a sudoku `board`, i.e., an 81-character 
        string of digits, 1-9, and spaces identified by '.', representing the
        squares.
        */
        var result = sudoku._search(sudoku.get_candidates(board));
        if(result){
            var solution = "";
            for(var square in result){
                solution += result[square];
            }
            return solution;
        }
        return false;
    };

    sudoku.get_candidates = function(board){
        /* Get all possible candidates for each square as a map in the form
        {square: digits} using recursive constraint propagation.
        
        @throws errors if board is not 81 digits, or if those digits aren't 1-9 
            or '.'
            
        @returns `false` if a contradiction is encountered
        */
        
        var candidate_map = {}
        var squares_values_map = sudoku._get_square_vals_map(board);
        
        // Make sure we have a valid board, otherwise throw an error
        if(board.length !== 81){
            throw "Invalid board size. Expecting an 81-square board."
        }
        for(var v_i in board){
            var val = board[v_i];
            if(!sudoku._in(val, DIGITS) && val !== BLANK_CHAR){
                throw "Invalid board character encountered: " + val;
            }
        }
        
        // Start by assigning every digit as a candidate to every square
        for(var si in SQUARES){
            candidate_map[SQUARES[si]] = DIGITS;
        }
        
        // For each non-blank square, assign its value in the candidate map and
        // propigate.
        for(var square in squares_values_map){
            val = squares_values_map[square];
            
            if(sudoku._in(val, DIGITS)){
                var new_candidates = sudoku._assign(candidate_map, square, val)
                
                // Fail if we can't assign val to square
                if(!new_candidates){
                    return false;
                }
            }
        }
        
        return candidate_map;
    }

    sudoku._search = function(candidates){
        /* Given a map of squares -> candiates, using depth-first search, 
        recursively try all possible values until a solution is found, or false
        if no solution exists. 
        
        TODO: Implement recusion limit for unsolvable tests
        */
        
        // Return if error in previous iteration
        if(!candidates){
            return false;
        }
        
        // If only one candidate for every square, we've a solved puzzle!
        // Return the candidates map.
        var max_nr_candidates = 0;
        var max_candidates_square = null;
        for(var si in SQUARES){
            var square = SQUARES[si];
            
            var nr_candidates = candidates[square].length;
                
            if(nr_candidates > max_nr_candidates){
                max_nr_candidates = nr_candidates;
                max_candidates_square = square;
            }
        }
        if(max_nr_candidates === 1){
            return candidates;
        }
        
        // Choose the blank square with the fewest possibilities > 1
        var min_nr_candidates = 10;
        var min_candidates_square = null;
        for(si in SQUARES){
            square = SQUARES[si];
            
            nr_candidates = candidates[square].length;
            
            if(nr_candidates < min_nr_candidates && nr_candidates > 1){
                min_nr_candidates = nr_candidates;
                min_candidates_square = square;
            }
        }
        
        // Recursively search for each of the candidates of the square with the
        // fewest candidates. Return false if
        var candidates_next = [];
        for(var vi in candidates[min_candidates_square]){
            var val = candidates[min_candidates_square][vi];
            
            var candidates_copy = JSON.parse(JSON.stringify(candidates));
                    
            candidates_next.push(
                sudoku._search(
                    sudoku._assign(candidates_copy, min_candidates_square, val)
                )
            );
        }
        return sudoku._first_true(candidates_next);
    };

    sudoku._assign = function(candidates, square, val){
        /* Eliminate all values, *except* for `val`, from `candidates` at 
        `square` (candidates[square]), and propagate. Return the candidates map
        when finished. If a contradiciton is found, return false.
        
        WARNING: This will modify the contents of `candidates` directly.
        */

        // Grab a list of canidates without 'val'
        var other_vals = candidates[square].replace(val, "");

        // Loop through all other values and eliminate them from the candidates 
        // at the current square, and propigate. If at any point we get a 
        // contradiction, return false.
        for(var ovi in other_vals){
            var other_val = other_vals[ovi];

            var candidates_next =
                sudoku._eliminate(candidates, square, other_val);

            if(!candidates_next){
                //console.log("Contradiction found by _eliminate.");
                return false;
            }
        }

        return candidates;
    };

    sudoku._eliminate = function(candidates, square, val){
        /* Eliminate `val` from `candidates` at `square`, (candidates[square]),
        and propagate when values or places <= 2. Return updated candidates,
        unless a contradiction is detected, in which case, return false.
        
        WARNING: This will modify the contents of `candidates` directly.
        */

        // If `val` has already been eliminated from candidates[square], return
        // with candidates.
        if(!sudoku._in(val, candidates[square])){
            return candidates;
        }

        // Remove `val` from candidates[square]
        candidates[square] = candidates[square].replace(val, '');
           
        // If the square has only candidate left, eliminate that value from its 
        // peers
        var nr_candidates = candidates[square].length;
        if(nr_candidates === 1){
            var target_val = candidates[square];
            
            for(var pi in SQUARE_PEERS_MAP[square]){
                var peer = SQUARE_PEERS_MAP[square][pi];
                
                var candidates_new = 
                        sudoku._eliminate(candidates, peer, target_val);
                        
                if(!candidates_new){
                    return false;
                }
            }
        
        // Otherwise, if the square has no candidates, we have a contradiction.
        // Return false.
        } if(nr_candidates === 0){
            return false;
        }
        
        // If a unit is reduced to only one place for a value, then assign it
        for(var ui in SQUARE_UNITS_MAP[square]){
            var unit = SQUARE_UNITS_MAP[square][ui];
            
            var val_places = [];
            for(var si in unit){
                var unit_square = unit[si];
                if(sudoku._in(val, candidates[unit_square])){
                    val_places.push(unit_square);
                }
            }
            
            // If there's no place for this value, we have a contradition!
            // return false
            if(val_places.length === 0){
                return false;
                
            // Otherwise the value can only be in one place. Assign it there.
            } else if(val_places.length === 1){
                candidates_new = 
                    sudoku._assign(candidates, val_places[0], val);
                
                if(!candidates_new){
                    return false;
                }
            }
        }
        
        return candidates;
    };

    
    // Square relationships
    // -------------------------------------------------------------------------
    // Squares, and their relationships with values, units, and peers.
    
    sudoku._get_square_vals_map = function(board){
        /* Return a map of squares -> values
        */
        var squares_vals_map = {};
        
        // Make sure `board` is a string of length 81
        if(board.length != SQUARES.length){
            throw "Board/squares length mismatch.";
            
        } else {
            for(var i in SQUARES){
                squares_vals_map[SQUARES[i]] = board[i];
            }
        }
        
        return squares_vals_map;
    }

    sudoku._get_square_units_map = function(squares, units){
        /* Return a map of `squares` and their associated units (row, col, box)
        */
        var square_unit_map = {};

        // For every square...
        for(var si in squares){
            var cur_square = squares[si];

            // Maintain a list of the current square's units
            var cur_square_units = [];

            // Look through the units, and see if the current square is in it,
            // and if so, add it to the list of of the square's units.
            for(var ui in units){
                var cur_unit = units[ui];

                if(cur_unit.indexOf(cur_square) !== -1){
                    cur_square_units.push(cur_unit);
                }
            }

            // Save the current square and its units to the map
            square_unit_map[cur_square] = cur_square_units;
        }

        return square_unit_map;
    }

    sudoku._get_square_peers_map = function(squares, units_map){
        /* Return a map of `squares` and their associated peers, i.e., a set of
        other squares in the square's unit.
        */
        var square_peers_map = {};

        // For every square...
        for(var si in squares){
            var cur_square = squares[si];
            var cur_square_units = units_map[cur_square];

            // Maintain list of the current square's peers
            var cur_square_peers = [];

            // Look through the current square's units map...
            for(var sui in cur_square_units){
                var cur_unit = cur_square_units[sui];

                for(var ui in cur_unit){
                    var cur_unit_square = cur_unit[ui];

                    if(cur_square_peers.indexOf(cur_unit_square) === -1 && 
                            cur_unit_square !== cur_square){
                        cur_square_peers.push(cur_unit_square);
                    }
                }
            }
            
            // Save the current square an its associated peers to the map
            square_peers_map[cur_square] = cur_square_peers;
        }

        return square_peers_map;
    }
    
    sudoku._get_all_units = function(rows, cols){
        /* Return a list of all units (rows, cols, boxes)
        */
        var units = [];

        // Rows
        for(var ri in rows){
            units.push(sudoku._cross(rows[ri], cols));
        }

        // Columns
        for(var ci in cols){
           units.push(sudoku._cross(rows, cols[ci]));
        }

        // Boxes
        var row_squares = ["ABC", "DEF", "GHI"];
        var col_squares = ["123", "456", "789"];
        for(var rsi in row_squares){
            for(var csi in col_squares){
                units.push(sudoku._cross(row_squares[rsi], col_squares[csi]));
            }
        }

        return units;
    }
    

    // Utility
    // -------------------------------------------------------------------------

    sudoku.display_board = function(board){
        /* Display a sudoku `board` to the console.
        */
        var V_PADDING = " "; // Insert after each square
        var H_PADDING = '\n' // Insert after each row
        
        var V_BOX_PADDING = "  "; // Box vertical padding
        var H_BOX_PADDING = '\n'; // Box horizontal padding

        var display_string = "";
        
        for(var i in board){
            var square = board[i];
            
            // Add the square and some padding
            display_string += square + V_PADDING;
            
            // Vertical edge of a box, insert v. box padding
            if(i % 3 === 2){
                display_string += V_BOX_PADDING;
            }
            
            // End of a line, insert horiz. padding
            if(i % 9 === 8){
                display_string += H_PADDING;
            }
            
            // Horizontal edge of a box, insert h. box padding
            if(i % 27 === 26){
                display_string += H_BOX_PADDING;
            }
        }

        console.log(display_string);
    };

    sudoku._cross = function(a, b){
        /* Cross product of all elements in `a` and `b`, e.g.,
        sudoku._cross("abc", "123") ->
        ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"]
        */
        var result = [];
        for(var ai in a){
            for(var bi in b){
                result.push(a[ai] + b[bi]);
            }
        }
        return result;
    };
    
    sudoku._in = function(v, seq){
        /* Return if a value `v` is in sequence `seq`.
        */
        return seq.indexOf(v) !== -1;
    }
    
    sudoku._first_true = function(seq){
        /* Return the first element in `seq` that is true. If no element is
        true, return false.
        */
        for(var i in seq){
            if(seq[i]){
                return seq[i];
            }
        }
        return false;
    }

    sudoku._shuffle = function(seq){
        /* Return a shuffled version of `seq`
        */
        
        // Create an array of the same size as `seq` filled with false
        var shuffled = [];
        for(var i = 0; i < seq.length; ++i){
            shuffled.push(false);
        }
        
        for(var i in seq){
            var ti = sudoku._rand_range(seq.length);
            
            while(shuffled[ti]){
                ti = (ti + 1) > (seq.length - 1) ? 0 : (ti + 1);
            }
            
            shuffled[ti] = seq[i];
        }
        
        return shuffled;
    };

    sudoku._rand_range = function(max, min){
        /* Get a random integer in the range of `min` to `max` (non inclusive).
        If `min` not defined, default to 0. If `max` not defined, throw an 
        error.
        */
        min = min || 0;
        if(max){
            return Math.floor(Math.random() * (max - min)) + min;
        } else {
            throw "Range undefined";
            return false;
        }
    };

    sudoku._strip_dups = function(seq){
        /* Strip duplicate values from `seq`
        */
        var seq_set = [];
        var dup_map = {};
        for(var i in seq){
            var e = seq[i];
            if(!dup_map[e]){
                seq_set.push(e);
                dup_map[e] = true;
            }
        }
        return seq_set;
    };

    // Initialize library after load
    initialize();
    
})(this);