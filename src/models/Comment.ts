export interface Comment {
  id: number;
  userID: number;
  content: string;
  postID: number;
  user?: {
    username: string;
    class: string;
    email: string;
  };
  createdAt: string;
}
