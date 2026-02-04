import express from 'express';
import path from 'path'
import fs from 'fs';

import { JavaCaller } from 'java-caller';
import { readdir, stat } from 'node:fs/promises';

const app = express();
const port = process.env.PORT || 8080;

const java = new JavaCaller({
    classPath: 'Jars/Sudoku_DL.jar',
    mainClass: 'org.example.Main',
    minimumJavaVersion: 25
})

await java.manageJavaInstall();

// view engine setup
app.set('views', path.join('./views'));
app.set('view engine', 'pug');

app.use(express.static(path.join('./static')));

async function new_sudoku() {
    const { status, stdout, stderr } = await java.run(['--generate', '--json']);
    return JSON.parse(stdout);
}

async function solve_sudoku(puzzle) {
    const { status, stdout, stderr } = await java.run(['--solve', puzzle, '--json']);
    return JSON.parse(stdout);
}

app.get('/', (req, res) => {
    res.render("home");
})

function register_route(route, filePath) {
    // remove file extension
    app.get(route, (req, res) => {
        res.render(filePath);
    })
    console.log("Route registered: " + route + " for path " + filePath);
}

// Registers a route to get each page contained in a dir
async function register_routes(dir, excluded_files) {
    // Get all files/directories in the dir
    // For each file, register a get route
    // For each subdirectory, call this function again
    var contents = await readdir(dir);
    for (const item of contents) {
        var current_dir = path.join(dir, item);
        var stats = await stat(current_dir);
        if (stats.isFile() && !excluded_files.includes(item)) {
            // remove extension
            // remove leading ./views
            var parsed_file = path.parse(current_dir);
            var subdirs = parsed_file.dir.split('/').slice(1); // all subdirectories but /views
            var route = `${subdirs.length > 0 ? '/' : ''}${subdirs.join('/')}/${parsed_file.name}` // construct route
            var filepath = `${subdirs.join('/')}${subdirs.length > 0 ? '/' : ''}${parsed_file.base}`
            register_route(route, filepath);
        } else if (stats.isDirectory()) {
            console.log("Searching subdir " + current_dir);
            register_routes(current_dir, excluded_files);
        }
    }
}

const excluded_files = ['layout.pug', 'sudoku-grid.pug'];

register_routes('views', excluded_files);

app.get('/sudoku/new', async (req, res) => {
    var new_sudoku_ = await new_sudoku();
    res.json(new_sudoku_);
})

app.get('/sudoku/solve/:puzzle', async (req, res) => {
    var puzzle_ = req.params.puzzle;
    var solved_sudoku_ = await solve_sudoku(puzzle_);

    console.log(solved_sudoku_);
    console.log();

    res.json(solved_sudoku_);
})


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})