export const getTafsirUrls = (): string[] => {
  const g1 = import.meta.glob('../data/ar-tafseer-al-saddi/*/*.json', { as: 'url', eager: true }) as Record<string, string>;
  const g2 = import.meta.glob('@/data/ar-tafseer-al-saddi/*/*.json', { as: 'url', eager: true }) as Record<string, string>;
  const urls = [...Object.values(g1), ...Object.values(g2)];
  return Array.from(new Set(urls));
};
