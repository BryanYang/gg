import { Exercise } from "./Exercise";
export enum CaseStep {
  Video = 0,
  Survey = 1,
  Design = 2,
  Execute = 3,
  Report = 4,
  Finish = 5,
}

export const CaseStepTitle = {
  [CaseStep.Video]: "观看视频",
  [CaseStep.Survey]: "调研环节",
  [CaseStep.Design]: "策划环节",
  [CaseStep.Execute]: "执行环节",
  [CaseStep.Report]: "评估环节",
  [CaseStep.Finish]: "完成",
};

export interface Case {
  id: number;
  title: string;
  description: string;
  pic?: string;
  videoUrl?: string;
  link?: string;
  createdAt: number;
  isDeleted?: boolean;

  studyCount: number;

  exercises: Exercise[];
}

export interface CaseStudy {
  id: number;
  caseID: number;
  userID: number;
  currentStep: CaseStep;
  currentExerciseID?: string;
  // key: exerciseID, value: ExerciseOptionID
  answer: Record<string, string[]>;
  score?: number;
  state: number;
  summary?: string;
  reportID?: string;
  createdAt?: string;
  updatedAt?: string;
}
