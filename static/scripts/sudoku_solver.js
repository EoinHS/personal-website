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

function reset_grid() {
    inputs.forEach((input) => {
        input.value = "";
    }) 
}

async function solve_sudoku() {

    var puzzle = "";

    inputs.forEach((input) => {
        puzzle += (input.value === "" ? 0 : input.value);
    });

    console.log(puzzle);

    const url = `http://localhost:8080/sudoku/solve/${puzzle}`;

    try {

        var response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        response.json().then((data) => {

            sudoku_solution = data.Solutions[0];

            for (var i = 0; i < inputs.length; i++) {
                inputs[i].value = sudoku_solution[i];
            }

        });

    } catch (e) {
        console.error(e);
    }
}

// Select elements
window.onload = (event) => {

    inputs = document.querySelectorAll('.sudoku-grid > div > input');
    error_message = document.querySelector('.error_message');
    inputs.forEach((input) => {
        input.addEventListener('input', limitInput);
    })

    document.querySelector('.reset-btn').addEventListener('click', reset_grid);
    document.querySelector('.solve-btn').addEventListener('click', solve_sudoku);

}