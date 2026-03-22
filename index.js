const express = require('express');
const fs = require('fs');
const path = require('path');
const { backupGameData, setGameState } = require('./gameState/savingAndLoading');
const app = express();
const port = 3000;

app.route('/').get( (req, res) => {
    res.set('Cache-Control', 'no-store'); // Add this line
    res.cookie('temp_uuid', '123e4567-e89b-12d3-a456-426614174000', {maxAge: 90000000, httpOnly: false, secure: false, sameSite: "lax", path: '/' }); // This is a temporary test UUID, replace with actual UUID generation logic later.
    fs.readFile(path.join(__dirname, 'static', 'index.html'), 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading index.html:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.send(data.toString());
    });
    
}).post((req, res) => {
    const gameState = setGameState(req.body.gameState);
    backupGameData(gameState);
    res.status(200).send({ success: true, message: "Game state received and processed." });
});



app.get('/backup', (req, res) => {
    const output = backupGameData(req.body.gameState);
    res.download(output.filePath);
});

app.use(express.static(__dirname + '/static'));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});