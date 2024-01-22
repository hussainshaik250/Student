import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { DataService } from '../../shared/data.service';
import { StringConstants } from '../../../../utils/const';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {
  showStudentAdmin:boolean=false;
  user_type!: string;
  activeTab!: string ; 
  passwordComponent: boolean=false;
  booleanVariableUsername$ = this.data.booleanVariableUsername$;
  booleanVariablePassword$ = this.data.booleanVariablePassword$;

  
  

  constructor(private auth:AuthService,private router:Router,private data:DataService){
    

  }
  ngOnInit(): void {
    this.setUserType();
    
  
   
  }
  ngAfterViewInit(): void {
    this.booleanVariableUsername$.subscribe((value) => {
      console.log('Boolean Variable Value in Component 2:', value);
    });
    this.booleanVariablePassword$.subscribe((value) => {
      console.log('Boolean Variable Value in Component 2:', value);
    });
    
  }

  setUserType() {
    this.user_type = this.auth.loggedRole

    // Add the if-else condition based on user_type
    if (this.user_type == StringConstants.Admin) {
      this.showStudentAdmin = true;
      
      this.activeTab=StringConstants.Subjects;
    } else {
      this.showStudentAdmin = false;
      this.activeTab=StringConstants.Students;
      
    }
    
    
  }
  setActiveTab(tab: string): void {
   
    this.activeTab = tab;
  }
 

}
