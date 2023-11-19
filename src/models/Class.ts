

export interface ClassList {
  id: string;
  name: string;
  teacherID: number;
  description: string;
  
  count?: number;
  teacher?: string;

  isDeleted?: boolean;
  createdAt: number;
  updatedAt: number; 
}
