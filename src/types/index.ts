
export interface Mezmur {
  id: number;
  title: string;
  lyrics: string[];
  ትርጉም?: string;
  category?: string;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}
