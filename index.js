const express = require('express');
import { backupGameData, setGameData } from './gameState/savingAndLoading.js';
const app = express();
const port = 3000;
app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    res.cookie('temp_uuid', '123e4567-e89b-12d3-a456-426614174000', { httpOnly: true }); // This is a temporary test UUID, replace with actual UUID generation logic later.
    /**
     * To read, put in index.html:
     *  <script>
     * if (localStorage.getItem('user_uuid')) {
                console.log('UUID already exists in LocalStorage:', localStorage.getItem('user_uuid'));
            } else {
                console.log('No UUID found in LocalStorage. Attempting to read from cookie...');     *
                // A quick function to get a cookie by name
                const getCookie = (name) => {
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) return parts.pop().split(';').shift();
                }

                const uuid = getCookie('temp_uuid');
                if (uuid) {
                    localStorage.setItem('user_uuid', uuid);
                    console.log('UUID saved to LocalStorage!');
                }
            }
        </script>
     */
    res.sendFile(__dirname + '/static/index.html');
    
}).post((req, res) => {
    const gameState = setGameData(req.body.gameState).gameState;
    backupGameData(gameState);
    res.status(200).json({ success: true, message: "Game state loaded successfully." });
});

app.get('/backup', (req, res) => {
    const output = backupGameData(req.body.gameState);
    res.download(output.filePath);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});