export type SubjectSummaryItem = {
  name: string;
  imageUrl?: string;
  levelName?: string;
  count: number;
  durationLabel: string;
  dotClass: string;
};

export type ExamDisplayItem = {
  id: number;
  title: string;
  duration: number;
  maxAttempts?: number;
  isActive: boolean;
  type?: string;
};

