
/** 
 * This Class creates the GameBoard
 * @param {Object} colors a Color Object
 * @param {Object} position a Position Object
 * @param {Object} canvas the Main Canvas
 * @param {Object} context the Main Canvas context
 * @returns the Gameboard
*/
class GameBoard {
    constructor({colors, positions, canvas, context}) {
        this.patternSize = 45
        this.colors = colors
        this.positions = positions
        this.context = context
        this.canvas = canvas
    }

    draw() {
        // draw background
        this.context.fillStyle = this.colors.BORDERCOLOR
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.context.fillStyle = this.colors.BACKGROUNDCOLOR
        this.context.fillRect(10, 10, this.canvas.width - 20, this.canvas.height -20)

        //draw white pattern
        for (const position of this.positions.path) {
            this.context.save()
            this.context.lineWidth = 3
            this.context.strokeStyle = this.colors.BLACK;
            this.context.fillStyle = this.colors.WHITE;
            this.context.beginPath();
            this.context.roundRect(position.x, position.y, this.patternSize, this.patternSize, 100);
            this.context.stroke();
            this.context.fill();
            this.context.restore();            
        
        }

        //draw colored pattern
        this.colors.gameColors.forEach(color => {
            this.context.save()
            this.context.lineWidth = 6
            this.context.strokeStyle = this.colors.BLACK;
            this.context.fillStyle = color;
            this.context.beginPath();
            this.context.roundRect(this.positions.path[this.positions.startPositions[color]].x, this.positions.path[this.positions.startPositions[color]].y, this.patternSize, this.patternSize, 100);
            this.context.stroke();
            this.context.fill();
            this.context.restore();     

            for (const test of [this.positions.homePositions[color], this.positions.goalPositions[color]]) {
                for (const position of test) {
                    this.context.save()
                    this.context.lineWidth = 6
                    this.context.strokeStyle = this.colors.BLACK;
                    this.context.fillStyle = color;
                    this.context.beginPath();
                    this.context.roundRect(position.x, position.y, this.patternSize, this.patternSize, 100);
                    this.context.stroke();
                    this.context.fill();
                    this.context.restore();  
                }
            }
        });


        


    }
}