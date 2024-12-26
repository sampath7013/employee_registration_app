import { CommonModule, JsonPipe, NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,FormsModule,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  designationList:any[]=[];
  roleList:any[]=[];
  stepsList : any[]=[
    {
      stepName:"Basic Details",
      isComplete:false
    },
    {
      stepName:"Skills",
      isComplete:false
    },
    {
      stepName:"Experience",
      isComplete:false
    }
  ]
  activeStep:any = this.stepsList[0];
  isCreateView:boolean=false;
  employeeObj:any={
  "roleId": 0,
  "empCode": "",
  "userName": "",
  "empId": 0,
  "empName": "",
  "empEmailId": "",
  "empDesignationId": 0,
  "empContactNo": "",
  "empAltContactNo": "",
  "empPersonalEmailId": "",
  "empExpTotalYear": 0,
  "empExpTotalMonth": 0,
  "empCity": "",
  "empState": "",
  "empPinCode": "",
  "empAddress": "",
  "empPerCity": "",
  "empPerState": "",
  "empPerPinCode": "",
  "empPerAddress": "",
  "password": "",
  erpEmployeeSkills: [],
  ermEmpExperiences: []
  };

  stepperCompletionValue:number=8;

  constructor(private http:HttpClient) { 

  }
  ngOnInit(): void {
      this.loadDesignations();
      this.loadRoles();
      this.loadAllEmployees();
  }

  employeeList:any[]=[];
  loadDesignations(){
    debugger;
    this.http.get("https://freeapi.gerasim.in/api/EmployeeApp/GetAllDesignation").subscribe((res:any)=>{
      this.designationList = res.data;
      console.log(this.designationList);
    })
  }
  addNew(){
    this.isCreateView=true;
    this.gotoStep1();
  }
  loadAllEmployees(){
    this.http.get("https://freeapi.gerasim.in/api/EmployeeApp/GetAllEmployee").subscribe((res:any)=>{
      this.employeeList = res.data;
    })
  }
  onEdit(empId:any){
    this.http.get("https://freeapi.gerasim.in/api/EmployeeApp/GetEmployeeByEmployeeId?id="+empId).subscribe((res:any)=>{
      this.employeeObj = res.data;
      this.employeeObj.empId=empId;
      this.isCreateView=true;
      this.gotoStep1();
    })
  }
  gotoStep1(){
    const currentStep=this.stepsList.find(step=>step.stepName==this.activeStep.stepName);
    currentStep.isComplete=true;
    this.activeStep=this.stepsList.find(step=>step.stepName=='Basic Details');
    this.stepperCompletionValue=8;
  }
  gotoStep2(){
    const currentStep=this.stepsList.find(step=>step.stepName==this.activeStep.stepName);
    currentStep.isComplete=true;
    this.activeStep=this.stepsList.find(step=>step.stepName=='Skills');
    this.stepperCompletionValue=50;
  }
  gotoStep3(){
    const currentStep=this.stepsList.find(step=>step.stepName==this.activeStep.stepName);
    currentStep.isComplete=true;
    this.activeStep=this.stepsList.find(step=>step.stepName=='Experience');
    this.stepperCompletionValue=100;
  }
  updateEmployee(){
    debugger;
    this.http.put("https://freeapi.gerasim.in/api/EmployeeApp/UpdateEmployee",this.employeeObj).subscribe((res:any)=>{
      if(res.result){
        alert("Employee Updated Successfully");
        this.loadAllEmployees();
        this.isCreateView=false;
        console.log(this.employeeObj); 
      }
      else{
        alert(res.message);
      }
    })
  }
  onDelete(empId:any){
    debugger;
    const isConfirm = confirm("Are you sure you want to delete this employee?");
    if(isConfirm){
      this.http.delete("https://freeapi.gerasim.in/api/EmployeeApp/DeleteEmployeeByEmpId?empId="+empId).subscribe((res:any)=>{
        if(res.result){
          alert("Employee Deleted Successfully");
          this.loadAllEmployees();
        }
        else{
          alert(res.message);
        }
      })
    }
  }
  loadRoles(){
    this.http.get("https://freeapi.gerasim.in/api/EmployeeApp/GetAllRoles").subscribe((res:any)=>{
      this.roleList = res.data;
      console.log(this.roleList);
    })
  }
  setActiveStep(step:any){
    this.activeStep = step;
  }
  addSkills(){
    const skillObj={
      "empSkillId": 0,
        "empId": 0,
        "skill": "",
        "totalYearExp": 0,
        "lastVersionUsed": ""
    };
      
    
    this.employeeObj.erpEmployeeSkills.unshift(skillObj);
    
  }
  addExperience(){
    const empExpObj={
      "empExpId": 0,
        "empId": 0,
        "companyName": "",
        "startDate": "2024-12-25T17:44:07.823Z",
        "endDate": "2024-12-25T17:44:07.823Z",
        "designation": "",
        "projectsWorkedOn": ""
    };
    this.employeeObj.ermEmpExperiences.unshift(empExpObj);
  }

  saveEmployee(){
    debugger;
    this.http.post("https://freeapi.gerasim.in/api/EmployeeApp/CreateNewEmployee",this.employeeObj).subscribe((res:any)=>{
      if(res.result){
        alert("Employee Created Successfully");
        this.loadAllEmployees();
        this.isCreateView=false;
        console.log(this.employeeObj); 
      }
      else{
        alert(res.message);
      }
    })
  }
  
}
