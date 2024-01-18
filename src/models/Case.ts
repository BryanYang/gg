import { Exercise } from "./Exercise";
import { Institution } from "./Institution";
export enum CaseStep {
  Video = 0,
  Survey = 1,
  Design = 2,
  Execute = 3,
  Finish = 4,
}

export const CaseStepTitle = {
  [CaseStep.Video]: "观看视频",
  [CaseStep.Survey]: "调研环节",
  [CaseStep.Design]: "策划环节",
  [CaseStep.Execute]: "执行环节",
  [CaseStep.Finish]: "完成",
};

export interface Case {
  id: number;
  title: string;
  description: string;
  types?: string[];
  pic?: string;
  videoUrl?: string;
  link?: string;
  createdAt: number;
  isDeleted?: boolean;

  studyCount: number;
  status: number;
  exercises: Exercise[];
  institutions?: Institution[];
}

export interface CaseStudy {
  id: number;
  caseID: number;
  userID: number;
  currentStep: CaseStep;
  currentExerciseID?: string;
  // key: exerciseID, value: ExerciseOptionID
  answer: Record<string, string[]>;
  endDate?: Date,
  score?: number;
  state: number;
  summary?: string;
  reportID?: string;
  createdAt?: string;
  updatedAt?: string;
}
