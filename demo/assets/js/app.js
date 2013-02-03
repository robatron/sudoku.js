/* JavaScript for the Sudoku.js demo page
*/

// Selectors
var BOARD_SEL = "#sudoku-board";
var TABS_SEL = "#generator-tabs";

var build_board = function(){
    /* Build the Sudoku board
    */
    for(var r = 0; r < 9; ++r){
        var $row = $("<tr/>", {
            id: r,
            class: "row",
        });
        for(var c = 0; c < 9; ++c){
            var $square = $("<td/>", {});
            if(c % 3 == 2 && c != 8){
                $square.addClass("border-right");
            }
            $square.append(
                $("<input/>", {
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
        $(this).tab('show');
    });
    
    $(TABS_SEL + " #inhuman").click(function(e){
    });
};

// "Main" (document ready)
$(function(){
    build_board();
    init_tabs();
});