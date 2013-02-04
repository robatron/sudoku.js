/* JavaScript for the Sudoku.js demo page
*/

// Selectors
var BOARD_SEL = "#sudoku-board";
var TABS_SEL = "#generator-tabs";
var PUZZLE_CONTROLS_SEL = "#puzzle-controls";
var SOLVER_CONTROLS_SEL = "#solver-controls";

// Boards
// TODO: Cache puzzles as strings instead of grids to cut down on conversions?
var boards = {
    "easy": null,
    "medium": null,
    "hard": null,
    "very-hard": null,
    "insane": null,
    "inhuman": null,
};

var build_board = function(){
    /* Build the Sudoku board markup
    
    TODO: Hardcode the result
    */
    for(var r = 0; r < 9; ++r){
        var $row = $("<tr/>", {});
        for(var c = 0; c < 9; ++c){
            var $square = $("<td/>", {});
            if(c % 3 == 2 && c != 8){
                $square.addClass("border-right");
            }
            $square.append(
                $("<input/>", {
                    id: "row" + r + "-col" + c,
                    class: "square",
                    maxlength: "9",
                    type: "text"
                })
            );
            $row.append($square);
        }
        if(r % 3 == 2 && r != 8){
            $row.addClass("border-bottom");
        }
        $(BOARD_SEL).append($row);
    }
};

var init_board = function(){
    /* Initialize board interactions
    */
    $(BOARD_SEL + " input.square").change(function(){
        /* Resize font size in each square depending on how many characters are
        in it.
        */
        var $square = $(this);
        var nr_digits = $square.val().length;
        var font_size = "40px";
        if(nr_digits === 3){
            font_size = "35px";
        } else if(nr_digits === 4){
            font_size = "25px";
        } else if(nr_digits === 5){
            font_size = "20px";
        } else if(nr_digits === 6){
            font_size = "17px";
        } else if(nr_digits === 7){
            font_size = "14px";
        } else if(nr_digits === 8){
            font_size = "13px";
        } else if(nr_digits >= 9){
            font_size = "11px";
        }
        $(this).css("font-size", font_size);
    });
    $(BOARD_SEL + " input.square").keyup(function(){
        /* Fire a change event on keyup, enforce digits
        */
        $(this).change();
    });

};

var init_tabs = function(){
    /* Initialize the Sudoku generator tabs
    */
    $(TABS_SEL + " a").click(function(e){
        e.preventDefault();
        var $t = $(this);
        var t_name = $t.attr("id");
        
        // If it's the import tab
        if(t_name === "import"){
        
        // Otherwise it's a normal difficulty tab
        } else {
            show_puzzle(t_name);
        }
        
        $t.tab('show');
    });
};

var init_controls = function(){
    /* Initialize the controls
    */
    $(PUZZLE_CONTROLS_SEL + " #refresh").click(function(e){
        /* Refresh the current puzzle
        */
        e.preventDefault();
        var tab_name = get_tab();
        if(tab_name !== "import"){
            show_puzzle(tab_name, true);
        }
    });
    
    $(SOLVER_CONTROLS_SEL + " #solve").click(function(e){
        /* Solve the current puzzle
        */
        e.preventDefault();
        var tab_name = get_tab();
        if(tab_name !== "import"){
            solve_puzzle(tab_name);
        }
    });
    
    $(SOLVER_CONTROLS_SEL + " #get-candidates").click(function(e){
        /* Get candidates for the current puzzle
        */
        e.preventDefault();
        var tab_name = get_tab();
        if(tab_name !== "import"){
            get_candidates(tab_name);
        }
    });
};

var solve_puzzle = function(puzzle){
    /* Solve the specified puzzle and show it
    */
    
    // Solve only if it's a valid puzzle
    if(typeof boards[puzzle] !== "undefined"){
        var solved_board = sudoku.board_string_to_grid(
            sudoku.solve(
                sudoku.board_grid_to_string(
                    boards[puzzle]
                )
            )
        );
            
        // Display the solved puzzle, highlighting the added values
        display_puzzle(solved_board, true);
    }
};

var get_candidates = function(puzzle){
    /* Get the candidates for the specified puzzle and show it
    */
    
    // Get candidates only if it's a valid puzzle
    if(typeof boards[puzzle] !== "undefined"){
        var candidates_board = sudoku.get_candidates(
            sudoku.board_grid_to_string(
                boards[puzzle]
            )
        );
            
        // Display the solved puzzle, highlighting the added values
        display_puzzle(candidates_board, true);
    }
}

var show_puzzle = function(difficulty, refresh){
    /* Show the puzzle of the specified difficulty. If the board has not been
    generated yet, generate a new one and save. Optionally, set `refresh` to 
    force a refresh of the specified puzzle.
    */
    
    // default refresh to false
    refresh = refresh || false;
    
    // If not a valid difficulty, default -> "easy"
    if(typeof boards[difficulty] === "undefined"){
        difficulty = "easy";
    }
    
    // If the board at the specified difficulty doesn't exist yet, or `refresh`
    // is set, generate a new one
    if(boards[difficulty] === null || refresh){
        boards[difficulty] = 
            sudoku.board_string_to_grid(sudoku.generate(difficulty));
    }
    
    // Display the puzzle
    display_puzzle(boards[difficulty]);
}

var display_puzzle = function(board, highlight){
    /* Display a Sudoku puzzle on the board, optionally highlighting the new
    values with green if `highlight` is set.
    */
    for(var r = 0; r < 9; ++r){
        for(var c = 0; c < 9; ++c){
            var $square = $(BOARD_SEL + " input#row" + r + "-col" + c);
            $square.removeClass("green-text");
            if(board[r][c] != sudoku.BLANK_CHAR){
                var board_val = board[r][c];
                var square_val = $square.val();
                if(highlight && board_val != square_val){
                    $square.addClass("green-text");
                }
                $square.attr("disabled", "disabled");
                $square.val(board_val);
            } else {
                $square.val('');
                $square.removeAttr("disabled");
            }
            // Fire off a change event on the square
            $square.change();
        }
    }
};

var get_tab = function(){
    /* Return the name of the currently-selected tab
    */
    return $(TABS_SEL + " li.active a").attr("id");
};

var click_tab = function(tab_name){
    /* Click the specified tab by name
    */
    $(TABS_SEL + " #" + tab_name).click();
};

// "Main" (document ready)
$(function(){
    build_board();
    init_board();
    init_tabs();
    init_controls();
    
    // Start with generating an easy puzzle
    click_tab("easy");
});