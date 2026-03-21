const express = require('express');
import { backupGameData, setGameData } from './gameState/savingAndLoading.js';
const app = express();
const port = 3000;
app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    if (req.method === 'GET') {
        res.sendFile(__dirname + '/static/index.html');
    }
}).post((req, res) => {
    setGameData(req.body.gameState);
});

app.get('/backup', (req, res) => {
    const output = backupGameData(req.body.gameState);
    res.download(output.filePath);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});