import { CaseStep } from "./Case";
import { Institution } from "./Institution";



export interface ExerciseOption {
  id: string | number;
  description: string;
}

export interface Exercise {
  id: number;
  title: string;
  score: number;
  options: ExerciseOption[];
  answerIDs: string[];
  step: CaseStep;
  institution: Institution;
}