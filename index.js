const h1 = document.querySelector("h1")
h1.innerHTML = "Mensch Ärgere dich nicht!"

const gameColors = ["blue", "red", "yellow", "green"]
const playerColors = ["blue", "red", "yellow", "green"]

canvas = document.querySelector("#gamepad > canvas")
context = canvas.getContext("2d")
canvas.width = 800
canvas.height = 800

colors = new Colors({
    gameColors,
    playerColors
})

positions = new Positions({
        colors: colors.gameColors
})

gameBoard = new GameBoard({
        colors, 
        positions, 
        canvas, 
        context
})

game = new Game({
        colors,
        gameBoard,
        positions,
        canvas,
        context
})

game.mainLoop()   


/* 

bugs: 
        - klick position bei bildschirm veränderung
        - animate blinking blinkt auf home position anders als auf path

features:
        - computer spielen lassen (singleplayer)
        - auswählen ob multiplayer oder singleplayer
*/
















