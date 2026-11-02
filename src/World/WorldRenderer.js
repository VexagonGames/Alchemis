import { Project, UnProject } from "../Util/Util.js";

export class WorldRenderer {
    constructor(world, tilesetPath) {
        this.world = world;

        this.tileset = new Image();
        this.tileset.src = tilesetPath;
    }

    Render(ctx) {

    }
}