import { PLAYER_SPEED } from "../../Util/Const.js";

import { Entity } from "./Entity.js";

const PLAYER_COLLISION_RADIUS = 0.1;
const MAX_COLLISION_STEP = 0.1;

export class Player extends Entity {
    constructor(x, y, z) {
        super(x, y, z, "Player");
    }

    Render(ctx, px, py, cx, cy) {
        ctx.fillRect(px, py-16, 16, 32);
    }

    Update(dt, keys, mouse, world) {
        let moveX = Number(Boolean(keys["d"])) - Number(Boolean(keys["a"]));
        let moveY = Number(Boolean(keys["s"])) - Number(Boolean(keys["w"]));
        const length = Math.hypot(moveX, moveY);

        if (length === 0)
            return;

        moveX /= length;
        moveY /= length;

        this.MoveAxis(world, "x", moveX * PLAYER_SPEED * dt);
        this.MoveAxis(world, "y", moveY * PLAYER_SPEED * dt);
    }

    IsBlocked(world, x, y) {
        const minTileX = Math.floor(x - PLAYER_COLLISION_RADIUS);
        const maxTileX = Math.ceil(x + PLAYER_COLLISION_RADIUS) - 1;
        const minTileY = Math.floor(y - PLAYER_COLLISION_RADIUS);
        const maxTileY = Math.ceil(y + PLAYER_COLLISION_RADIUS) - 1;

        for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
            for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
                if (world.GetTile(tileX, tileY)?.collisionFlag === 1)
                    return true;
            }
        }

        return false;
    }

    MoveAxis(world, axis, distance) {
        const direction = Math.sign(distance);
        let remaining = Math.abs(distance);

        while (remaining > 0) {
            const step = Math.min(remaining, MAX_COLLISION_STEP) * direction;
            const nextX = axis === "x" ? this.x + step : this.x;
            const nextY = axis === "y" ? this.y + step : this.y;

            if (this.IsBlocked(world, nextX, nextY))
                break;

            this[axis] += step;
            remaining -= Math.abs(step);
        }
    }
}