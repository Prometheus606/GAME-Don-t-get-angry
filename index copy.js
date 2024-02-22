const h1 = document.querySelector("h1")
h1.innerHTML = "Mensch Ärgere dich nicht!"

const canvas = document.querySelector("#gamepad > canvas")
const c = canvas.getContext("2d")
canvas.width = 800
canvas.height = 800

const colors = new Colors({
    gameColors: ["blue", "red", "yellow", "green"],
    playerColors: ["blue","yellow"]
})
const positions = new Positions(colors.gameColors)
const gameBoard = new GameBoard(colors, positions)

const clickHandler = function(event) {chooseFigure(canvas, event)}

const currentPlayer = {
    color: colors.playerColors[0],
    index: 0,
    diceNumber: 0,
    canRoll: true,
    canChooseFigure: false,
    canMove: false,
    isMoving: false,
}

//create all players and dices
const players = {}
const dices = {}
for (let i = 0; i < colors.playerColors.length; i++) {
    const color = colors.playerColors[i];

    dices[color] = new Dice(color, colors)

    players[color] = []
    for (let j = 0; j < positions.homePositions[color].length; j++) {
        const position = positions.homePositions[color][j];
        players[color].push(new Player({
            color: color,
            homePosition: {
                x: position.x,
                y: position.y
            },
            startPositionIndex: positions.startPositions[color],
            positions,
            colors,
            patternSize: gameBoard.patternSize,
        }))  
    }

    
}

//show dice and player text from the current player
dices[currentPlayer.color].show()
for (const player of players[currentPlayer.color]) player.setText(currentPlayer.color.toUpperCase() + " ist dran!")


async function gameLoop() {
    window.requestAnimationFrame(gameLoop);

    c.clearRect(0, 0, canvas.width, canvas.height);
    gameBoard.draw()

    for (const color in players) {
        for (const player of players[color]) {
            player.draw()
        }
    }

    // figure animation
    if (currentPlayer.canChooseFigure) {  
        for (const player of players[currentPlayer.color]) {
            player.setMoveable(currentPlayer.diceNumber)
            if (player.moveable) {
                player.animateBlinking() 
                canvas.addEventListener("click", clickHandler)
            }  
        }

        // next player if current player can not move
        let playerCanMove = false
        for (const player of players[currentPlayer.color]) {
            if (player.moveable) {
                playerCanMove = true
            }
        }
        if (!playerCanMove && !currentPlayer.isMoving) {
            nextPlayer()
        }
    }

    if (currentPlayer.canMove) {
        const player = players[currentPlayer.color][currentPlayer.index]
        if (player.position === player.homePosition  && currentPlayer.diceNumber !== 6) {
            // do nothing
        } else if (player.position === player.homePosition  && currentPlayer.diceNumber === 6) {
            player.leaveHome()
        } else {
            await player.move(currentPlayer)
        }

        currentPlayer.canMove = false
        currentPlayer.canRoll = true

        //check, if the currentplayer beat another player
        for (const color in players) {
            for (const otherPlayer of players[color]) {
                if (player === otherPlayer) {
                    // do nothing
                } else if (player.position === otherPlayer.position) {
                    if (player.color !== otherPlayer.color) {
                        //beated another player
                        console.log("Beatet!!!");
                        otherPlayer.goHome()
                    } else if (player.color === otherPlayer.color) {
                        // two players with the same color on one field
                        console.log("Same players on that Field!");
                    }
                }
            }
        }

        // next player, if the current player has rolled no 6
        if (currentPlayer.diceNumber !== 6 && !currentPlayer.isMoving) nextPlayer()
            else {
                dices[currentPlayer.color].clear()
                for (const player of players[currentPlayer.color]) player.setText(currentPlayer.color.toUpperCase() + " ist nochmal!")
            }
        
    }
}

gameLoop()

function chooseFigure(canvas, event) {
    if (!currentPlayer.canChooseFigure) return
    let rect = canvas.getBoundingClientRect(); 
    let x = event.pageX - rect.left
    let y = event.pageY - rect.top
    for (const player of players[currentPlayer.color]) {
        if (player.moveable === false) continue
        if (y > player.position.y && y < player.position.y + gameBoard.patternSize
            && x > player.position.x && x < player.position.x + gameBoard.patternSize) {
            currentPlayer.canChooseFigure = false
            player.size = 20
            currentPlayer.index = players[currentPlayer.color].indexOf(player)
            currentPlayer.canMove = true
            canvas.removeEventListener("click", clickHandler)
            break

        }
    }

}

function nextPlayer() {
    if (playerHasWon()) return
    for (const player of players[currentPlayer.color]) player.setText("")
    dices[currentPlayer.color].hide()

        let colorIndex = colors.playerColors.indexOf(currentPlayer.color) + 1
        if (colorIndex > colors.playerColors.length - 1) {
            colorIndex = 0
        }
        currentPlayer.color = colors.playerColors[colorIndex]
        currentPlayer.index = 0
        currentPlayer.canRoll = true
        currentPlayer.canChooseFigure = false
        currentPlayer.canMove = false


        dices[currentPlayer.color].show()
        for (const player of players[currentPlayer.color]) player.setText(currentPlayer.color.toUpperCase() + " ist dran!")
}

function playerHasWon() {
    let hasWon = true
    players[currentPlayer.color].forEach(player => {
        if (positions.goalPositions[currentPlayer.color].indexOf(player.position) === -1) {
            hasWon = false 
        }
    });
    if (hasWon) {
        gameOver()
        return true
    }
    return false
}

function gameOver() {
    currentPlayer.diceNumber = 0
    currentPlayer.canRoll = false
    currentPlayer.canChooseFigure = false
    currentPlayer.canMove = false
    currentPlayer.isMoving = false
    h1.innerHTML = "Spieler " + currentPlayer.color + " hat gewonnen!"
    
}


/* 

testen: 
        - 

bugs: 
        - schlagen abwarten wie bei move

features:
        - game klasse erstellen
        - Regeln hinzufügen:
            - alle startpositionen sind zum ausruhen
            - mehrere spieler auf einem feld animieren / regeln
        - computer spielen lassen (singleplayer)
        - auswählen ob multiplayer oder singleplayer
        - online spiel ermöglichen
*/
















