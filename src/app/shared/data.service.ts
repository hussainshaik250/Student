import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { Subject } from '../model/subject';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private booleanVariableUsername = new BehaviorSubject<boolean>(false);
  booleanVariableUsername$: Observable<boolean> = this.booleanVariableUsername.asObservable();
  private booleanVariablePassword = new BehaviorSubject<boolean>(false);
  booleanVariablePassword$: Observable<boolean> = this.booleanVariablePassword.asObservable();

  constructor(private afs:AngularFirestore) {
    this.booleanVariableUsername.next(false);
   }

  getAllSubjects() {
    return this.afs.collection('/Subjects').snapshotChanges();
  }

  addSubject(subject : Subject) {
    subject.id = this.afs.createId();
    return this.afs.collection('/Subjects').add(subject);
  }

  deleteSubject(subject : Subject) {
    this.afs.doc('/Subjects/'+subject.id).delete();
 }

 getAllSelectedSubjects(){
  return this.afs.collection('/SEMESTER').snapshotChanges();
 }

 updateSubject(subject: Subject) {
   const studentRef = this.afs.doc('/Subjects/' + subject.id);
   studentRef.update(subject)
    .then(() => {
      
      
      console.log('Subject updated successfully');
    })
    .catch(error => {
      console.error('Error updating Subject:', error);
    });
  }
 

  setBooleanVariableUsername(value: boolean): void {
    this.booleanVariableUsername.next(value);
  }
  setBooleanVariablePassword(value:boolean):void{
    this.booleanVariablePassword.next(value);
  }

}
