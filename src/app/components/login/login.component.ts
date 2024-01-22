import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage:string=''

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  async login() {
    try {
      if (this.email === '') {
        throw new Error('Please enter email');
      }
  
      if (this.password === '') {
        throw new Error('Please enter password');
      }
  
      await this.auth.login(this.email, this.password);
  
      // Navigate or perform other actions on successful login
      this.email = '';
      this.password = '';
      this.errorMessage = ''; // Reset the error message on successful login
    } catch (error:any) {
      // Handle login error
      this.errorMessage = error.message || 'Invalid email or password';
    }
  }
  signInWithGoogle() {
    this.auth.googleSignIn();
  }
}
