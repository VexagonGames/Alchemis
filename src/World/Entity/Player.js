import { Entity } from "./Entity.js";

export class Player extends Entity{
    constructor(x, y, z) {
        super(x, y, z, "Player");
    }

    Render(ctx, px, py, cx, cy) {}

    Update(dt, keys, mouse, world) {} 
}