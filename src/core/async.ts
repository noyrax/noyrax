/**
 * @public
 * Utility function for parallel processing with concurrency limit
 */
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
                (async () => {
                    try {
                        const res = await fn(items[current], current);
                        results[current] = res;
                    } catch (err) {
                        reject(err);
                    } finally {
                        active--;
                        next();
                    }
                })();
            }
        };
        next();
    });
}


