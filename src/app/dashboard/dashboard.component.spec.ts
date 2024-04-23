import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
      ],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadUsers on initialization', () => {
    spyOn(component, 'loadUsersAndPosts');
    component.ngOnInit();

    expect(component.loadUsersAndPosts).toHaveBeenCalled();
  });

  it('should call seePosts on initialization', () => {
    spyOn(component, 'seePosts');
    component.ngOnInit();

    expect(component.seePosts).toHaveBeenCalled();
  });

  it('should filter posts by title', () => {
    component.posts = [
      {
        id: 1,
        user_id: 1,
        title: 'Post 1',
        body: 'Post body',
        comments: [],
        userName: 'User 1',
      },
      {
        id: 2,
        user_id: 2,
        title: 'Post 2',
        body: 'Post body',
        comments: [],
        userName: 'User 2',
      },
    ];

    const event = new Event('input');
    Object.defineProperty(event, 'target', {
      value: { value: 'Post 1' },
    });
    component.applyFilter(event);

    expect(component.filteredList.length).toBe(1);
    expect(component.filteredList[0].title).toBe('Post 1');
  });

  it('should show all posts if filter value is empty', () => {
    component.posts = [
      {
        id: 1,
        user_id: 1,
        title: 'Post 1',
        body: 'Post body',
        comments: [],
        userName: 'User 1',
      },
      {
        id: 2,
        user_id: 2,
        title: 'Post 2',
        body: 'Post body',
        comments: [],
        userName: 'User 2',
      },
    ];

    const event = new Event('input');

    Object.defineProperty(event, 'target', {
      value: { value: '' },
    });

    component.applyFilter(event);

    expect(component.filteredList.length).toBe(2);
    expect(component.filteredList[0].title).toBe('Post 1');
    expect(component.filteredList[1].title).toBe('Post 2');

    expect(component.filteredList).toEqual(component.posts);
  });
});
