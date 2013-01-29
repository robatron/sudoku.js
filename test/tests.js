/* Unit tests for sudoku.js
*/

// Solve
// =====
module('Solve');

test("Solve", function(){
    var puz1 = [
        "52...6.........7.13...........4..8..6......5...........418.........3."+
        ".2...87.....",
        "527316489896542731314987562172453896689271354453698217941825673765134"+
        "928238769145"
    ] 
    var puz2 = [
        "6.....8.3.4.7.................5.4.7.3..2.....1.6.......2.....5.....8."+
        "6......1....",
        "617459823248736915539128467982564371374291586156873294823647159791385"+
        "642465912738"
    ]
    var puz3 = [
        ".........9......84.623...5....6...453...1...6...9...7....1.....4.5..2"+
        "....3.8....9",
        "174589362953261784862347951219673845387415296546928173628194537495732"+
        "618731856429"
    ]
    var puz_unsolvable = 
        ".........9......84.623...5....6...453...1...6...9...7....1.....4.5..2"+
        "....3.8...99";
    var puz_too_big = 
        ".........9......84.623...5....6...453...1...6...9...7....1.....4.5..2"+
        "....3.8....91";
    var puz_invalid_chars = 
        ".........9......84.623...5....6...453...1...6...9...7....1.....4.5..2"+
        "....3.8..!.9";
    
    // Solve some hard puzzles
    ok(sudoku.solve(puz1[0]) === puz1[1], puz1[0] + " -> " + puz1[1]);
    ok(sudoku.solve(puz2[0]) === puz2[1], puz2[0] + " -> " + puz2[1]);
    ok(sudoku.solve(puz3[0]) === puz3[1], puz3[0] + " -> " + puz3[1]);
    
    // Try to solve an unsolvable puzzle
    ok(!sudoku.solve(puz_unsolvable), "Unsolvable");
    
    // Board too big
    throws(function(){sudoku.solve(puz_too_big)}, "Invalid board size");
    
    // Board has invalid character
    throws(function(){sudoku.solve(puz_invalid_chars)}, "Invalid characters");
});

test("Get candidates: ", function(){
    var puz = 
        "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.."+
        "...1.4......";
    var puz_candidates = {
        "A1": "4", "A2": "1679", "A3": "12679", "A4": "139", "A5": "2369",
        "A6": "269", "A7": "8", "A8": "1239", "A9": "5", "B1": "26789",
        "B2": "3", "B3": "1256789",  "B4": "14589", "B5": "24569",
        "B6": "245689", "B7": "12679", "B8": "1249", "B9": "124679", 
        "C1": "2689", "C2": "15689", "C3": "125689", "C4": "7", "C5": "234569",
        "C6": "245689", "C7": "12369", "C8": "12349", "C9": "123469",
        "D1": "3789", "D2": "2", "D3": "15789",  "D4": "3459", "D5": "34579",
        "D6": "4579", "D7": "13579", "D8": "6", "D9": "13789",  "E1": "3679",
        "E2": "15679", "E3": "15679", "E4": "359", "E5": "8", "E6": "25679", 
        "E7": "4", "E8": "12359", "E9": "12379", "F1": "36789", "F2": "4",
        "F3": "56789",  "F4": "359", "F5": "1", "F6": "25679", "F7": "23579",
        "F8": "23589", "F9": "23789",  "G1": "289", "G2": "89", "G3": "289",
        "G4": "6", "G5": "459", "G6": "3",  "G7": "1259", "G8": "7",
        "G9": "12489",
        "H1": "5", "H2": "6789", "H3": "3",  "H4": "2", "H5": "479", "H6": "1",
        "H7": "69", "H8": "489", "H9": "4689",  "I1": "1", "I2": "6789",
        "I3": "4", "I4": "589", "I5": "579", "I6": "5789",  "I7": "23569",
        "I8": "23589", "I9": "23689"
    }
    var puz_too_big = 
        ".........9......84.623...5....6...453...1...6...9...7....1.....4.5..2"+
        "....3.8....91";
    var puz_invalid_chars = 
        ".........9......84.623...5....6...453...1...6...9...7....1.....4.5..2"+
        "....3.8..!.9";
    
    // Get candidates for puzzle
    deepEqual(sudoku.get_candidates(puz), puz_candidates, puz);
    
    // Board too big
    throws(function(){sudoku.get_candidates(puz_too_big)}, 
            "Invalid board size");
    
    // Board has invalid character
    throws(function(){sudoku.get_candidates(puz_invalid_chars)}, 
            "Invalid characters");
});


// Square relationships
// ====================

module("Square relationships");

