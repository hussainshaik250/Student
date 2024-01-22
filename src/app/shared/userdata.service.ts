import { Injectable } from '@angular/core';
import { Userdata } from '../model/userdata';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserdataService {

  constructor(private afs:AngularFirestore) { }
  adduser(user : Userdata) {
    user.id = this.afs.createId();
    return this.afs.collection('/Users').add(user);
  }
}
