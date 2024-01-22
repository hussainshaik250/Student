import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { AngularFireAuth}from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GoogleAuthProvider} from '@angular/fire/auth'
import { ErrorMessages, Routes, StringConstants } from '../../../utils/const';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedRole: any;
  loggedUsername: any;
  loggedId: any;
  loggedPhonenumber: any;
  loggedPassword: any;
  loggedEmail: any;
  loggedStatus: any;

  constructor(private fireauth : AngularFireAuth, private router : Router ,private firestore:AngularFirestore,private data:DataService) { }


  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.firestore.collection('Users', ref => ref.where('email', '==', email)).get().subscribe(
        snapshot => {
          if (snapshot.size === 1) {
            const user = snapshot.docs[0].data() as any;
            const hashedPassword = user.password;
  
            this.loggedRole = user.role;
            this.loggedUsername = user.firstname;
            this.loggedPassword = user.password;
            this.loggedId = user.id;
            this.loggedPhonenumber = user.phonenumber;
            this.loggedEmail = user.email;
            this.loggedStatus = user.permission;
  
            if (this.verifyPassword(password, hashedPassword)) {
              if (this.verifyStatus(this.loggedStatus)) {
                localStorage.setItem('userData', JSON.stringify(user));
                localStorage.setItem('token', 'true');
  
                if (this.loggedRole === StringConstants.Admin) {
                  this.router.navigate([Routes.Dashboard]);
                } else {
                  this.router.navigate([Routes.Dashboard]);
                }
                resolve(); // Resolve the promise on successful login
              } else {
                reject(new Error('User blocked by admin'));
              }
            } else {
              reject(new Error('Invalid email or password'));
            }
          } else {
            reject(new Error('User not register'));
          }
        },
        error => {
          reject(error); // Reject the promise on any other error
        }
      );
    });
  }

  verifyPassword(providedPassword: string, hashedPassword: string): boolean {
   
    return providedPassword === hashedPassword;
  }
  verifyStatus(status:string){
    return status!==StringConstants.Allow

  }

  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {
  
      this.router.navigate([Routes.Admin]);
      localStorage.setItem('token',JSON.stringify(res.user?.uid));
  
    }, err => {
      alert(err.message);
    })
  }
  register(email : string, password : string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then( res => {
      alert(ErrorMessages.Registration);
      this.router.navigate([Routes.Login]);
      // this.sendEmailForVarification(res.user);
    }, err => {
      alert(err.message);
      this.router.navigate([Routes.Register]);
    })
  }
  logout() {
    this.fireauth.signOut().then( () => {
      localStorage.removeItem('token');
      this.router.navigate([Routes.Login]);
      
    }, err => {
      alert(err.message);
    })
  }

}
