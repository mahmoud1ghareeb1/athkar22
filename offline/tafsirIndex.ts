export const getTafsirUrlMap = (): Record<string, string> => {
  const g1 = import.meta.glob('../data/ar-tafseer-al-saddi/*/*.json', { as: 'url', eager: true }) as Record<string, string>;
  const g2 = import.meta.glob('@/data/ar-tafseer-al-saddi/*/*.json', { as: 'url', eager: true }) as Record<string, string>;
  const entries: [string, string][] = [];
  for (const [k, url] of Object.entries({ ...g1, ...g2 })) {
    const m = k.match(/ar-tafseer-al-saddi\/(\d+)\/(\d+)\.json$/);
    if (m) {
      const key = `${m[1]}/${m[2]}.json`;
      entries.push([key, url]);
    }
  }
  return Object.fromEntries(entries);
};
