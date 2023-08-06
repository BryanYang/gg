

export interface CommunityFeedback {
  id: string;
  userID: string;
  communityID: string;
  // 1: viewed, 2: favorite, 3: like, 4: comment
  type: number;
  comment?: string;
}