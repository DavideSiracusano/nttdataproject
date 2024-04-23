import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { User } from '../../models/user';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatIcon,
        MatTableModule,
        BrowserAnimationsModule,
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call seeUsers on initialization', () => {
    spyOn(component, 'seeUsers');

    component.ngOnInit();

    expect(component.seeUsers).toHaveBeenCalled();
  });

  it('it should delete user', () => {
    const id = 1;
    const authData = { token: 'token' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(authData));
    spyOn(localStorage, 'removeItem');
    spyOn(component, 'seeUsers');

    component.deleteOneUser(id);

    expect(localStorage.getItem).toHaveBeenCalledWith('authData');
    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser' + id);
  });

  it('should not fetch users when there is no token in authData', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.seeUsers();

    expect(component.users).toEqual([]);
    expect(component.dataSource.data).toEqual([]);
  });

  it('should not decrease currentPage if currentPage is 1', () => {
    component.currentPage = 1;
    spyOn(component, 'seeUsers');

    component.previousPage();

    expect(component.currentPage).toEqual(1);
    expect(component.seeUsers).not.toHaveBeenCalled();
  });
});
