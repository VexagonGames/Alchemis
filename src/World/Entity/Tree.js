import { Entity } from "./Entity.js";

export class Tree extends Entity {
    constructor(x, y) {
        super(x, y, 0, "Tree");
        this.renderOffsetX = -16;
        this.renderOffsetY = -48;
        this.renderWidth = 32;
        this.renderHeight = 64;

        this.texture.onload = () => {
            this.textureReady = true;
        };
        this.texture.onerror = () => {
            console.error("Unable to load tree texture: data/tree.png");
        };
        this.textureReady = false;
        this.texture.src = "data/tree.png";
    }

    Render(ctx, px, py) {
        if (this.textureReady) {
            ctx.save();
            ctx.translate(px + this.renderWidth / 2, py + this.renderHeight);
            ctx.rotate(Math.sin(performance.now() / 1000.0 + this.x + this.y * 2) * 0.025);
            ctx.drawImage(
                this.texture,
                -this.renderWidth / 2,
                -this.renderHeight,
                this.renderWidth,
                this.renderHeight
            );
            ctx.restore();
        }
    }
}
