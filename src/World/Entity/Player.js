import { Entity } from "./Entity.js";

export class Player extends Entity {
    constructor(x, y, z) {
        super(x, y, z, "Player");
    }

    Render(ctx, px, py, cx, cy) {
        ctx.fillRect(px, py, 32, 32);
    }

    Update(dt, keys, mouse, world) {
        let moveX = Number(Boolean(keys["d"])) - Number(Boolean(keys["a"]));
        let moveY = Number(Boolean(keys["s"])) - Number(Boolean(keys["w"]));
        const length = Math.hypot(moveX, moveY);

        if (length === 0)
            return;

        moveX /= length;
        moveY /= length;

        const speed = 8;
        const distanceX = moveX * speed * dt;
        const distanceY = moveY * speed * dt;

        const nextX = this.x + distanceX;
        if (!this.IsBlocked(world, nextX, this.y))
            this.x = nextX;

        const nextY = this.y + distanceY;
        if (!this.IsBlocked(world, this.x, nextY))
            this.y = nextY;
    }

    IsBlocked(world, x, y) {
        const tile = world.GetTile(Math.floor(x), Math.floor(y));
        return tile?.collisionFlag === 1;
    }
}