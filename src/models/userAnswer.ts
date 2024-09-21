import { Exercise } from "./Exercise";

export type UserAnswer = {
  id: number;
  caseStudyID: number;

  exerciseID: number;
  answers: number[];

  exercise?: Exercise;
};
