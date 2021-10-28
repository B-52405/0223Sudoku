var puzzle = new Array(9);
var solved_puzzle = new Array(9);

var lines = new Array(9);
var cols = new Array(9);
var boxes = new Array(9);
var lists = new Array(9);

function get_box_num(y, x) {
    return Math.floor(y / 3) * 3 + Math.floor(x / 3);
}

function remove(y, x) {
    var num = solved_puzzle[y][x];
    solved_puzzle[y][x] = 0;
    lines[y][num] = false;
    cols[x][num] = false;
    boxes[get_box_num(y, x)][num] = false;
}

function putin(y, x, num) {
    if (lines[y][num] || cols[x][num] || boxes[get_box_num(y, x)][num]) {
        return false;
    }
    if (solved_puzzle[y][x] != 0) {
        remove(y, x);
    }
    solved_puzzle[y][x] = num;
    lines[y][num] = true;
    cols[x][num] = true;
    boxes[get_box_num(y, x)][num] = true;
    return true;
}

function get_input(y, x) {
    return document.getElementById("input_".concat(y).concat(x));
}

function rand(num) {
    return Math.floor(Math.random() * num);
}

function attempt_random(y, x) {
    if (lists[y][x].length == 0) {
        lists[y][x] = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
    }
    for (var i = lists[y][x].length; i > 0; i--) {
        if (putin(y, x, lists[y][x].splice(rand(i), 1))) {
            return true;
        }
    }
    return false;
}

function get_sum() {
    return rand(18) + 36;
}

function sudoku() {
    var sum = get_sum();
    for (var i = 0; i < 9; i++) {
        puzzle[i] = new Array(9);
        solved_puzzle[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        lines[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        cols[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        boxes[i] = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        lists[i] = new Array(9);
        for (var j = 0; j < 9; j++) {
            lists[i][j] = new Array();
        }
    }

    var y = 0, x = 0;
    while (y < 9) {
        if (attempt_random(y, x)) {
            x++;
            if (x == 9) {
                x = 0;
                y++;
            }
        }
        else {
            remove(y, x);
            x--;
            if (x == -1) {
                x = 8;
                y--;
            }
        }
    }

    var rest = 81;
    for (i = 0; i < 81; i++) {
        y = Math.floor(i / 9);
        x = Math.floor(i % 9);
        var input_tem = get_input(y, x);
        if (rand(rest--) < sum) {
            puzzle[y][x] = 0;
            input_tem.value = "";
            input_tem.removeAttribute("readonly");
            sum--;
        }
        else {
            puzzle[y][x] = solved_puzzle[y][x];
            input_tem.value = puzzle[y][x];
            input_tem.setAttribute("readonly", "readonly");
        }
    }
}

function solve() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            puzzle[i][j] = solved_puzzle[i][j];
            var input_tem = get_input(i, j);
            input_tem.value = solved_puzzle[i][j];
            input_tem.style.color = "black";
        }
    }

}

function player_putin(y, x) {
    var value = get_input(y, x).value;
    if (value != 1 && value != 2 && value != 3 && value != 4 && value != 5 && value != 6 && value != 7 && value != 8 && value != 9) {
        value = 0;
        get_input(y, x).value = "";

    }
    puzzle[y][x] = value;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            get_input(i, j).style.color = "black";
        }
    }
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            var num = puzzle[i][j];
            if (num == 0) {
                continue;
            }
            for (var k = 1; k < 9; k++) {
                if (puzzle[(i + k) % 9][j] == num) {
                    get_input(i, j).style.color = "red";
                    get_input((i + k) % 9, j).style.color = "red";
                }
                if (puzzle[i][(j + k) % 9] == num) {
                    get_input(i, j).style.color = "red";
                    get_input(i, (j + k) % 9).style.color = "red";
                }
            }
            var y0 = Math.floor(i / 3) * 3 + 2, x0 = Math.floor(j / 3) * 3 + 2;
            for (var p = y0 - 2; p < y0; p++) {
                for (var q = x0 - 2; q < x0; q++) {
                    if (p != i || q != j) {
                        if (puzzle[p][q] == num) {
                            get_input(i, j).style.color = "red";
                            get_input(p, q).style.color = "red";
                        }
                    }
                }
            }
        }
    }
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            if (puzzle[i][j] == 0 || get_input(i, j).style.color == "red") {
                return;
            }
        }
    }
    alert("恭喜！解题成功！");
}

sudoku();