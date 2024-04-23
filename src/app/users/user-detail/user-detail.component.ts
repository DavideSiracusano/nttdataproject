import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../../models/user';
import { Post } from '../../../models/post';
import { Comment } from '../../../models/comment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent implements OnInit {
  user!: User;
  posts: Post[] = [];
  comments: Comment[] = [];
  commentsMap: { [postId: number]: Comment[] } = {};
  userId!: number;
  postId!: number;
  token!: string;
  newCommentText: string[] = [];
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      this.loadUserDetails();
      this.loadPosts();
      this.postId = params['post_Id'];
    });
  }

  loadUserDetails() {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const token = authData.token;
    this.authService.userDetail(this.userId, token).subscribe((data: any) => {
      this.user = data;
      console.log('User details loaded:', this.user);
    });
  }

  loadPosts() {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const token = authData.token;
    this.authService.userPost(this.userId, token).subscribe((data: any) => {
      this.posts = data;
      console.log('Posts loaded:', this.posts);
      this.posts.forEach((post) => {
        this.loadComments(post.id);
      });
    });
  }

  loadComments(postId: number) {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const token = authData.token;

    this.authService.userComment(postId, token).subscribe((data: Comment[]) => {
      this.commentsMap[postId] = data;
      console.log('Comments loaded:', this.commentsMap[postId]);
    });
  }

  createComments(postId: number) {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const token = authData.token;
    const index = this.posts.findIndex((post) => post.id === postId);
    if (index !== -1) {
      const commentContent = {
        post_id: postId,
        name: this.user.name,
        email: this.user.email,
        body: this.newCommentText[index], // Get newCommentText for the specific post
      };

      this.authService.createComment(commentContent, token).subscribe(
        (data: any) => {
          console.log('Comment created', data);
          this.loadComments(postId); // Reload comments for the current post after creating a new one
          this.newCommentText[index] = ''; // Clear newCommentText for the specific post
        },
        (error: any) => {
          console.error('Error creating comment:', error);
        }
      );
    }
  }
}
