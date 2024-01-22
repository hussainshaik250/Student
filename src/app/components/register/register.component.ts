import { Component } from '@angular/core';
import { Userdata } from '../../model/userdata';
import { AuthService } from '../../shared/auth.service';
import { UserdataService } from '../../shared/userdata.service';
import { ErrorMessages } from '../../../../utils/const';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email : string = '';
  password : string = '';
  phonenumber:string='';
  firstname:string='';
  lastname:string='';
  id:string='';
  confirmPassword:string='';
  userObj: Userdata = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phonenumber:'',
    password:'',
    
  };
  

  constructor(private auth : AuthService,private userlist:UserdataService) { }

 

  register() {

    if(this.email == '') {
      alert(ErrorMessages.Email);
      return;
    }

    if(this.password == '') {
      alert(ErrorMessages.Password);
      return;
    }
    if(this.password!=this.confirmPassword){
      alert(ErrorMessages.PasswordMatch)
      return;
    }
    

    this.auth.register(this.email,this.password);
    
    
    this.addUser();

  }
  isPasswordVisible: boolean = true;

  togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    passwordInput.type = this.isPasswordVisible ? 'text' : 'password';
  }

  addUser(){
 
    this.userObj.id = '';
    this.userObj.firstname = this.firstname;
    this.userObj.lastname = this.lastname;
    this.userObj.email = this.email;
    this.userObj.password = this.password;
    this.userObj.phonenumber = this.phonenumber;
    

    this.userlist.adduser(this.userObj);
    

  }

}



