import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../auth/auth.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['logOut']);
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [HttpClientModule, MatToolbar, MatToolbarRow, MatIcon],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout method on AuthService when logout is called', () => {
    component.logout();

    expect(authService.logOut).toHaveBeenCalled();
  });

  it('should log a message after logout', () => {
    spyOn(console, 'log');

    component.logout();

    expect(console.log).toHaveBeenCalledWith('Logout eseguito');
  });
});
