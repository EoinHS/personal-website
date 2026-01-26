var sudoku_puzzle = {} ;
var sudoku_solution = {};
var inputs = [];
var error_message = {};

// Values inside a square must be a number from 1 -> 9
function limitInput(e) {

    var number = parseInt(e.target.value);
    var value = e.target.value;

    if (!isNaN(value[1])) {
        e.target.value = value[1];
    } else if (isNaN(value[1])) {
        e.target.value = value[0];
    }
    if (isNaN(value[0])) {
        e.target.value = "";
    }
    if (number === 0) {
        e.target.value = "1";
    }

}

async function getNewSudoku(e) {

    const url = "http://localhost:8080/sudoku/new"

    try {

        var response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        response.json().then((data) => {

            sudoku_puzzle = data.Puzzle;
            sudoku_solution = data.Solution;

            for (var i = 0; i < inputs.length; i++) {
                if (sudoku_puzzle[i] != 0) {
                    inputs[i].value = sudoku_puzzle[i];
                    inputs[i].disabled = true;
                } else {
                    inputs[i].value = "";
                    inputs[i].disabled = false;
                }
                inputs[i].style.backgroundColor = '#ffffff';
            }

        })
        // Remove error message on successful request
        error_message.innerText = "";
    } catch (e) {
        // Log error and display to user
        console.error(e);
        error_message.innerText = "Oops! something went wrong, please try again later :)";
    }
}

function validateSudoku(e) {

    var solved = true;
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value != sudoku_solution[i]) {
            inputs[i].style.backgroundColor = "red";
            solved = false;
        }
    }
    if (solved) {
        window.alert("Correct!");
    }

}

// Select elements
window.onload = (event) => {

    inputs = document.querySelectorAll('.sudoku-grid > div > input');
    error_message = document.querySelector('.error_message');
    inputs.forEach((input) => {
        input.addEventListener('input', limitInput);
    })
    document.querySelector('.new-sudoku-btn').addEventListener('click', getNewSudoku);
    document.querySelector('.check-btn').addEventListener('click', validateSudoku);

    getNewSudoku();

}