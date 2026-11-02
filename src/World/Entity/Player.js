import { Entity } from "./Entity.js";

export class Player extends Entity{
    constructor(x, y, z) {
        super(x, y, z, "Player");
    }

    Render(ctx, px, py, cx, cy) {
        ctx.fillRect(px, py, 32, 32);
    }

    Update(dt, keys, mouse, world) {
        let moveX = Number(Boolean(keys["s"])) - Number(Boolean(keys["w"]));
        let moveY = Number(Boolean(keys["a"])) - Number(Boolean(keys["d"]));
        const length = Math.hypot(moveX, moveY);

        if (length === 0)
            return;

        moveX /= length;
        moveY /= length;

        const speed = 8;
        this.x += moveX * speed * dt;
        this.y += moveY * speed * dt;
    }
}