test("Get square -> vals map", function(){
    var puz = 
        "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.."+
        "...1.4......";
        
    deepEqual(sudoku._get_square_vals_map(puz), {
        "A1": "4", "A2": ".", "A3": ".", "A4": ".", "A5": ".", "A6": ".", 
        "A7": "8", "A8": ".", "A9": "5", "B1": ".", "B2": "3", "B3": ".", 
        "B4": ".", "B5": ".", "B6": ".", "B7": ".", "B8": ".", "B9": ".", 
        "C1": ".", "C2": ".", "C3": ".", "C4": "7", "C5": ".", "C6": ".", 
        "C7": ".", "C8": ".", "C9": ".", "D1": ".", "D2": "2", "D3": ".", 
        "D4": ".", "D5": ".", "D6": ".", "D7": ".", "D8": "6", "D9": ".", 
        "E1": ".", "E2": ".", "E3": ".", "E4": ".", "E5": "8", "E6": ".", 
        "E7": "4", "E8": ".", "E9": ".", "F1": ".", "F2": ".", "F3": ".", 
        "F4": ".", "F5": "1", "F6": ".", "F7": ".", "F8": ".", "F9": ".", 
        "G1": ".", "G2": ".", "G3": ".", "G4": "6", "G5": ".", "G6": "3", 
        "G7": ".", "G8": "7", "G9": ".", "H1": "5", "H2": ".", "H3": ".", 
        "H4": "2", "H5": ".", "H6": ".", "H7": ".", "H8": ".", "H9": ".", 
        "I1": "1", "I2": ".", "I3": "4", "I4": ".", "I5": ".", "I6": ".", 
        "I7": ".", "I8": ".", "I9": "."
    }, "Testing with medium puzzle");
    
    throws(function(){sudoku._get_square_vals_map("")}, 
            "Size squares/puzzle size mismatch")
});

test("Get square -> units map", function(){
    var rows = "ABCDEFGHI";
    var cols = "123456789";
    var squares = sudoku._cross(rows, cols);
    var units = sudoku._get_all_units(rows, cols);
    var square_units_map = sudoku._get_square_units_map(squares, units);

    // Check units for A1
    deepEqual(square_units_map["A1"], [
        ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"],
        ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1"],
        ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]
    ], "Units for A1");

    // Check units for E5
    deepEqual(square_units_map["E5"], [
        ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"],
        ["A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5", "I5"],
        ["D4", "D5", "D6", "E4", "E5", "E6", "F4", "F5", "F6"]
    ], "Units for E5");
});

test("Get square -> peers map", function(){
    var rows = "ABCDEFGHI";
    var cols = "123456789";
    var squares = sudoku._cross(rows, cols);
    var units = sudoku._get_all_units(rows, cols);
    var square_units_map = sudoku._get_square_units_map(squares, units);
    var square_peers_map = sudoku._get_square_peers_map(squares, 
            square_units_map);
            
    // Check peers for A1
    deepEqual(square_peers_map["A1"], [
        "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "B1", "C1", "D1", "E1", 
        "F1", "G1", "H1", "I1", "B2", "B3", "C2", "C3"],
    "Peers for A1");
    
    // Check peers for C2
    deepEqual(square_peers_map["C2"], [
        "C1", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "A2", "B2", "D2", "E2", 
        "F2", "G2", "H2", "I2", "A1", "A3", "B1", "B3"],
    "Peers for C2"); 
});

test("Get all units", function(){
    var rows = "ABCDEFGHI";
    var cols = "123456789";
    var all_units = sudoku._get_all_units(rows, cols);

    // Make sure we have exactly 27 units (9 rows + 9 columns + 9 boxes)
    equal(all_units.length, 27, "27 units");

    // Look for the first row unit
    deepEqual(all_units[0],
        ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"],
        "First row unit")

    // Look for the first col unit
    deepEqual(all_units[9],
        ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1"],
        "First col unit")

    // Look for the first box unit
    deepEqual(all_units[18],
        ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"],
        "First box unit")
});


// Utility
// =======
module("Utility");

test("Cross product", function(){

    // Simple case
    deepEqual(sudoku._cross('a','1'), ["a1"], "Simple case");

    // Classic case
    deepEqual(
        sudoku._cross("abc", "123"),
        ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"],
        "Classic case"
    );

    // Empty case
    deepEqual(sudoku._cross('',''), [], "Empty case");

    // Classic case with arrays
    deepEqual(
        sudoku._cross(['a', 'b', 'c'], [1, 2, 3]),
        ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"],
        "Classic case with arrays"
    );

    // Mismatched size
    deepEqual(
        sudoku._cross(['a', 'b', 'c'], [1, 2]),
        ["a1", "a2", "b1", "b2", "c1", "c2"],
        "Mismatched size"
    );

    // Empty default
    deepEqual(sudoku._cross(), [], "Empty arrays");
});

test("_in", function(){
    var seq = [1, 2, 3];
    var seq_string = "abc";
    
    // Normal
    ok(sudoku._in(1, seq), "Normal use case");
    ok(!sudoku._in(0, seq), "Normal use case (not)");
    
    // String
    ok(sudoku._in('a', seq_string), "String");
    ok(!sudoku._in('z', seq_string), "String (not)");
});
