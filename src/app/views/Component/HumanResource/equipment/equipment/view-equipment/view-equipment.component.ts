import { id } from 'date-fns/locale';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Affectation, Equipment, StatusDisponibility } from 'app/shared/models/equipment';
import { EquipmentService } from '../../equipment.service';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'app/shared/models/Employee';
import { assEquipmentEmployee } from 'app/shared/models/assEquipmentEmployee';

@Component({
  selector: 'app-view-equipment',
  templateUrl: './view-equipment.component.html',
  styleUrls: ['./view-equipment.component.scss']
})
export class ViewEquipmentComponent implements OnInit {
  public equipment : Equipment;
  public assEqEm : assEquipmentEmployee;
  public employee : Employee;
  public id : number;


  employeeNames: string = '';
  employeeFirstLastName: string;
  constructor(
    private equipmentService :EquipmentService,
    private dialog: MatDialogRef<ViewEquipmentComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

  ngOnInit(): void {
    const data = this.data;
    console.log('Equipment ID:', data.equipment.id);

  this.equipment= data.equipment;
  this.employee = data.employee;
  this.assEqEm = data.assEqEm;
  this.getEmployeeFirstLastName(); // Replace with the actual equipment ID
  
  //this.getEmployee(assEqEm);
  console.log(data);
 // this.getEquipment();
      }
 
      getEmployee(){
        this.equipmentService.getEmployeeById(this.id).subscribe((data: any) => {
          this.employee = data;
          console.log(data)
        });
      }
  /*getEquipment(){
    this.equipmentService.getEquipment(this.id).subscribe((data: any) => {
      this.equipment = data;
      console.log(data)
    });
  }*/
 
  closeDialog(): void {
    this.dialog.close();
  }
  StatusDisponibilityMap = {
    [StatusDisponibility.AVAILABLE]: 'Disponible',
    [StatusDisponibility.UNAVAILABLE]: 'Indisponible'
    
  };
 AffectationMap={
  [Affectation.AFFECTED]:'Affecté',
  [Affectation.UNAFFECTED]:'Non Affecté'
 }


  /*getEmployeeFirstLastName(equipmentId: number): void {
    console.log('Equipment ID for getEmployeeFirstLastName:', equipmentId);

    this.equipmentService.findEmployeeNamesByEquipmentId(equipmentId).subscribe(
      (employee: string) => {
        this.employeeFirstLastName = employee;
        console.log('Employee firstName and lastName:', employee);
        console.log('employeeFirstLastName:',  this.employeeFirstLastName );
      }
    );
  }*/

  getEmployeeFirstLastName(): void {
    console.log('API Response ID:', this.equipment.id);

    this.equipmentService.findEmployeeNamesByEquipmentId(this.equipment.id).subscribe(
      (employee: any) => {
        console.log('API Response:', employee);
        this.employeeFirstLastName = employee.name;
      },
      (error: any) => {
        console.error('Error retrieving emloyeeFirstLastName:', error);
      }
    );
  }

  
   
}
