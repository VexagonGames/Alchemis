export class Entity {
    constructor(x, y, z, tag) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.tag = tag;

        this.texture = new Image();
    }

    Render(ctx, px, py, cx, cy) {}

    Update(dt, keys, mouse, world) {} 
}