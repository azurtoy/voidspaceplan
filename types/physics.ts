export interface TextbookRef {
  chapter: number;
  page: number;
}

export interface Formula {
  id: string;
  name: string;
  latex: string;
  description: string;
  textbookRef: TextbookRef;
  relatedProblemIds: string[];
  variables?: {
    symbol: string;
    meaning: string;
    unit?: string;
  }[];
}

export interface Problem {
  id: string;
  chapterNumber: number;
  problemNumber: number;
  question: string;
  given?: string[];
  solution: {
    steps: string[];
    finalAnswer: string;
  };
  usedFormulaIds: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface ChapterData {
  number: number;
  title: string;
  summary: string;
  imageUrl?: string;
  formulas: Formula[];
  problems: Problem[];
}

export interface PhysicsData {
  chapters: ChapterData[];
}
