import { Component, OnInit } from '@angular/core';
import { Subject } from '../../model/subject';
import { DataService } from '../../shared/data.service';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AddSubjectComponent } from '../add-subject/add-subject.component';
import { Router } from '@angular/router';
import { ErrorMessages, Routes } from '../../../../utils/const';


@Component({
  selector: 'app-admin-subject',
  templateUrl: './admin-subject.component.html',
  styleUrl: './admin-subject.component.css'
})
export class AdminSubjectComponent implements OnInit {

  
  subjectsList: Subject[]=[];
  subjectObj: Subject = {
    id: '',
    subject_name: '',
    subject_code: '',
    no_of_students: 0,
    
  };
  id:string='';
  subject_name:string='';
  subject_code:string='';
  no_of_students=0;


  constructor(private data:DataService,private dialog:MatDialog,private firestore: AngularFirestore,private router:Router){}


  ngOnInit(): void {
   this.getAllSubjects() 
  }

  getAllSubjects() {

    this.data.getAllSubjects().subscribe(res => {

      this.subjectsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })

    }, err => {
      alert(ErrorMessages.DataLoad);
    })

  }
  
 
  
  deleteSubject(subject: Subject) {
    if (window.confirm('Are you sure you want to delete ' + subject.subject_name + ' ' + subject.subject_code + ' ?')) {
      this.data.deleteSubject(subject);
    }
  }

  addSubject() {
   //   const dialogRef = this.dialog.open(AddSubjectComponent, {
   //     width: '400px', // Set the width of the dialog
   //   });
  
   //   dialogRef.afterClosed().subscribe(result => {
   //     // Handle any data passed back from the dialog if needed
   //     console.log('The dialog was closed');
      
   //   });
    
   // }
   this.router.navigate([Routes.AddSubject])
  }

}
