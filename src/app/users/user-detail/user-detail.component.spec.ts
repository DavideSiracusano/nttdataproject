import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailComponent } from './user-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import jasmine from 'jasmine';
import { AuthService } from '../../auth/auth.service';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let activatedRoute: any;

  const users = {
    id: 1,
    name: 'name',
    email: 'email',
    gender: 'gender',
    status: 'status',
    posts: [],
  };

  beforeEach(async () => {
    activatedRoute = {
      params: of({ id: 1 }),
    };
    await TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      imports: [HttpClientModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadUserDetails', () => {
    spyOn(component, 'loadUserDetails');
    component.ngOnInit();

    expect(component.loadUserDetails).toHaveBeenCalled();
  });

  it('should call loadPosts on initialization', () => {
    spyOn(component, 'loadPosts');
    component.ngOnInit();

    expect(component.loadPosts).toHaveBeenCalled();
  });
});
