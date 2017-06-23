import React from 'react';
import {SystemModel, CanvasVisualizer, PlayButton, ResetButton} from './libs/libs.js'

class GoL extends SystemModel {
    constructor(width, height) {
        super()
        this.width = width
        this.height = height
    }
    
    init() {
        this.cells = [...Array(this.width)].map(() => Array(this.height));
        this.cellsNext = [...Array(this.width)].map(() => Array(this.height));
        for(let x = 0; x < this.cells.length; x++) {
            for (let y = 0; y < this.cells[x].length; y++) {
                this.cells[x][y] = Math.floor(Math.random()*2);
            }
        }
    }
    
    update() {
        const width = this.width
        const height = this.height
        for(let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const nw = this.cells[(x-1+width)%width][(y-1+height)%height];
                const n  = this.cells[ x               ][(y-1+height)%height];
                const ne = this.cells[(x+1)%width      ][(y-1+height)%height];
                const w  = this.cells[(x-1+width)%width][y]
                const c  = this.cells[ x               ][y]
                const e  = this.cells[(x+1)%width      ][y]
                const sw = this.cells[(x-1+width)%width][(y+1)%height];
                const s  = this.cells[ x               ][(y+1)%height];
                const se = this.cells[(x+1)%width      ][(y+1)%height];
                const nsum = nw + n + ne + w + e + sw + s + se;
                let new_state = 0;
                if ( nsum===3 || (nsum===2 && c===1)) {
                    new_state = 1;
                }
                this.cellsNext[x][y] = new_state;
            }
        }
        const tmp = this.cellsNext;
        this.cellsNext = this.cells;
        this.cells = tmp;
    }
}

let draw_gol = function(canvas, gol) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    let imgData = ctx.createImageData(width, height);
    for(let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const s = gol.cells[x][y]
            const i = x + y*width;
            imgData.data[i*4+0] = (1-s)*255;
            imgData.data[i*4+1] = (1-s)*255;
            imgData.data[i*4+2] = (1-s)*255;
            imgData.data[i*4+3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
}


let gol = new GoL(600, 400)

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <CanvasVisualizer width={gol.width} height={gol.height} system={gol} draw_func={draw_gol} />
                <div>
                    <PlayButton system={gol} />
                    <ResetButton system={gol} />
                </div>
            </div>
        );
    }
}

export default App;
