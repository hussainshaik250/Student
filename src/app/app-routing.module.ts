import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsernameComponent } from './components/username/username.component';
import { PasswordComponent } from './components/password/password.component';
import { AddSubjectComponent } from './components/add-subject/add-subject.component';
import { AdminStudentlistComponent } from './components/admin-studentlist/admin-studentlist.component';
import { AdminSubjectComponent } from './components/admin-subject/admin-subject.component';

const routes: Routes = [
  {path: '',  component:LoginComponent},
  {path: 'login', component : LoginComponent},
  {path: 'dashboard', component : DashboardComponent},
  {path:'register',component:RegisterComponent},
  {path:'username',component:UsernameComponent},
  {path:'password',component:PasswordComponent},
  {path:'add-subject',component:AddSubjectComponent},
  {path:'admin-subject',component:AdminSubjectComponent}

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
