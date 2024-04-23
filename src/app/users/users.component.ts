import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../auth/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = ['name', 'email', 'delete'];
  filteredList: User[] = [];
  currentPage = 1;
  perPage = 20;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.seeUsers();
  }

  seeUsers() {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const token = authData.token;
    if (token) {
      this.authService
        .userList(this.currentPage, this.perPage, token)
        .subscribe((users: any) => {
          this.users = users;
          this.dataSource = new MatTableDataSource(this.users);
        });
    }
  }

  deleteOneUser(id: number): void {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const token = authData.token;
    localStorage.removeItem('currentUser' + id);
    this.authService.deleteUser(id, token).subscribe({
      next: (data) => {
        console.log(data);
        this.seeUsers();
      },
      error: (error) => {
        console.error("Errore durante l'eliminazione dell'utente:", error);
      },
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (!filterValue) {
      // If the input value is empty, show all users
      this.filteredList = [...this.users];
    } else {
      // Filter users by name or email
      this.filteredList = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(filterValue) ||
          user.email.toLowerCase().includes(filterValue)
      );
    }

    // Update the data source for the table
    this.dataSource.data = this.filteredList;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.seeUsers();
    }
  }
  nextPage(): void {
    this.currentPage++;
    this.seeUsers();
  }
}
