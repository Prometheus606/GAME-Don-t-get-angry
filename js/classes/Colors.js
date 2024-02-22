/** 
 * This Class returns a Color Object, which contains the Colors for the Game
 * @param {Array} gameColors a set of 4 Colors for the Game
 * @param {Array} playerColors the colors for the players, 2 - 4 colors in an array
 * @returns An Color Object
*/
class Colors {
    constructor({gameColors, playerColors}) {

        // error handling, if the parameters are not clear
        if (gameColors.length !== 4) {
            throw new Error("You need to spezify a list of 4 Colors when you create a new Color Object!");
        } else if (playerColors.length <= 1 || playerColors.length > 4) {
            throw new Error("You need 2 - 4 player colors when you create a new Color Object!");
        }

        playerColors.forEach(playerColor => {
            if (gameColors.indexOf(playerColor) === -1) {
                throw new Error("Player Colors must be in the Game Colors!");
                
            }
        });

        // if no error, create the Color Object
        this.WHITE = "rgb(255, 255, 255)"
        this.BLACK = "rgb(0, 0, 0)"
        this.BACKGROUNDCOLOR = "rgb(239,224,129)"
        this.BORDERCOLOR = "rgb(255, 0, 0)"
        this.playerColors = playerColors
        this.gameColors = gameColors
        
        
        
    }
}