import { CHUNK_SIZE } from "../Util/Const.js";
import { Chunk } from "./Chunk.js";

export class World {
    constructor(systems) {
        this.systems = systems;
        this.chunks = new Map();
        this.entities = [];
        this.pendingChunks = new Set();
        this.failedChunks = new Set();
        this.desiredChunks = new Set();
        this.chunkWorkerFailed = false;
        this.chunkWorker = new Worker(new URL("./ChunkWorker.js", import.meta.url), { type: "module" });
        this.chunkWorker.onmessage = event => this.HandleChunkResult(event.data);
        this.chunkWorker.onerror = event => {
            console.error("Chunk generation worker failed:", event.message);
            this.chunkWorkerFailed = true;
            this.pendingChunks.clear();
        };
        this.chunkWorker.onmessageerror = event => {
            console.error("Could not read a chunk generation worker response:", event);
            this.chunkWorkerFailed = true;
            this.pendingChunks.clear();
        };
    }

    Update(dt, keys, mouse) {
        for (const entity of this.entities)
            entity.Update(dt, keys, mouse, this);
    }

    AddChunk(x, y, tileIds) {
        const key = `${x}:${y}`;
        if (!this.chunks.has(key))
            this.chunks.set(key, new Chunk(x, y, tileIds));

        return this.chunks.get(key);
    }

    LoadChunks(minX, minY, maxX, maxY) {
        const desiredChunks = new Set();
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const key = `${x}:${y}`;
                desiredChunks.add(key);
                if (!this.chunks.has(key) && !this.pendingChunks.has(key)
                    && !this.failedChunks.has(key) && !this.chunkWorkerFailed) {
                    this.pendingChunks.add(key);
                    this.chunkWorker.postMessage({ x, y });
                }
            }
        }

        this.desiredChunks = desiredChunks;
        for (const [key, chunk] of this.chunks) {
            if (!desiredChunks.has(key))
                this.chunks.delete(key);
        }
    }

    HandleChunkResult(result) {
        const key = `${result.x}:${result.y}`;
        this.pendingChunks.delete(key);

        if (result.error) {
            this.failedChunks.add(key);
            console.error(`Failed to generate chunk ${key}:`, result.error);
            return;
        }

        if (!this.desiredChunks.has(key))
            return;

        this.AddChunk(result.x, result.y, result.tileIds);
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