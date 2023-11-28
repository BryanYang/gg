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
  type: string;
  options: ExerciseOption[];
  answerIDs: string[];
  analysis?: string;
  tip?: string;
  step: CaseStep;
  institution: Institution;
}