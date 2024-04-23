import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Post } from '../../models/post';

describe('AuthService', () => {
  let service: AuthService;
  let httpClient: HttpClient;
  let httTest: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);
    httTest = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httTest.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const User: any = {
      name: 'testuser',
      email: 'testemail',
      gender: 'testgender',
      status: 'teststatus',
    };
    const token = 'token';
    const body = {
      name: 'testuser',
      email: 'testemail',
      gender: 'testgender',
      status: 'teststatus',
    };

    service.registerUser(body, token).subscribe((user) => {
      expect(user).toEqual(User);
    });

    const req = httTest.expectOne(`${service.apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(User);
  });

  it('should delete a user', () => {
    const token = 'dummyToken';
    const id = 1;
    service.deleteUser(id, token).subscribe(() => {
      expect(id).toEqual(id);
    });

    const req = httTest.expectOne(`${service.apiUrl}/users/${id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  it('should retrieve a post list', () => {
    const page = 1;
    const per_page = 10;
    const token = 'dummyToken';
    const Posts: Post[] = [];

    service.postList(page, per_page, token).subscribe((posts) => {
      expect(posts).toEqual(Posts);
    });

    const req = httTest.expectOne(
      `${service.apiUrl}/posts?page=${page}&per_page=${per_page}`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(Posts);
  });

  it('should create a post', () => {
    const post = { user_id: 1, title: 'New Post', body: 'This is a new post' };
    const token = 'token';
    const id = 1;
    const expectedUrl = `${service.apiUrl}/users/${id}/posts`;

    service.createPost(post, token).subscribe();

    const req = httTest.expectOne(
      (req) => req.url === expectedUrl && req.method === 'POST'
    );
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${token}`);
    req.flush({});
  });

  it('create a comment', () => {
    const comment = {
      post_id: 1,
      name: 'user1',
      email: '1CfH8@example.com',
      body: 'This is a new comment',
    };
    const token = 'token';
    const id = 1;
    const expectedUrl = `${service.apiUrl}/posts/${id}/comments`;

    service.createComment(comment, token).subscribe();

    const req = httTest.expectOne(
      (req) => req.url === expectedUrl && req.method === 'POST'
    );
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${token}`);
    req.flush({});
  });

  it('should get comments for a post', () => {
    const id = 1;
    const token = 'dummyToken';
    const expectedUrl = `${service.apiUrl}/posts/${id}/comments`;

    service.userComment(id, token).subscribe();

    const req = httTest.expectOne(
      (req) => req.url === expectedUrl && req.method === 'GET'
    );
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${token}`);
    req.flush([]);
  });

  it('should load users', () => {
    const token = 'dummyToken';
    const expectedUrl = `${service.apiUrl}/users`;
    service.loadUsers(token).subscribe();

    const req = httTest.expectOne(
      (req) => req.url === expectedUrl && req.method === 'GET'
    );
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${token}`);
    req.flush([]);
  });
});
