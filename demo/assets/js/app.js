/* JavaScript for the Sudoku.js demo page
*/

// Selectors
var BOARD_SEL = "#sudoku-board";
var TABS_SEL = "#generator-tabs";
var PUZZLE_CONTROLS_SEL = "#puzzle-controls";
var SOLVER_CONTROLS_SEL = "#solver-controls";

// Boards
var boards = {
    "easy": null,
    "medium": null,
    "hard": null,
    "very-hard": null,
    "insane": null,
    "inhuman": null,
};

var build_board = function(){
    /* Build the Sudoku board
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
                    type: "text",
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
        e.preventDefault();
        var tab_name = get_tab();
        if(tab_name !== "import"){
            solve_puzzle(tab_name);
        }
    });
};

var solve_puzzle = function(puzzle){
    /* Solve the specified puzzle and show it
    */
    
    // Solve only if it's a valid puzzle
    if(typeof boards[puzzle] !== "undefined"){
        boards[puzzle] = sudoku.board_string_to_grid(
            sudoku.solve(
                sudoku.board_grid_to_string(
                    boards[puzzle]
                )
            )
        );
            
        // Display the solved puzzle, highlighting the added values
        display_puzzle(boards[puzzle], true);
    }
};

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
    init_tabs();
    init_controls();
    
    // Start with generating an easy puzzle
    click_tab("easy");
});