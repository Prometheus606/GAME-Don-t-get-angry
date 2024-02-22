
/** 
 * This Class returns an Game Object
 * @param {Object} positions a Position Object
 * @param {Object} colors a Color Object
 * @param {Number} gameBoard the Gameboard
 * @param {Object} canvas the Main Canvas
 * @param {Object} context the Main Canvas context
 * @returns An Game Object
*/
class Game {
    constructor({positions, gameBoard, colors, canvas, context}) {
        this.positions = positions
        this.colors = colors
        this.gameBoard = gameBoard
        this.canvas = canvas
        this.context = context

        
        this.mainLoop = this.mainLoop.bind(this)
        this.clickHandler = (event) => { this.chooseFigureClickEvent(event) };
        
        this.currentPlayer = {
            color: this.colors.playerColors[0],
            index: 0,
            diceNumber: 0,
            canRoll: true,
            canChooseFigure: false,
            canMove: false,
            isMoving: false,
        }
        
        //create all players and dices
        this.players = {}
        this.dices = {}
        for (let i = 0; i < this.colors.playerColors.length; i++) {
            const color = this.colors.playerColors[i];
        
            this.dices[color] = new Dice(color, this.colors, this.currentPlayer)
        
            this.players[color] = []
            for (let j = 0; j < this.positions.homePositions[color].length; j++) {
                const position = this.positions.homePositions[color][j];
                this.players[color].push(new Player({
                    color: color,
                    homePosition: {
                        x: position.x,
                        y: position.y
                    },
                    startPositionIndex: this.positions.startPositions[color],
                    positions: this.positions,
                    colors: this.colors,
                    patternSize: this.gameBoard.patternSize,
                    canvas: this.canvas,
                    context: this.context,
                }))  
            }
        
            
        }
        
        //show dice and player text from the current player
        this.dices[this.currentPlayer.color].show()
        for (const player of this.players[this.currentPlayer.color]) player.setText(this.currentPlayer.color.toUpperCase() + "'s turn!")
        
    }


    mainLoop() {
        window.requestAnimationFrame(this.mainLoop);
    
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.gameBoard.draw()
    
        for (const color in this.players) {
            for (const player of this.players[color]) {
                player.draw()
            }
        }

        this.checkForMultiplePlayers()
    
        if (this.currentPlayer.canChooseFigure) this.chooseFigure()

    
        if (this.currentPlayer.canMove) this.move()

    }

    /**
     * Handles the Players Movement
     */
    async move() {
        const player = this.players[this.currentPlayer.color][this.currentPlayer.index]
        if (player.position === player.homePosition  && this.currentPlayer.diceNumber !== 6) {
            // do nothing
        } else if (player.position === player.homePosition  && this.currentPlayer.diceNumber === 6) {
            player.leaveHome()
        } else {
            await player.move(this.currentPlayer)
        }
    
        this.currentPlayer.canMove = false
        this.currentPlayer.canRoll = true

        //check, if the currentplayer beat another player
        for (const color in this.players) {
            for (const otherPlayer of this.players[color]) {

                if (player === otherPlayer) {
                    // do nothing
                } else if (player.position === otherPlayer.position) {
                    if (player.color !== otherPlayer.color && otherPlayer.position !== this.positions.path[otherPlayer.startPositionIndex] && otherPlayer.position !== this.positions.path[player.startPositionIndex]) {
                        console.log(player.positionIndex, player.startPositionIndex);
                        //beated another player
                        console.log("Beatet!!!");
                        await otherPlayer.goHome(this.currentPlayer)
                    } else if (player.color === otherPlayer.color) {
                        // two players with the same color on one field
                        console.log("Same players on that Field!");
                    }
                }
            }

            
        }
    
        // next player, if the current player has rolled no 6
        if (this.currentPlayer.diceNumber !== 6 && !this.currentPlayer.isMoving) this.nextPlayer()
            else {
                this.dices[this.currentPlayer.color].clear()
                for (const player of this.players[this.currentPlayer.color]) player.setText(this.currentPlayer.color.toUpperCase() + " is again!")
            }
    }

    /**
     * handles the figure choosing of an player
     */
    chooseFigure() {
        for (const player of this.players[this.currentPlayer.color]) {
            player.setMoveable(this.currentPlayer.diceNumber, this.players)
            if (player.moveable) {
                player.animateBlinking() 
                this.canvas.addEventListener("click", this.clickHandler)
            }  
        }

        // next player if current player can not move
        let playerCanMove = false
        for (const player of this.players[this.currentPlayer.color]) {
            if (player.moveable) {
                playerCanMove = true
            }
        }
        if (!playerCanMove && !this.currentPlayer.isMoving) {
            this.nextPlayer()
        }
        
    }
    
