import { Component, OnInit, Output } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Userdata } from '../../model/userdata';
import { Router } from '@angular/router';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrl: './username.component.css',
})
export class UsernameComponent implements OnInit {
  student!: Userdata;
  studentlist: Userdata[] = [];
  studentId = 'your-student-id';

  @Output() change: boolean = false;
  phonenumber: any;
  email: any;
  current_username!: string;

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private dialog: MatDialog,
    private router: Router,
    private data:DataService
  ) {}

  ngOnInit(): void {
    this.loggedInUser();
    this.userName(this.studentId).subscribe(
      (result) => {
        this.current_username = result;
      },
      (error) => {
        console.error('Error retrieving username:', error);
      }
    );
  }

  userName(userId: string): Observable<string> {
    // Use AngularFirestore to query the "Users" collection based on the user ID
    return this.firestore
      .collection('Users', (ref) => ref.where('id', '==', userId))
      .valueChanges({ idField: 'id' })
      .pipe(
        map((users: any[]) => {
          // Assuming 'username' is the field in the document that contains the username
          const user = users[0]; // Since the query is based on ID, there should be at most one user
          return user ? user.firstname : String;
        })
      );
  }
  loggedInUser() {
    this.studentId = this.auth.loggedId;
    this.current_username = this.auth.loggedUsername;
    this.email = this.auth.loggedEmail;
    this.phonenumber = this.auth.loggedPhonenumber;
  }

  updateStudentUsername(current_username: string) {
    this.firestore
      .collection('/Users/', (ref) => ref.where('email', '==', this.email))
      .get()
      .subscribe((snapshot) => {
        if (snapshot.size === 1) {
          const userData = snapshot.docs[0].data() as any;
          // Access additional user data and perform further actions if needed
          console.log(userData);

          // Update the user's address
          userData.firstname = this.current_username;

          // Get the reference to the specific document
          const userDocRef = snapshot.docs[0].ref;

          // Update the document in Firestore
          userDocRef
            .update(userData)
            .then(() => {
              console.log('User data updated successfully');
              this.change = true;
            })
            .catch((error) => {
              console.error('Error updating user data:', error);
            });
        } else {
          console.error('User not found in Firestore');
        }
      });
    this.dialog.closeAll();
    // this.router.navigate(['/dashboard']);
    this.data.setBooleanVariableUsername(false);
  }
  close_Dialog() {
    this.dialog.closeAll();
    // this.router.navigate(['/dashboard']);
    this.data.setBooleanVariableUsername(false);

  }
}
