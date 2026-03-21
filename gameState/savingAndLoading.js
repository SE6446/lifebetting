const fs = require("fs");

/**
 * This module provides functions to save and load the game state to and from a JSON file.
 * gameState is expected to be a JSON object that represents the current state of the game, including player information, scores, and any other relevant data.
 * {
 *   "valueHistory": [float, float, float, float], // the history of the player's score at each update
 *   "timestamps": [int, int, int, int], // Unix timestamps for each instance the score was updated
 *   "strikePrice": float,
 *   "currentPrice": float,
 *   "timeRemaining": int, // Time remaining in seconds
 *   "numberOfShares": int,
 *   "potentialPayout": float,
 * }
 * 
 */

/**
 * 
 * @param {JSON} gameState 
 * @returns {Object} result of the save operation, including success status and message
 */
export function backupGameData(gameState) {
    // Convert the game state to a JSON string
    const gameStateJSON = JSON.stringify(gameState);
    
    const filePath = __dirname + '/gamedata/gameState.json';

    fs.writeFileSync(filePath, gameStateJSON, 'utf8');
    
    console.log("Game state saved successfully.");

    return { success: true, message: "Game state saved successfully.", filePath: filePath };
}

export function setGameState(receivedGameState) {
    try {
        const gameStateJSON =  JSON.stringify(receivedGameState);
        const gameState = JSON.parse(gameStateJSON);
        console.log("Game state loaded successfully.");
        return { success: true, message: "Game state loaded successfully.", gameState: gameState };
    } catch (error) {
        console.error("Error loading game state:", error);
        return { success: false, message: "Error loading game state.", error: error };
    }
}