import { CHUNK_SIZE } from "../Util/Const.js";
import { Chunk } from "./Chunk.js";

export class World {
    constructor() {
        this.chunks = new Map();
        this.entities = [];
    }

    Update(dt, keys, mouse) {
        for (const entity of this.entities)
            entity.Update(dt, keys, mouse, this);
    }

    AddChunk(x, y) {
        const key = `${x}:${y}`;
        if (!this.chunks.has(key))
            this.chunks.set(key, new Chunk(x, y));

        return this.chunks.get(key);
    }

    LoadChunks(minX, minY, maxX, maxY) {
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++)
                this.AddChunk(x, y);
        }

        for (const [key, chunk] of this.chunks) {
            if (chunk.x < minX || chunk.x > maxX || chunk.y < minY || chunk.y > maxY)
                this.chunks.delete(key);
        }
    }

    GetTile(x, y) {
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkY = Math.floor(y / CHUNK_SIZE);
        const chunk = this.chunks.get(`${chunkX}:${chunkY}`);
        if (!chunk)
            return null;

        const tileX = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        const tileY = ((y % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        return chunk.tiles[tileY * CHUNK_SIZE + tileX];
    }

    AddEntity(e) {
        this.entities.push(e);
    }

    DestroyEntity(tag) {
        this.entities = this.entities.filter(entity => entity.tag !== tag);
    }
}