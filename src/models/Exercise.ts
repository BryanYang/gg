


export interface ExerciseOption {
  id: string | number;
  description: string;
}

export interface Exercise {
  id: string | number;
  title: string;
  score: number;
  options: ExerciseOption[];
  answerIDs: string[];
}