export class World {
    constructor() {
        this.chunks = new Map();
        this.entities = new Array();
    }

    Update(dt, keys, mouse) {
        for(let e of this.entities) 
            e.Update(dt, keys, mouse, this);
    }

    AddChunk(x, y) {
        this.chunks.set(`${x}:${y}`, new Chunk());
    }

    AddEntity(e) {
        this.entities.push(e);
    }

    DestroyEntity(tag) {
        let i = 0;
        for(let e of this.entities) {
            if(e.tag == tag) this.entities.splice(ei, 1);
            i++;
        }
    }
}