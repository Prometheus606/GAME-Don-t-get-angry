
/** 
 * This Class returns a Player Object
 * @param {Object} homePosition the HomePosition for that player
 * @param {Number} startPositionIndex the start position Index for the Player. the Index is the Index in the Position.path attribut
 * @param {String} color the color for that player
 * @param {Number} size the size for that player
 * @param {Object} positions a Position Object
 * @param {Object} colors a Color Object
 * @param {Number} patternSize the PatternSize from the Gameboard
 * @param {Object} canvas the Main Canvas
 * @param {Object} context the Main Canvas context
 * @returns An Player Object
*/
class Player {
    constructor({homePosition, startPositionIndex, color, size=20, positions, colors, patternSize, canvas, context}) {
        this.size = size
        this.sizeOrigin = size
        this.color = color
        this.colors = colors
        this.positions = positions
        this.position = homePosition
        this.homePosition = homePosition
        this.startPositionIndex = startPositionIndex
        this.positionIndex = undefined
        this.frameBuffer = 20
        this.currentFrame = 0
        this.moveable = false
        this.patternSize = patternSize
        this.text
        this.animationSpeed = 300
        this.canvas = canvas
        this.context = context
        this.multiPosition = {
            x: 0,
            y: 0
        }
        this.blinkingAnimation = {
            kind: "big",
            small: {
                lowerSizeForAnimation: (this.sizeOrigin / 1.2) * 0.9,
                upperSizeForAnimation: (this.sizeOrigin / 1.2),
            },
            big: {
                lowerSizeForAnimation: this.sizeOrigin * 0.9,
                upperSizeForAnimation: this.sizeOrigin,
            }
        }


        //this.path = this.positions.path
        //this.path = this.path.slice(this.startPositionIndex)
        //for (let i = 0; i < this.startPositionIndex; i++) this.path.push(this.path[i]) 
        let firstPart = this.positions.path.slice(0, this.startPositionIndex)
        let secondPart = this.positions.path.slice(this.startPositionIndex)
        this.path = secondPart.concat(firstPart)
        this.path = this.path.concat(this.positions.goalPositions[this.color])

        this.createText()

    }

    /** 
     * This Method creates the players text (is shown under the players dice)
    */
    createText() {
        const colorIndex = this.colors.gameColors.indexOf(this.color)
        this.text = document.querySelector(".player" + colorIndex + " .playerText")

        if (this.text === null) {
            const diceContainer = document.querySelector(".player" + colorIndex)
            this.text = document.createElement("p")
            this.text.classList.add("playerText")
            diceContainer.appendChild(this.text)
        }
    }

    draw() {
        const centeredPosition = {
            x: this.position.x + this.patternSize / 2 + this.multiPosition.x,
            y: this.position.y + this.patternSize / 1.7 + this.multiPosition.y
        }

        this.context.save()
        this.context.strokeStyle = this.colors.BLACK;
        this.context.lineWidth = 7
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.moveTo(centeredPosition.x, centeredPosition.y)
        this.context.lineTo(centeredPosition.x - this.size / 2, centeredPosition.y)
        this.context.lineTo(centeredPosition.x , centeredPosition.y - this.size * 2)
        this.context.lineTo(centeredPosition.x + this.size / 2 , centeredPosition.y)
        this.context.lineTo(centeredPosition.x, centeredPosition.y)
        this.context.roundRect(centeredPosition.x - this.size / 3, centeredPosition.y - this.size * 2.6, this.size / 1.5, this.size / 1.5, 100);
        this.context.stroke();
        this.context.fill();
        this.context.restore();      
    }

    /** 
     * This Method let the player go off his homeposition to the gamepath
    */
    leaveHome() {
        this.position = this.path[0]
        this.positionIndex = 0
    }

