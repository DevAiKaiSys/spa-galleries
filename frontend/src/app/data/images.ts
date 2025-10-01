export interface ImageItem {
  id: number;
  url: string;
  keywords: string[];
}

function getRandomLetter() {
  const charCode = 97 + Math.floor(Math.random() * 26); // a=97 → z=122
  return String.fromCharCode(charCode);
}

function getRandomKeywords(): string[] {
  const count = Math.floor(Math.random() * 7) + 1;
  const keywordsSet = new Set<string>();

  while (keywordsSet.size < count) {
    const keyword = `keyword_${getRandomLetter()}`;
    keywordsSet.add(keyword); 
  }

  return Array.from(keywordsSet);
}


export const images: ImageItem[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i,
  url: `https://placehold.co/${200 + (i % 5) * 50}x${150 + (i % 3) * 40}`,
  keywords: getRandomKeywords(),
}));
