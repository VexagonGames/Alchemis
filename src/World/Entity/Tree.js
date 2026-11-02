import { Entity } from "./Entity.js";
import { SEASON } from "../Systems/SeasonManager.js";

export class Tree extends Entity {
    constructor(x, y, season) {
        super(x, y, 0, "Tree");
        this.renderOffsetX = -16;
        this.renderOffsetY = -48;
        this.renderWidth = 32;
        this.renderHeight = 64;

        this.textures = [new Image(), new Image(), new Image(), new Image()];

        this.textures[0].src = "data/tree0.png";
        this.textures[1].src = "data/tree1.png";
        this.textures[2].src = "data/tree2.png";
        this.textures[3].src = "data/tree3.png";

        this.season = SEASON.SPRING;
    }

    Update(dt, keys, mouse, world) {
        this.season = world.systems.weather.season;
    }

    Render(ctx, px, py) {
        ctx.save();
        ctx.translate(px + this.renderWidth / 2, py + this.renderHeight);
        ctx.rotate(Math.sin(performance.now() / 1000.0 + this.x + this.y * 2) * 0.025);
        ctx.drawImage(
            this.textures[this.season],
            -this.renderWidth / 2,
            -this.renderHeight,
            this.renderWidth,
            this.renderHeight
        );
        ctx.restore();
    }
}
