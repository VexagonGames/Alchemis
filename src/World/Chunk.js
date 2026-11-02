import { CHUNK_SIZE2 } from "../Util/Const.js";

export class Chunk {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tiles = new Array(CHUNK_SIZE2*2).fill(null).map((_, i) => { return { id: i <= CHUNK_SIZE2 }; });
    }
}