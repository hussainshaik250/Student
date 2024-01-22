import { Component, OnInit, ViewChild } from '@angular/core';
import {MatMenuTrigger} from '@angular/material/menu';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { PasswordComponent } from '../password/password.component';
import { UsernameComponent } from '../username/username.component';
import { DataService } from '../../shared/data.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  @ViewChild('menu') menuTrigger!: MatMenuTrigger;
  @ViewChild('changeUsernameSubMenu') changeUsernameSubMenu!: MatMenuTrigger;
  @ViewChild('forgotPasswordSubMenu') forgotPasswordSubMenu!: MatMenuTrigger;
  user:string|undefined;
  updatedUsername!:string;
  loggedId:any;


  constructor(private firestore: AngularFirestore,private auth:AuthService,private dialog:MatDialog,private router:Router,private data:DataService) {}

ngOnInit(): void {
  this.loggedInId()
  this.userName(this.loggedId).subscribe(
    (result) => {
      this.user = result;
    },
    (error) => {
      console.error('Error retrieving username:', error);
    }
  );
  
}

  loggedInId(){
    this.loggedId=this.auth.loggedId
    console.log(this.loggedId)
  }

  userName(userId: string): Observable<string | undefined> {
    
    return this.firestore
      .collection('Users', ref => ref.where('id', '==', userId))
      .valueChanges({ idField: 'id' })
      .pipe(
        map((users: any[]) => {
          // Assuming 'username' is the field in the document that contains the username
          const user = users[0]; // Since the query is based on ID, there should be at most one user
          return user ? user.firstname : undefined;
          
          
        })
      );
  }
  onLogout(){
    this.auth.logout();
  }
  passwordChange() {
    // const dialogRef = this.dialog.open(PasswordComponent, {
    //   width: '400px', // Set the width of the dialog
    // });
  
    // dialogRef.afterClosed().subscribe(result => {
    //   // Handle any data passed back from the dialog if needed
    //   console.log('The dialog was closed');
      
    // });
    // this.router.navigate(['/password']);
    this.data.setBooleanVariablePassword(true);
  }
  userInfo() {
    // const dialogRef = this.dialog.open(UsernameComponent, {
    //   width: '400px', // Set the width of the dialog
      
    // });
    
  
    // dialogRef.afterClosed().subscribe(result => {
    //   // Handle any data passed back from the dialog if needed
    //   console.log('The dialog was closed');
      
      
    // });
    this.data.setBooleanVariableUsername(true);
    // this.router.navigate(['/username']);
    
  }
}
