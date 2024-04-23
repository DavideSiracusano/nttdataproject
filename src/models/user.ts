import { Post } from './post';

export interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
  posts: Post[];
}
