import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../../models/auth';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      token: new FormControl('', Validators.required),
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      let authData: Auth = {
        dateMill: new Date().getTime() + 60 * 60 * 1000, // user login expires after an hour
        token: this.loginForm.get('token')?.value,
      };
      this.authService.loginUser(authData.token).subscribe((loggedUser) => {
        console.log('Utente loggato:', loggedUser);
        localStorage.setItem('currentUser', JSON.stringify(loggedUser));
        localStorage.setItem('authData', JSON.stringify(authData));
        this.router.navigate(['/users']);
      });
    }
  }
}
