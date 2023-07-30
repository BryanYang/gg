import { Exercise } from "./Exercise";
export enum CaseStep {
  Survey = 1,
  Design = 2,
  Execute = 3,
  Report = 4,
}

export interface Case {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  link?: string;

  // {
  //   [CaseStep.Survey]: {
  //     [institutionID]: [...]
  //   }
  // }
  exercises: Partial<Record<CaseStep, Record<string ,Exercise[]>>>;
}

export interface CaseStudyInterface {
  caseID: string;
  userID: string;
  currentStep: CaseStep;
  currentExerciseID?: string;
  // key: exerciseID, value: ExerciseOptionID
  answer: Record<string, string[]>;
  score?: number;
  reportID?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class CaseStudy implements CaseStudyInterface {
  public caseID: string;
  public userID: string;
  public currentStep: CaseStep;
  public currentExerciseID?: string;
  // key: exerciseID, value: ExerciseOptionID
  public answer: Record<string, string[]>;
  public score?: number;
  public reportID?: string;
  createdAt?: string;
  updatedAt?: string;

  constructor(data: Omit<CaseStudyInterface, "createdAt" | "updatedAt">) {
    this.caseID = data.caseID;
    this.userID = data.userID;
    this.currentStep = data.currentStep;
    this.answer = data.answer;
    this.score = data.score;
    this.reportID = data.reportID;
    this.currentExerciseID = data.currentExerciseID;
  }

  public getCase: () => Promise<Case> = async () => {
    return Promise.resolve(TestCase);
  };
}

export const TestCaseStudy: CaseStudy = new CaseStudy({
  caseID: "1",
  userID: "1",
  currentStep: CaseStep.Survey,
  answer: {},
});

export const TestCase: Case = {
  id: "1",
  title: "",
  description: "农夫山泉",
  videoUrl: "http://sss.com",
  link: "has",
  exercises: {
    [CaseStep.Survey]: [{
      id: 1,
      title: "题目1",
      score: 40,
      options: [
        { id: 1, description: "答案一" },
        { id: 2, description: "答案一" },
        { id: 3, description: "答案一" },
        { id: 4, description: "答案一" },
      ],
      answerIDs: [],
    }],
    [CaseStep.Design]: [{
      id: 1,
      title: "题目1",
      score: 30,
      options: [
        { id: 1, description: "答案一" },
        { id: 2, description: "答案一" },
        { id: 3, description: "答案一" },
        { id: 4, description: "答案一" },
      ],
      answerIDs: [],
    }],
    [CaseStep.Execute]: [{
      id: 1,
      title: "题目1",
      score: 30,
      options: [
        { id: 1, description: "答案一" },
        { id: 2, description: "答案一" },
        { id: 3, description: "答案一" },
        { id: 4, description: "答案一" },
      ],
      answerIDs: [],
    }],
  },
}
