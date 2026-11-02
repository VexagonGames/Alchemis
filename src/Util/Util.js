import { TILE_PROJECTION_SIZE } from "./Const.js";

export function Project(x, y, z, cx, cy) {
    return {
        x: (x-y) * TILE_PROJECTION_SIZE - Math.floor(cx),
        y: (x+y) * TILE_PROJECTION_SIZE/2 - z * TILE_PROJECTION_SIZE - Math.floor(cy),
    }
}

export function UnProject(x, y, cx, cy, z = 0) {
    const screenX = (x + Math.floor(cx)) / TILE_PROJECTION_SIZE;
    const screenY = (y + Math.floor(cy)) / TILE_PROJECTION_SIZE;

    return {
        x: (screenX + 2 * (screenY + z)) / 2,
        y: (2 * (screenY + z) - screenX) / 2,
        z
    };
}