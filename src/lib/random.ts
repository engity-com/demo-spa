export const random = {
    mulberry32(seed: number) {
        return (): number => {
            seed |= 0;
            seed = (seed + 0x6d2b79f5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    },
    xorshift32(seed: number) {
        return (): number => {
            seed ^= seed << 13;
            seed ^= seed >>> 17;
            seed ^= seed << 5;
            return (seed >>> 0) / 4294967296;
        };
    },
    inRange(source: () => number, min: number, max: number) {
        return min + source() * (max - min);
    },
};
