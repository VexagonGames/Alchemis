import { CHUNK_SIZE, TILE_PROJECTION_SIZE, TILE_RENDER_SIZE } from "../Util/Const.js";
import { Project, UnProject } from "../Util/Util.js";

export class WorldRenderer {
    constructor(world, tilesetPath) {
        this.world = world;

        this.tileset = new Image();
        this.tileset.onload = () => {
            this.tilesetReady = true;
        };
        this.tileset.onerror = () => {
            console.error(`Unable to load tileset: ${tilesetPath}`);
        };
        this.tilesetReady = false;
        this.tileset.src = tilesetPath;
    }

    Render(ctx, width, height) {
        const focus = this.world.entities.find(entity => entity.tag === "Player")
            || this.world.entities[0]
            || { x: 0, y: 0, z: 0 };
        const focusPoint = Project(focus.x, focus.y, focus.z, 0, 0);
        const cameraX = focusPoint.x - width / 2;
        const cameraY = focusPoint.y - height / 2;

        const visibleTiles = [
            UnProject(0, 0, cameraX, cameraY),
            UnProject(width, 0, cameraX, cameraY),
            UnProject(0, height, cameraX, cameraY),
            UnProject(width, height, cameraX, cameraY),
        ];
        const minTileX = Math.floor(Math.min(...visibleTiles.map(point => point.x))) - 1;
        const maxTileX = Math.ceil(Math.max(...visibleTiles.map(point => point.x))) + 1;
        const minTileY = Math.floor(Math.min(...visibleTiles.map(point => point.y))) - 1;
        const maxTileY = Math.ceil(Math.max(...visibleTiles.map(point => point.y))) + 1;
        const minChunkX = Math.floor(minTileX / CHUNK_SIZE) - 1;
        const maxChunkX = Math.floor(maxTileX / CHUNK_SIZE) + 1;
        const minChunkY = Math.floor(minTileY / CHUNK_SIZE) - 1;
        const maxChunkY = Math.floor(maxTileY / CHUNK_SIZE) + 1;

        this.world.LoadChunks(minChunkX, minChunkY, maxChunkX, maxChunkY);

        const drawList = [];
        for (const chunk of this.world.chunks.values()) {
            const startX = chunk.x * CHUNK_SIZE;
            const startY = chunk.y * CHUNK_SIZE;

            for (let index = 0; index < chunk.tiles.length; index++) {
                const x = startX + index % CHUNK_SIZE;
                const y = startY + Math.floor(index / CHUNK_SIZE);
                if (x < minTileX || x > maxTileX || y < minTileY || y > maxTileY)
                    continue;

                drawList.push({ x, y, tile: chunk.tiles[index], depth: x + y, kind: 0 });
            }
        }

        for (const entity of this.world.entities)
            drawList.push({ entity, depth: entity.x + entity.y, kind: 1 });

        drawList.sort((a, b) => a.depth - b.depth || a.kind - b.kind);

        const previousFillStyle = ctx.fillStyle;
        for (const item of drawList) {
            if (item.kind === 0) {
                const point = Project(item.x, item.y, 0, cameraX, cameraY);
                this.RenderTile(ctx, item.tile.id, point.x, point.y);
            } else {
                const entity = item.entity;
                const point = Project(entity.x, entity.y, entity.z, cameraX, cameraY);
                entity.Render(ctx, point.x, point.y, cameraX, cameraY);
            }
        }
        ctx.fillStyle = previousFillStyle;
    }

    RenderTile(ctx, id, x, y) {
        const left = x - TILE_RENDER_SIZE / 2;
        const top = y - TILE_RENDER_SIZE / 2;
        if (this.tilesetReady) {
            const columns = Math.floor(this.tileset.width / TILE_RENDER_SIZE);
            const sourceX = ((id-1) % columns) * TILE_RENDER_SIZE;
            const sourceY = Math.floor((id-1) / columns) * TILE_RENDER_SIZE;
            ctx.drawImage(
                this.tileset,
                sourceX, sourceY, TILE_RENDER_SIZE, TILE_RENDER_SIZE,
                left, top, TILE_RENDER_SIZE, TILE_RENDER_SIZE
            );
        }
    }
}