
/** 
 * This Class returns a Dice Object
 * @param {Array} color the player Color, for which the dice is created
 * @param {Object} colors A Color Object
 * @param {Object} currentPlayer the currentplayer object from the Game class
 * @returns An Dice Object
*/
class Dice {
    constructor(color, colors, currentPlayer) {
        this.color = color
        this.colors = colors
        this.currentPlayer = currentPlayer

        const colorIndex = this.colors.gameColors.indexOf(this.color)
        const diceContainer = document.querySelector(".player" + colorIndex)
        this.dice = document.createElement("div")
        this.dice.classList.add("dice")
        diceContainer.appendChild(this.dice)
        
        this.canvas = document.createElement("canvas")
        this.dice.appendChild(this.canvas)

        this.rollIntervall = 50
        this.rollDuration = 1000
        this.timeOut = 1000
        this.context = this.canvas.getContext("2d")

        this.dice.addEventListener("click", (event) => {    
            if (this.currentPlayer.canRoll && this.currentPlayer.color === this.color && !currentPlayer.isMoving) {
                this.roll()       
            }
        })
        

        this.hide()
    }
    
    roll() {
        let number
        const test = setInterval(() => {
            number = this.getRandomNumber()
            this.draw(number) 
        }, this.rollIntervall);

        setTimeout(() => {
            clearInterval(test)
            setTimeout(() => {
                this.currentPlayer.diceNumber = number
                this.currentPlayer.canRoll = false
                this.currentPlayer.canChooseFigure = true
            }, this.timeOut);
            
        }, this.rollDuration);
        


        
    }

    getRandomNumber() {
        return Math.floor(Math.random() * 6) + 1
        // return Number(prompt("Welche Zahl? "))
    }

    draw(number) {
        this.context.clearRect(0, 0, 50, 50)
        this.context.save()
        this.context.lineWidth = 1
        this.context.strokeStyle = this.colors.BLACK;
        this.context.fillStyle = this.colors.BLACK;
        this.context.beginPath();

        if (number === 1) this.context.roundRect(20, 20, 10, 10, 50);
        else if (number === 2) {
            this.context.roundRect(33, 7, 10, 10, 50);
            this.context.roundRect(7, 33, 10, 10, 50);
        }else if (number === 3) {
            this.context.roundRect(20, 20, 10, 10, 50);
            this.context.roundRect(33, 7, 10, 10, 50);
            this.context.roundRect(7, 33, 10, 10, 50);
        }else if (number === 4) {
            this.context.roundRect(33, 7, 10, 10, 50);
            this.context.roundRect(7, 33, 10, 10, 50);
            this.context.roundRect(7, 7, 10, 10, 50);
            this.context.roundRect(33, 33, 10, 10, 50);
        }else if (number === 5) {
            this.context.roundRect(20, 20, 10, 10, 50);
            this.context.roundRect(33, 7, 10, 10, 50);
            this.context.roundRect(7, 33, 10, 10, 50);
            this.context.roundRect(7, 7, 10, 10, 50);
            this.context.roundRect(33, 33, 10, 10, 50);
        }else if (number === 6) {
            this.context.roundRect(7, 20, 10, 10, 50);
            this.context.roundRect(33, 20, 10, 10, 50);
            this.context.roundRect(33, 7, 10, 10, 50);
            this.context.roundRect(7, 33, 10, 10, 50);
            this.context.roundRect(7, 7, 10, 10, 50);
            this.context.roundRect(33, 33, 10, 10, 50);

        }

        this.context.stroke();
        this.context.fill();
        this.context.restore();   
    }

    hide() {
        this.clear()
        this.dice.style.visibility = "hidden"
    }

    show() {
        this.dice.style.visibility = "visible"
    }

    clear() {
        this.context.clearRect(0, 0, 50, 50)
    }
}