import { Exercise } from "./Exercise";
import { User } from "./User";
export enum CaseStep {
  Survey = 1,
  Design = 2,
  Execute = 3,
  Report = 4,
}

export const TestCase: Case = {
  id: "1",
  title: "",
  description: "农夫山泉",
  videoUrl: "http://sss.com",
  link: "has",
  studyCount: 0,
  createdAt: new Date().getTime(),
  exercises: {
    [CaseStep.Survey]: {
      '1': [
        {
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
        },
      ]
    },
    [CaseStep.Design]: {
      '2': [
        {
          id: 2,
          title: "题目2",
          score: 30,
          options: [
            { id: 1, description: "答案一" },
            { id: 2, description: "答案一" },
            { id: 3, description: "答案一" },
            { id: 4, description: "答案一" },
          ],
          answerIDs: [],
        },
      ]
    },
    [CaseStep.Execute]: {
      '3': [
        {
          id: 3,
          title: "题目3",
          score: 30,
          options: [
            { id: 1, description: "答案一" },
            { id: 2, description: "答案一" },
            { id: 3, description: "答案一" },
            { id: 4, description: "答案一" },
          ],
          answerIDs: [],
        },
      ]
    },
  },
};


export interface Case {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  link?: string;
  createdAt: number;
  isDeleted?: boolean;

  studyCount: number;
  // {
  //   [CaseStep.Survey]: {
  //     [institutionID]: [...]
  //   }
  // }
  exercises: Partial<Record<CaseStep, Record<string, Exercise[]>>>;
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
  public case: Case;
  public user: User;
  public currentStep: CaseStep;
  public currentExerciseID?: string;
  // key: exerciseID, value: ExerciseOptionID
  public answer: Record<string, string[]>;
  public score?: number;
  public reportID?: string;
  createdAt?: string;
  updatedAt?: string;

  constructor(
    data: Pick<CaseStudyInterface, "currentStep" | "answer" | 'currentExerciseID'> & {
      case: Case;
      user: User;
    }
  ) {
    this.case = data.case;
    this.user = data.user;
    this.currentStep = data.currentStep;
    this.answer = data.answer;
    this.currentExerciseID = data.currentExerciseID;
  }

  get caseID() {
    return this.case.id;
  }

  get userID() {
    return this.user.id;
  }

  public getCase: () => Promise<Case> = async () => {
    return Promise.resolve(TestCase);
  };
}

export const TestCaseStudy: CaseStudy = new CaseStudy({
  case: TestCase,
  user: { name: 'yang', id: '1'} as User,
  currentStep: CaseStep.Execute,
  answer: {},
});

