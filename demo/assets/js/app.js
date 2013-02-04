/* JavaScript for the Sudoku.js demo page
*/

// Selectors
var BOARD_SEL = "#sudoku-board";
var TABS_SEL = "#generator-tabs";
var CONTROLS_SEL = "#puzzle-controls";

// Boards
var boards = {
    easy: null,
    medium: null,
    hard: null,
    very_hard: null,
    insane: null,
    inhuman: null,
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
    /* Initialize the puzzle controls
    */
    $(CONTROLS_SEL + " #refresh").click(function(e){
        /* Refresh the current puzzle
        */
        e.preventDefault();
        var $selected_tab = $(TABS_SEL + " li.active a");
        var tab_name = $selected_tab.attr("id");
        if(tab_name !== "import"){
            show_puzzle(tab_name, true);
        }
    });
};

var show_puzzle = function(difficulty, refresh){
    /* Show the puzzle of the specified difficulty. If the board has not been
    generated yet, generate a new one and save. Optionally, set `refresh` to 
    force a refresh of the specified puzzle.
    */
    
    // default refresh to false
    refresh = refresh || false
    
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

var display_puzzle = function(board){
    /* Display a Sudoku puzzle on the board
    */
    for(var r = 0; r < 9; ++r){
        for(var c = 0; c < 9; ++c){
            var $square = $(BOARD_SEL + " input#row" + r + "-col" + c);
            if(board[r][c] != sudoku.BLANK_CHAR){
                $square.val(board[r][c]);
                $square.attr("disabled", "disabled");
            } else {
                $square.val('');
                $square.removeAttr("disabled");
            }
        }
    }
};

// "Main" (document ready)
$(function(){
    build_board();
    init_tabs();
    init_controls();
    
    // Start with generating an easy puzzle
    $(TABS_SEL + " #easy").click();
});