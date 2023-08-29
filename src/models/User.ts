
export interface User {
  id: number;
  email: string;

  username: string;
  class: string;

  password: string;
  createdAt: number;
  updatedAt: number;
  avatar: string;

  isTeacher?: boolean;
}