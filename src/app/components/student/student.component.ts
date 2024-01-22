import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from '../../model/subject';
import { ErrorMessages } from '../../../../utils/const';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent implements OnInit  {
  loggedId!: string;
  subjectList: Subject[] = [];
  selectedSubjects!: any[];
  selectedUserId: any;
  selectedSubject: any;
  selectedSubjectId: any;

  constructor(
    private data: DataService,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private auth: AuthService,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.getAllSubjects();
  }
  ngOnInit(): void {
    this.loggedId = this.auth.loggedId;
    
    this.getAllSelectedSubjects();
    
  }
  

  getAllSubjects() {
    this.data.getAllSubjects().subscribe(
      (res) => {
        this.subjectList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;

          data.isclicked = false;
          return data;
        });
      },
      (err) => {
        alert(ErrorMessages.DataLoad);
      }
    );
  }

  getAllSelectedSubjects() {
    this.data.getAllSelectedSubjects().subscribe(
      (res) => {
        this.selectedSubjects = res.map((e: any) => {
          const selectedData = e.payload.doc.data();
          selectedData.id = e.payload.doc.id;

          console.log(this.selectedSubjects);

          console.log(this.loggedId == selectedData.user_id);
          this.selectedUserId = selectedData.user_id;
          this.selectedSubject = selectedData.subject_id;
          this.selectedSubjectId = selectedData.id;

          if (this.loggedId == selectedData.user_id) {
            console.log('match found');

            this.subjectList.forEach((student) => {
              // student.subject_code==this.id});

              if (student.subject_name == selectedData.subject_name) {
                student.isclicked = true;

                console.log(
                  'perfect match',student.subject_name,student.isclicked
                );
                // this.data.updateStudent1(student)
              }
            });
          }

          return selectedData;
        });
      },
      (err) => {
        alert(ErrorMessages.DataLoad);
      }
    );
  }

  addSubject(subject: Subject) {
    subject.no_of_students = Number(subject.no_of_students) + 1;
    this.data.updateSubject(subject);

    subject.user_id = this.loggedId;
    subject.isclicked = true;

    const SelectedData = {
      subject_id: subject.id,
      subject_name: subject.subject_name,
      user_id: subject.user_id,
    };

    // Add document to 'SEMESTER' collection with an automatically generated ID
    this.firestore
      .collection('SEMESTER')
      .add(SelectedData)
      // this.selected_sub=student.user_id;
      .then((docRef) => {
        console.log(
          'Document successfully added with Firestore-generated ID:',
          docRef.id
        );
        this.selectedSubjectId = SelectedData.subject_id;
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    console.log(subject);
  }

  removeSubject(subject: Subject) {
    if (subject.no_of_students > 0) {
      subject.no_of_students = Number(subject.no_of_students) - 1;

      subject.isclicked = true;
      this.data.updateSubject(subject);
      subject.user_id = this.loggedId;

      // Create a reference to the 'SEMESTER' collection
      const semesterCollection = this.firestore.collection('SEMESTER', (ref) =>
        ref
          .where('subject_id', '==', subject.id)
          .where('user_id', '==', subject.user_id)
      );

      // Find and delete the document in 'SEMESTER' collection with matching subject_id and user_id
      semesterCollection
        .get()
        .toPromise()
        .then((querySnapshot: any | undefined) => {
          querySnapshot.forEach((doc: any) => {
            // Delete the document
            semesterCollection
              .doc(doc.id)
              .delete()
              .then(() => {
                console.log(
                  'Document successfully deleted from SEMESTER collection'
                );
                
              })
              .catch((error) => {
                console.error('Error deleting document: ', error);
              });
          });
        })
        .catch((error) => {
          console.error('Error getting documents: ', error);
        });
    } else {
      console.log('Student count is already zero, cannot decrement further.');
    }
    this.getAllSubjects();
  }
 
}
