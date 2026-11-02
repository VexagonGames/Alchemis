import { CHUNK_SIZE, CHUNK_SIZE2 } from "../Util/Const.js";
import { Tree } from "./Entity/Tree.js";

export class Chunk {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.entities = [];
        this.tiles = new Array(CHUNK_SIZE2).fill(null).map((_, index) => {
            const id = (Math.random() < 0.2) + 1;
            if (id === 2) {
                const tileX = x * CHUNK_SIZE + index % CHUNK_SIZE;
                const tileY = y * CHUNK_SIZE + Math.floor(index / CHUNK_SIZE);
                this.entities.push(new Tree(tileX, tileY));
            }

            return { id, collisionFlag: id === 2 ? 1 : 0 };
        });
    }
}