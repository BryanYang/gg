import { Exercise } from "./Exercise";
import { User } from "./User";
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
  [CaseStep.Execute]: "执行缓解",
  [CaseStep.Report]: "评估环节",
  [CaseStep.Finish]: "完成",
};

// export const TestCase: Case = {
//   id: "1",
//   title: "",
//   description: "农夫山泉",
//   videoUrl: "http://sss.com",
//   link: "has",
//   studyCount: 0,
//   createdAt: new Date().getTime(),
//   exercises: {
//     [CaseStep.Survey]: {
//       '1': [
//         {
//           id: 1,
//           title: "题目1",
//           score: 40,
//           options: [
//             { id: 1, description: "答案一" },
//             { id: 2, description: "答案一" },
//             { id: 3, description: "答案一" },
//             { id: 4, description: "答案一" },
//           ],
//           answerIDs: [],
//         },
//       ]
//     },
//     [CaseStep.Design]: {
//       '2': [
//         {
//           id: 2,
//           title: "题目2",
//           score: 30,
//           options: [
//             { id: 1, description: "答案一" },
//             { id: 2, description: "答案一" },
//             { id: 3, description: "答案一" },
//             { id: 4, description: "答案一" },
//           ],
//           answerIDs: [],
//         },
//       ]
//     },
//     [CaseStep.Execute]: {
//       '3': [
//         {
//           id: 3,
//           title: "题目3",
//           score: 30,
//           options: [
//             { id: 1, description: "答案一" },
//             { id: 2, description: "答案一" },
//             { id: 3, description: "答案一" },
//             { id: 4, description: "答案一" },
//           ],
//           answerIDs: [],
//         },
//       ]
//     },
//   },
// };

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
  // {
  //   [CaseStep.Survey]: {
  //     [institutionID]: [...]
  //   }
  // }
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

// export const TestCaseStudy: CaseStudy = new CaseStudy({
//   case: TestCase,
//   user: { username: 'yang', id: '1'} as User,
//   currentStep: CaseStep.Execute,
//   answer: {},
// });
