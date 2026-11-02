import { CHUNK_SIZE, CHUNK_SIZE2 } from "../Util/Const.js";

function HashNoise(x, y) {
    let value = Math.imul(x, 374761393) + Math.imul(y, 668265263);
    value = Math.imul(value ^ (value >>> 13), 1274126177);
    return ((value ^ (value >>> 16)) >>> 0) / 0xffffffff;
}

function SmoothNoise(x, y) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = x - x0;
    const ty = y - y0;
    const smoothX = tx * tx * (3 - 2 * tx);
    const smoothY = ty * ty * (3 - 2 * ty);
    const top = HashNoise(x0, y0) * (1 - smoothX) + HashNoise(x0 + 1, y0) * smoothX;
    const bottom = HashNoise(x0, y0 + 1) * (1 - smoothX) + HashNoise(x0 + 1, y0 + 1) * smoothX;

    return top * (1 - smoothY) + bottom * smoothY;
}

self.onmessage = event => {
    const { x, y } = event.data;
    try {
        let state = (Math.imul(x, 374761393) ^ Math.imul(y, 668265263)) >>> 0;
        if (state === 0)
            state = 0x6d2b79f5;

        const tileIds = new Uint8Array(CHUNK_SIZE2);
        for (let index = 0; index < tileIds.length; index++) {
            state ^= state << 13;
            state ^= state >>> 17;
            state ^= state << 5;

            const tileX = x * CHUNK_SIZE + index % CHUNK_SIZE;
            const tileY = y * CHUNK_SIZE + Math.floor(index / CHUNK_SIZE);
            const puddleNoise = SmoothNoise(tileX / 5, tileY / 5) * 0.7
                + SmoothNoise(tileX / 11, tileY / 11) * 0.3;

            tileIds[index] = puddleNoise > 0.77
                ? 4
                : (state >>> 0) / 0x100000000 < 0.15 ? 2 : 1;
        }

        self.postMessage({ x, y, tileIds }, [tileIds.buffer]);
    } catch (error) {
        self.postMessage({
            x,
            y,
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
