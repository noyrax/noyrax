"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLimit = void 0;
async function mapLimit(items, limit, fn) {
    const results = new Array(items.length);
    let idx = 0;
    let active = 0;
    return new Promise((resolve, reject) => {
        const next = () => {
            if (idx >= items.length && active === 0)
                return resolve(results);
            while (active < limit && idx < items.length) {
                const current = idx++;
                active++;
                Promise.resolve(fn(items[current], current))
                    .then(res => { results[current] = res; })
                    .catch(reject)
                    .finally(() => { active--; next(); });
            }
        };
        next();
    });
}
exports.mapLimit = mapLimit;
//# sourceMappingURL=async.js.map