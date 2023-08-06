

export interface Message {
  id: string;
  userID: string;
  templateID: string;
  createdAt: number;
  updatedAt: number; 
  // 1. sent 2 read
  state: number;
  isDeleted?: boolean;
}