const express = require('express');
var router = express.Router();

router.get('/sudoku', (req, res) => {
    res.render('sudoku');
})

module.exports = router;