import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { StringConstants, TableConstants } from '../../../../utils/const';

@Component({
  selector: 'app-admin-studentlist',
  templateUrl: './admin-studentlist.component.html',
  styleUrl: './admin-studentlist.component.css'
})
export class AdminStudentlistComponent implements OnInit{
  filterControl = new FormControl();
  displayedColumns: string[] = [TableConstants.No,TableConstants.FirstName, TableConstants.LastName, TableConstants.EmailId, TableConstants.PhoneNumber,TableConstants.Permission];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  permission:boolean=false;
  permissionActions = [StringConstants.Allow, StringConstants.Deny];
  constructor(private firestore:AngularFirestore){

  }

  ngOnInit(): void {
    this.getUsersList()
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addIndexToData(data: any[]): any[] {
    return data.map((item, index) => ({ no: index + 1, permission: this.permissionActions, ...item }));
  }
  addPermissionAttribute(data: any[]): any[] {
    // Add the 'permission' attribute with the value 'deny' to each document
    return data.map(item => ({ permission: 'deny', ...item }));
  }

  getUsersList() {
    this.firestore.collection('Users').valueChanges().subscribe({
      next: (res: any[]) => {
        // console.log('Firestore Response:', res);

        if (res && res.length > 0) {
          const dataWithIndex = this.addIndexToData(res);
          const dataWithIndexAndPermission = this.addPermissionAttribute(res);
          
          this.dataSource = new MatTableDataSource(dataWithIndex);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          console.warn('Firestore returned an empty array or undefined data.');
        }
      },
      error: (err) => {
        console.error('Firestore Error:', err);
      },
    });
  }

  onPermissionAction(row: any, action: string): void {
    const documentId = row.id;

    console.log(`Clicked ${action} for row with id: ${documentId}`);

    // Update the Firestore document with the clicked ID and where condition
    this.firestore.collection('Users', ref => ref.where('id', '==', documentId))
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          // You can update the specific document here
          this.firestore.collection('Users').doc(doc.id).update({ permission: action });
        });
      });
  }

}
