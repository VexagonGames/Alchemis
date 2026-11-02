import { World } from "./World/World.js";
import { Player } from "./World/Entity/Player.js";
import { WorldRenderer } from "./World/WorldRenderer.js";
import { SeasonManager } from "./World/Systems/SeasonManager.js";

class Main {
    constructor() {
        this.canvas = document.getElementById("ctx");
        this.ctx = this.canvas.getContext("2d");

        this.ctx.scale(2, 2);
        this.ctx.imageSmoothingEnabled = false;

        this.lf = 0;
        this.dt = 0;

        this.keys = {};
        this.mouse = { x: 0, y: 0, btn: -1 };

        window.addEventListener("keydown", (e) => this.keys[e.key] = true);
        window.addEventListener("keyup", (e) => this.keys[e.key] = false);

        window.addEventListener("mousedown", (e) => this.mouse.btn = e.button);
        window.addEventListener("mouseup", () => this.mouse.btn = -1);
        window.addEventListener("mousemove", (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY });

        this.systems = {
            weather: new SeasonManager(),
            inventory: null,
            relations: null,
        };

        this.world = new World(this.systems);

        this.player = new Player(0, 0, 1);
        this.world.AddEntity(this.player);

        this.worldRenderer = new WorldRenderer(this.world, "data/tileset.png");
    
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(t) {
        this.dt = (t - this.lf) / 1000.0;
        this.lf = t;

        this.world.Update(this.dt, this.keys, this.mouse);

        this.ctx.fillStyle = "rgb(90, 180, 250)";
        this.ctx.fillRect(0, 0, 640, 360);

        this.worldRenderer.Render(this.ctx, 640, 360);

        requestAnimationFrame(this.loop.bind(this));
    }
}


window.onload = () => new Main();