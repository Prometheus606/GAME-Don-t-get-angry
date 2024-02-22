
/** 
 * This Class returns a Position Object, which contains the Positions for the Game
 * @param {Object} colors a Color Object
 * @returns An Position Object
*/
class Positions {
    constructor({colors}) {

        const HOMEPOSITIONS = [
            [{x: 50, y: 620}, {x: 130, y: 620}, {x: 50, y: 700}, {x: 130, y: 700}],
            [{x: 55, y: 50}, {x: 135, y: 50}, {x: 55, y: 130}, {x: 135, y: 130}],
            [{x: 625, y: 55}, {x: 705, y: 55}, {x: 625, y: 135}, {x: 705, y: 135}],
            [{x: 620, y: 625}, {x: 700, y: 625}, {x: 620, y: 705}, {x: 700, y: 705}]
        ]

        const GOALPOSITIONS = [
            [{x: 380, y: 630}, {x: 380, y: 570}, {x: 380, y: 510}, {x: 380, y: 450}],
            [{x: 125, y: 380}, {x: 185, y: 380}, {x: 245, y: 380}, {x: 305, y: 380}],
            [{x: 375, y: 130}, {x: 375, y: 190}, {x: 375, y: 250}, {x: 375, y: 310}],
            [{x: 630, y: 380}, {x: 570, y: 380}, {x: 510, y: 380}, {x: 450, y: 380}]
        ]

        const STARTPOSITIONS = [0, 10, 20, 30]


        this.colors = colors

        // white
        this.path = [
            {x: 310, y: 700}, {x: 310, y: 630}, {x: 310, y: 570}, {x: 310, y: 510}, {x: 310, y: 450}, 
            {x: 247, y: 450}, {x: 186, y: 450}, {x: 125, y: 450}, {x: 55, y: 450}, {x: 55, y: 380}, 
            {x: 55, y: 310}, {x: 125, y: 310}, {x: 185, y: 310}, {x: 245, y: 310}, {x: 305, y: 310}, 
            {x: 305, y: 250}, {x: 305, y: 190}, {x: 305, y: 130}, {x: 305, y: 60}, {x: 375, y: 60}, 
            {x: 445, y: 60}, {x: 445, y: 130}, {x: 445, y: 190}, {x: 445, y: 250}, {x: 445, y: 310}, 
            {x: 508, y: 310}, {x: 570, y: 310}, {x: 630, y: 310}, {x: 700, y: 310}, {x: 700, y: 380}, 
            {x: 700, y: 450}, {x: 630, y: 450}, {x: 570, y: 450}, {x: 510, y: 450}, {x: 450, y: 450}, 
            {x: 450, y: 510}, {x: 450, y: 570}, {x: 450, y: 630}, {x: 450, y: 700}, {x: 380, y: 700}
        ]


        // Create an Object for each Position, with the Gamecolors as keys
        this.homePositions = {}
        this.goalPositions = {}
        this.startPositions = {}
        for (let i = 0; i < this.colors.length; i++) {
            const color = this.colors[i];
            this.homePositions[color] = HOMEPOSITIONS[i]
            this.goalPositions[color] = GOALPOSITIONS[i]
            this.startPositions[color] = STARTPOSITIONS[i]
        }

    }
}



