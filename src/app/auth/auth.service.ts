import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../models/user';
import { Observable } from 'rxjs';
import { Auth } from '../../models/auth';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import { RegisterPost } from '../../models/register-post';
import { UserSub } from '../../models/user-sub';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'https://gorest.co.in/public/v2'; //go rest api url

  logged: boolean = true;
  loggedUser: User | undefined;
  constructor(private router: Router, private http: HttpClient) {}

  registerUser(body: UserSub, token: string): Observable<UserSub> {
    // Creazione dell'header con il Bearer token
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    // Aggiunta dell'header alla richiesta HTTP
    return this.http.post<User>(`${this.apiUrl}/users`, body, { headers });
  }

  loginUser(token: string): Observable<Auth> {
    // Creazione dell'header con il Bearer token
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    // Aggiunta dell'header alla richiesta HTTP
    return this.http.get<Auth>(`${this.apiUrl}/users`, { headers });
  }

  logOut() {
    this.logged = false;
    this.loggedUser = undefined;
    localStorage.removeItem('authData');
    this.router.navigate(['login']);
  }

  userList(page: number, perPage: number, token: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(
      `${this.apiUrl}/users?page=${page}&per_page=${perPage}`,
      { headers }
    );
  }

  userDetail(id: number, token: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/users/` + id, { headers });
  }

  loadUsers(token: string): Observable<User[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
  }

  deleteUser(id: number, token: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.delete<any>(`${this.apiUrl}/users/` + id, { headers });
  }

  userPost(id: number, token: string): Observable<Post[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<Post[]>(`${this.apiUrl}/users/${id}/posts`, {
      headers,
    });
  }

  postList(page: number, perPage: number, token: string): Observable<Post[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<Post[]>(
      `${this.apiUrl}/posts?page=${page}&per_page=${perPage}`,
      {
        headers,
      }
    );
  }

  createPost(post: RegisterPost, token: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/users/${post.user_id}/posts`, post, {
      headers,
    });
  }

  userComment(id: number, token: string): Observable<Comment[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<Comment[]>(`${this.apiUrl}/posts/${id}/comments`, {
      headers,
    });
  }

  createComment(comment: Comment, token: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post(
      `${this.apiUrl}/posts/${comment.post_id}/comments`,
      comment,
      { headers }
    );
  }

  isAuthenticated(): boolean {
    if (
      localStorage.getItem('currentUser') ||
      localStorage.getItem('authData')
    ) {
      this.logged = true;
      this.loggedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return true;
    } else {
      this.logged = false;
      this.loggedUser = undefined;
      return false;
    }
  }
}
