import { Component } from '@angular/core';
import { Subject } from '../../model/subject';
import { DataService } from '../../shared/data.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorMessages, Routes } from '../../../../utils/const';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrl: './add-subject.component.css'
})
export class AddSubjectComponent {
  studentObj: Subject = {
    id: '',
    subject_name: '',
    subject_code: '',
    no_of_students: 0,
    
  };
  id:string='';
  subject_name:string='';
  subject_code:string='';
  no_of_students=0;
  constructor(private data:DataService,private dialog:MatDialog,private router:Router){
  }



  resetForm() {
    this.id = '';
    this.subject_name = '';
    this.subject_code = '';
    this.no_of_students = 0;
    
  }
  addSubject(){
    if (this.subject_name == '' || this.subject_code == ''  ) {
      alert(ErrorMessages.InputFieldsEmpty);
      return;
    }
    this.studentObj.id = '';
    this.studentObj.subject_name = this.subject_name;
    this.studentObj.subject_code = this.subject_code;
    this.studentObj.no_of_students = this.no_of_students;
    

    this.data.addSubject(this.studentObj);
    
    this.dialog.closeAll()
    this.resetForm();
    this.router.navigate([Routes.Dashboard])

  }

  close_Dialog(){
    this.router.navigate([Routes.Dashboard])
  }

}