    /** 
     * This Method let the currentplayer move forward
     * @param {Object} currentPlayer the currentplayer object
     * @returns An promise
    */
    async move(currentPlayer) {
        if (currentPlayer.isMoving) return;
    
        currentPlayer.isMoving = true;
    
        await new Promise(resolve => {
            const animate = async () => {
                let steps = currentPlayer.diceNumber;
                let newPositionIndex = this.positionIndex + steps;
    
                if (newPositionIndex > this.path.length - 1) newPositionIndex = this.positionIndex;
                else await this.animateForwardMovement(steps);
    
                console.log("Player is not moving anymore.");
                resolve();
                currentPlayer.isMoving = false;
            };
    
            animate();
        });
    }

    /** 
     * This Method let the player go back to his home position. this happens if the player is beeing beated
    */
    async goHome(currentPlayer) {
        if (currentPlayer.isMoving) return;
    
        currentPlayer.isMoving = true;

        await new Promise(resolve => {
            const animate = async () => {
                let steps = this.positionIndex

                await this.animateBackwardMovement(steps);
                this.position = this.homePosition
                this.positionIndex = undefined
                console.log("Player is not moving anymore.");
                resolve();
                currentPlayer.isMoving = false;
            }
            animate();
            
        })
        
    }

    /** 
     * This Method let the player blinking, to show that he is clickable
    */
    animateBlinking() {
        console.log(this.blinkingAnimation.kind);
        if (this.moveable === false) return
        if (this.currentFrame % this.frameBuffer === 0) {
            this.size = (this.size === this.blinkingAnimation[this.blinkingAnimation.kind].upperSizeForAnimation) ? this.blinkingAnimation[this.blinkingAnimation.kind].lowerSizeForAnimation : this.blinkingAnimation[this.blinkingAnimation.kind].upperSizeForAnimation;
        }
        this.currentFrame++
    }

    /** 
     * This Method set the moveable attribut for each player of an color.
     * @param {Number} diceNumber the diceNumber that the player has rolled
     * @param {Object} players the main players object
    */
    setMoveable(diceNumber, players) {
        this.moveable = false
        if (this.position === this.homePosition && diceNumber === 6) this.moveable = true
        if (this.position != this.homePosition) {
            if (this.positionIndex + diceNumber <= this.path.length - 1) this.moveable = true
        }
        
        // dont allow movement if the player will end on a goalposition where he already is
        for (const player of players[this.color]) {
            if (player === this || player.position === player.homePosition) {
                // do nothing
            } else if (this.positionIndex + diceNumber === player.positionIndex && this.positionIndex + diceNumber >= this.path.length - 4) this.moveable = false
        }
    }

    /** 
     * This Method animates the move forward of that player
     * @param {Number} steps how many steps should the player move
     * @returns An Promise
    */
    animateForwardMovement(steps) {
        return new Promise(resolve => {
            const animate = async () => {
                if (steps > 0) {
                    setTimeout(async () => {
                        this.positionIndex++;
                        this.position = this.path[this.positionIndex];
                        this.draw();
                        await animate(steps--)
                        //this.animateForwardMovement(steps - 1);
                    }, this.animationSpeed);
                                
                } else resolve()
            }
            animate()
        })
                
    }

        /** 
     * This Method animates the move forward of that player
     * @param {Number} steps how many steps should the player move
     * @returns An Promise
    */
    animateBackwardMovement(steps) {
        return new Promise(resolve => {
            const animate = async () => {
                if (steps > 0) {
                    setTimeout(async () => {
                        this.positionIndex--;
                        this.position = this.path[this.positionIndex];
                        this.draw();
                        await animate(steps--)
                        //this.animateBackwardMovement(steps--);
                    }, this.animationSpeed / 4);
                                
                } else resolve()
            }
            animate()
        })
                
    }

    /** 
     * This Method set the players text to the given text. (the text under the players dice)
     * @param {String} text the text, that should shown in the players text
    */
    setText(text) {
        this.text.innerHTML = text
    }

}