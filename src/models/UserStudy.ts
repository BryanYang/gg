

export interface UserStudy {
  id: string;
  caseID: string;
  userID: string;
  startDate: number;
  endDate?: number;
  // 实验状态
  state: number;
  reportID?: string;
}