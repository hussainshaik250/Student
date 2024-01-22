import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DataService } from '../../shared/data.service';
import { ErrorMessages, Routes } from '../../../../utils/const';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
})
export class PasswordComponent implements OnInit {
  userPassword!: string;
  userEmail!: string;
  newPassword!: string;
  password1!: string;
  confirm_password: any;
  new_password: any;
  passwordVisible: boolean = false;
  isPasswordVisible: boolean=true;
  showPassword: boolean=false;

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private dialog: MatDialog,
    private router: Router,
    private data:DataService
  ) {}

  ngOnInit(): void {
    this.loggedUser();
  }

  loggedUser() {
    this.userPassword = this.auth.loggedPassword;
    this.userEmail = this.auth.loggedEmail;
  }
 
  updatePassword(password1: string) {
    if (this.password1 == this.userPassword) {
      if (this.confirm_password == this.new_password) {
        this.firestore
          .collection('/Users/', (ref) =>
            ref.where('email', '==', this.userEmail)
          )
          .get()
          .subscribe((snapshot) => {
            if (snapshot.size === 1) {
              const userData = snapshot.docs[0].data() as any;
              // Access additional user data and perform further actions if needed
              console.log(userData);

              // Update the user's address
              userData.password = this.new_password;

              // Get the reference to the specific document
              const userDocRef = snapshot.docs[0].ref;

              // Update the document in Firestore

              userDocRef
                .update(userData)
                .then(() => {
                  console.log('User data updated successfully');
                })
                .catch((error) => {
                  console.error('Error updating user data:', error);
                });
            } else {
              console.error('User not found in Firestore');
            }
            this.dialog.closeAll();
            // this.router.navigate([Routes.Dashboard]);
          });
      } else {
        alert(ErrorMessages.PasswordMatch);
      }
    } else {
      alert(ErrorMessages.WrongPaaword);
    }
    this.data.setBooleanVariablePassword(false);
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  // togglePasswordVisibility(passwordInput: HTMLInputElement): void {
  //   this.isPasswordVisible = !this.isPasswordVisible;
  //   passwordInput.type = this.isPasswordVisible ? 'text' : 'password';
  // }
  close_Dialog() {
    this.dialog.closeAll();
    // this.router.navigate(['/dashboard']);
    this.data.setBooleanVariablePassword(false);

  }
}
