import { CHUNK_SIZE, CHUNK_SIZE2 } from "../Util/Const.js";
import { Tree } from "./Entity/Tree.js";

export class Chunk {
    constructor(x, y, tileIds) {
        if (!tileIds || tileIds.length !== CHUNK_SIZE2)
            throw new Error(`Chunk ${x}:${y} requires ${CHUNK_SIZE2} generated tile IDs.`);

        this.x = x;
        this.y = y;
        this.entities = [];
        this.tiles = Array.from(tileIds, (id, index) => {
            return {
                id,
                collisionFlag: id > 1 ? 1 : 0,
                entityFactory: id === 2 ? (tileX, tileY) => new Tree(tileX, tileY) : null,
                entity: null,
            };
        });
    }

    UpdateVisibleEntities(playerX, playerY, minTileX, minTileY, maxTileX, maxTileY, spawnDistance, despawnDistance) {
        const spawnDistanceSquared = spawnDistance * spawnDistance;
        const despawnDistanceSquared = despawnDistance * despawnDistance;

        for (let index = 0; index < this.tiles.length; index++) {
            const tile = this.tiles[index];
            if (!tile.entityFactory && !tile.entity)
                continue;

            const tileX = this.x * CHUNK_SIZE + index % CHUNK_SIZE;
            const tileY = this.y * CHUNK_SIZE + Math.floor(index / CHUNK_SIZE);
            const distanceX = tileX - playerX;
            const distanceY = tileY - playerY;
            const distanceSquared = distanceX * distanceX + distanceY * distanceY;

            if (tile.entity) {
                if (distanceSquared > despawnDistanceSquared) {
                    this.entities.splice(this.entities.indexOf(tile.entity), 1);
                    tile.entity = null;
                }
            } else if (tile.entityFactory
                && tileX >= minTileX && tileX <= maxTileX
                && tileY >= minTileY && tileY <= maxTileY
                && distanceSquared <= spawnDistanceSquared) {
                tile.entity = tile.entityFactory(tileX, tileY);
                this.entities.push(tile.entity);
            }
        }
    }
}