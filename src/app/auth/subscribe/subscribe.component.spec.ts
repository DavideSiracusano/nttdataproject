import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { SubscribeComponent } from './subscribe.component';
import { UserSub } from '../../../models/user-sub';
import { Auth } from '../../../models/auth';
import { Router } from '@angular/router';

describe('SubscribeComponent', () => {
  let component: SubscribeComponent;
  let fixture: ComponentFixture<SubscribeComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['registerUser']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscribeComponent],
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
      providers: [
        FormBuilder, // Provide FormBuilder
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscribeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize subscribeForm with required fields', () => {
    component.ngOnInit();
    expect(component.subscribeForm).toBeDefined();
    expect(component.subscribeForm.get('name')).toBeDefined();
    expect(component.subscribeForm.get('email')).toBeDefined();
    expect(component.subscribeForm.get('gender')).toBeDefined();
    expect(component.subscribeForm.get('token')).toBeDefined();
  });

  it('should set subscribeForm values', () => {
    const users: UserSub = {
      name: 'name',
      email: 'email',
      gender: 'gender',
      status: 'status',
    };

    const auth: Auth = {
      dateMill: new Date().getTime(),
      token: 'token',
    };

    component.subscribeForm.setValue({
      name: users.name,
      email: users.email,
      gender: users.gender,
      token: auth.token,
    });
    // Assert individual form control values
    expect(component.subscribeForm.get('name')?.value).toEqual(users.name);
    expect(component.subscribeForm.get('email')?.value).toEqual(users.email);
    expect(component.subscribeForm.get('gender')?.value).toEqual(users.gender);
    expect(component.subscribeForm.get('token')?.value).toEqual(auth.token);
  });

  it('should register user on form submission', () => {
    const newUser = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    };
    authService.registerUser.and.returnValue(of(newUser));

    const formData = {
      name: 'John',
      email: 'john@example.com',
      gender: 'male',
      token: '1',
      status: 'active',
    };
    component.subscribeForm.patchValue(formData);
    component.onSubmit();

    expect(authService.registerUser).toHaveBeenCalledWith(
      component.user,
      formData.token
    );
    expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(newUser));
    expect(localStorage.getItem('authData')).toBeTruthy(); // Ensure authData is stored
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users']);
  });
});
