import { CHUNK_SIZE2 } from "../Util/Const.js";

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
            tileIds[index] = (state >>> 0) / 0x100000000 < 0.15 ? 2 : 1;
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
