import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { AuthService } from '../auth/auth.service';
import { User } from '../../models/user';
import { Comment } from '../../models/comment';
import { RegisterPost } from '../../models/register-post';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  posts: Post[] = [];
  comments: Comment[] = [];
  title: string = '';
  body: string = '';
  newPost: RegisterPost = {
    user_id: 0,
    title: '',
    body: '',
  };

  commentsMap: { [postId: number]: Comment[] } = {};
  filteredList: Post[] = [];
  currentPage = 1;
  perPage = 20;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsersAndPosts();
    this.seePosts();
  }

  loadUsersAndPosts() {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const token = authData.token;
    this.authService.loadUsers(token).subscribe(
      (users: User[]) => {
        this.users = users;
        this.users.forEach((user) => {
          this.authService.userDetail(user.id, token).subscribe(
            (userPosts: Post[] | any) => {
              if (Array.isArray(userPosts)) {
                userPosts.forEach((post: Post) => {
                  post.userName = user.name;
                  this.posts.push(post);
                  this.loadComments(post.id, token);
                  // Load comments for each post
                });
              } else {
                console.warn('No posts found for user:', user);
              }
            },
            (error: any) => {
              console.error('Error loading user posts:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  loadComments(postId: number, token: string) {
    this.authService.userComment(postId, token).subscribe((data: Comment[]) => {
      this.commentsMap[postId] = data;
    });
  }

  seePosts() {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const token = authData.token;
    this.authService
      .postList(this.currentPage, this.perPage, token)
      .subscribe((filteredPost: any) => {
        this.posts = filteredPost;
        this.posts.forEach((post) => {
          this.loadComments(post.id, token);
        });
      });
  }

  createPost() {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const token = authData.token;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.id;

    console.log('User ID:', userId);

    this.newPost = {
      user_id: userId || this.users[0].id, // Use the first user
      title: this.title,
      body: this.body,
    };

    this.authService.createPost(this.newPost, token).subscribe((data: any) => {
      console.log('Post created:', data);
      this.seePosts();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue !== undefined) {
      if (!filterValue) {
        // If the input value is empty, show all users
        this.filteredList = [...this.posts];
      } else {
        // Filter posts by title
        this.filteredList = this.posts.filter((post) =>
          post.title.toLowerCase().includes(filterValue)
        );
      }
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.seePosts();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.seePosts();
  }
}
