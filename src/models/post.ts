import { Comment } from './comment';

export interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
  comments: Comment[];
  userName: string;
}
