import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../../../models/user';

import { Auth } from '../../../models/auth';
import { Router } from '@angular/router';
import { UserSub } from '../../../models/user-sub';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.css',
})
export class SubscribeComponent implements OnInit {
  subscribeForm!: FormGroup;
  user: UserSub = {
    name: '',
    email: '',
    gender: '',
    status: '',
  };
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.subscribeForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
      ]),
      gender: new FormControl('', Validators.required),
      token: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.subscribeForm.valid) {
      this.user = {
        name: this.subscribeForm.get('name')?.value,
        email: this.subscribeForm.get('email')?.value,
        gender: this.subscribeForm.get('gender')?.value,
        status: 'active',
      };

      let authData: Auth = {
        dateMill: new Date().getTime() + 60 * 60 * 1000, // user login expires after an hour
        token: this.subscribeForm.get('token')?.value,
      };

      // Chiamata a registerUser() del servizio AuthService con il Bearer token
      this.authService.registerUser(this.user, authData.token).subscribe(
        (newUser) => {
          console.log('Nuovo utente registrato:', newUser);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          localStorage.setItem('authData', JSON.stringify(authData));
          this.router.navigate(['/users']);
        },
        (error: any) => {
          console.error("Errore durante la registrazione dell'utente:", error);
          if (error.status === 422) {
            console.log('Dettagli degli errori di validazione:', error.error);
            // Puoi gestire gli errori di validazione qui, ad esempio visualizzando un messaggio all'utente
          }
        }
      );
    }
  }
}
