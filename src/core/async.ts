export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
    const results: R[] = new Array(items.length) as any;
    let idx = 0;
    let active = 0;
    return new Promise((resolve, reject) => {
        const next = () => {
            if (idx >= items.length && active === 0) return resolve(results);
            while (active < limit && idx < items.length) {
                const current = idx++;
                active++;
                Promise.resolve(fn(items[current], current))
                    .then(res => { results[current] = res as any; })
                    .catch(reject)
                    .finally(() => { active--; next(); });
            }
        };
        next();
    });
}