    /** 
     * This Method handles the clickevent on an chooseable player (a player who is jumping).
     * the click location is compared with the players position, and if it matches, the clicked player 
     * index is writing to the currentplayer.index, the currentplayer.canmove is set to true and the clickevent is removed 
     * @param {Object} event the click event
    */
    chooseFigureClickEvent(event) {
        if (!this.currentPlayer.canChooseFigure) return
        let rect = this.canvas.getBoundingClientRect(); 
        let x = event.pageX - rect.left
        let y = event.pageY - rect.top
        for (const player of this.players[this.currentPlayer.color]) {
            if (player.moveable === false) continue
            if (y > player.position.y && y < player.position.y + this.gameBoard.patternSize
                && x > player.position.x && x < player.position.x + this.gameBoard.patternSize) {
                this.currentPlayer.canChooseFigure = false
                player.size = 20
                this.currentPlayer.index = this.players[this.currentPlayer.color].indexOf(player)
                this.currentPlayer.canMove = true
                this.canvas.removeEventListener("click", this.clickHandler)
                break
    
            }
        }
    
    }
    
    /** 
     * This Method gives the game to the next player.
    */
    nextPlayer() {
        if (this.playerHasWon()) return
        for (const player of this.players[this.currentPlayer.color]) player.setText("")
        this.dices[this.currentPlayer.color].hide()
    
            let colorIndex = this.colors.playerColors.indexOf(this.currentPlayer.color) + 1
            if (colorIndex > this.colors.playerColors.length - 1) {
                colorIndex = 0
            }
            this.currentPlayer.color = this.colors.playerColors[colorIndex]
            this.currentPlayer.index = 0
            this.currentPlayer.canRoll = true
            this.currentPlayer.canChooseFigure = false
            this.currentPlayer.canMove = false
    
    
            this.dices[this.currentPlayer.color].show()
            for (const player of this.players[this.currentPlayer.color]) player.setText(this.currentPlayer.color.toUpperCase() + "'s turn!")
    }

    /** 
     * This Method checks, if a player has won the game
    */
    playerHasWon() {
        let hasWon = true
        this.players[this.currentPlayer.color].forEach(player => {
            if (this.positions.goalPositions[this.currentPlayer.color].indexOf(player.position) === -1) {
                hasWon = false 
            }
        });
        if (hasWon) {
            this.gameOver()
            return true
        }
        return false
    }
    
    /** 
     * This Method handles the game Over
    */
    gameOver() {
        this.currentPlayer.diceNumber = 0
        this.currentPlayer.canRoll = false
        this.currentPlayer.canChooseFigure = false
        this.currentPlayer.canMove = false
        this.currentPlayer.isMoving = false
        h1.innerHTML = "Player " + this.currentPlayer.color + " has won!"
        
    }

    checkForMultiplePlayers() {
        //check for multiple players on an field
        let multiplePlayers = {}
        for (let positionIndex = 0; positionIndex < this.positions.path.length; positionIndex++) { 
            for (const color in this.players) {
                for (const player of this.players[color]) {
                    if (this.positions.path.indexOf(player.position) !== -1 && this.positions.path[positionIndex] === player.position) {
                        if (!multiplePlayers[positionIndex]) {
                            multiplePlayers[positionIndex] = []
                        }
                        multiplePlayers[positionIndex].push(player)
                    } 
                }
            }
        };
        this.animateMultiplePlayers(multiplePlayers)
    }



    /**
     * changes the players size and position, if more than 1 player on a field
     * @param {Object} multiplePlayers an Object with the player positions
     */
    animateMultiplePlayers(multiplePlayers) {
        for (const positionIndex in multiplePlayers) {
            const playerList = multiplePlayers[positionIndex]
            this.resetMultiplePlayers(playerList)

            for (const player of playerList) {
                
                if (playerList.length >= 2) {
                    player.size = player.sizeOrigin / 1.5
                    player.blinkingAnimation.kind = "small"

                    if (playerList.length === 2) {
                        playerList[0].multiPosition.x = -10
                        playerList[0].multiPosition.y = -10
                        playerList[1].multiPosition.x = 10
                        playerList[1].multiPosition.y = 10
                    }

                    if (playerList.length === 3) {
                        playerList[0].multiPosition.x = 10
                        playerList[0].multiPosition.y = -10
                        playerList[1].multiPosition.x = -10
                        playerList[1].multiPosition.y = -10
                        playerList[2].multiPosition.x = -10
                        playerList[2].multiPosition.y = 10
                    }

                    if (playerList.length >= 4) {
                        playerList[0].multiPosition.x = 10
                        playerList[0].multiPosition.y = -10
                        playerList[1].multiPosition.x = -10
                        playerList[1].multiPosition.y = -10
                        playerList[2].multiPosition.x = -10
                        playerList[2].multiPosition.y = 10
                        playerList[3].multiPosition.x = 10
                        playerList[3].multiPosition.y = 10
                    }
                }
            }
        }            
    }

    resetMultiplePlayers(playerList) {
        playerList.forEach(player => {
            player.blinkingAnimation.kind = "big"
            player.size = player.sizeOrigin
            player.multiPosition.x = 0
            player.multiPosition.y = 0
        })
    }


}