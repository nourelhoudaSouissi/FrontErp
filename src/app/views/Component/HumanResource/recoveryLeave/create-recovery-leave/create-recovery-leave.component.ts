import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Holiday } from 'app/shared/models/holiday';
import { RecoveryDay, RecoveryHours, RecoveryType } from 'app/shared/models/recoveryLeave';
import { HolidayService } from 'app/views/Component/Referentiel/Holiday/holiday.service';
import * as moment from 'moment';

@Component({
  selector: 'app-create-recovery-leave',
  templateUrl: './create-recovery-leave.component.html',
  styleUrls: ['./create-recovery-leave.component.scss']
})
export class CreateRecoveryLeaveComponent implements OnInit {
  public itemForm: UntypedFormGroup;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<CreateRecoveryLeaveComponent>,
  private fb: UntypedFormBuilder,
  private holidayService: HolidayService) { }
  recoveryType= Object.values(RecoveryType)
  recoveryDay= Object.values(RecoveryDay)
  recoveryHours= Object.values(RecoveryHours)

  private holidayNum : number
  listHolidays : Holiday[] = []

  showNumberHours = false;
  showDate= false;
  showHolidays = false;
  showWeekendDates= false;

  showToTakeStartDate= false;
  showToTakeEndDate= false;
  showPeriodeToTake= false;
  showRecoveryHours=false;

  getHolidays(){
    this.holidayService.getItems().subscribe((data :any )=>{
      this.listHolidays = data
      console.log ("holidays data",  data)
    });
    console.log ("holidays",  this.listHolidays)
   
  }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload)
    this.itemForm = new UntypedFormGroup({
      name:new UntypedFormControl('', []),
      recoveryType: new UntypedFormControl('', []),
      recoveryHours: new UntypedFormControl('', []),
      date: new UntypedFormControl('', []),
      numberHours: new UntypedFormControl('', []),
      weekendDate: new UntypedFormControl('', []),
      holidayNum: new UntypedFormControl('', []),
      recoveryDay: new UntypedFormControl('', []),
      toTakeStartDate: new UntypedFormControl('', []),
      toTakeEndDate: new UntypedFormControl('', []),
      periodToTake: new UntypedFormControl('', []),
      comment: new UntypedFormControl('', []),
      employeeNum :new UntypedFormControl [1]
    
    })

    this.getHolidays();
    this.calculateToTakefPeriod(); 
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      name: [item.name || '',Validators.required],
      recoveryType: [item.recoveryType || ''],
      recoveryHours: [item.recoveryHours || ''],
      date: [item.date || ''],
      numberHours: [item.numberHours || ''],
      weekendDate: [item.weekendDate || ''],
      holidayNum: [this.data.holidayNum || null],
      recoveryDay: [item.recoveryDay || ''],
      toTakeStartDate: [item.toTakeStartDate || ''],
      toTakeEndDate: [item.toTakeEndDate || ''],
      periodToTake: [item.periodToTake || ''],
      comment: [item.comment || ''],
      employeeNum : [1]

    })
      
  }

  submit() {
    this.dialogRef.close(this.itemForm.value)
  }

  onRecoveryDaysChange(event: any) {
    const selectedRecoveryDay = event.value;
    if (selectedRecoveryDay === 'OVERTIME'){
      this.showNumberHours = true;
      this.showDate = true;
      this.showRecoveryHours = true; 
    }
    else if (selectedRecoveryDay === 'HOLIDAY'){
      this.showHolidays = true;
      this.itemForm.get('recoveryHours').setValue(null);

    }
    else if (selectedRecoveryDay === 'WEEKEND'){
      this.showWeekendDates = true;  
      this.itemForm.get('recoveryHours').setValue(null);

    }
    else{
      this.showNumberHours = false;
      this.showDate = false;
      this.showRecoveryHours = false; 
      this.showHolidays = false;
      this.showWeekendDates = false;
      this.itemForm.get('recoveryHours').setValue(null);

    }

   /* this.showNumberHours = selectedRecoveryDay === 'OVERTIME';
    this.showDate = selectedRecoveryDay === 'OVERTIME';
    this.showRecoveryHours = selectedRecoveryDay === 'OVERTIME';
    this.showHolidays = selectedRecoveryDay === 'HOLIDAY';
    this.showWeekendDates = selectedRecoveryDay === 'WEEKEND';*/
    
  }

  onRecoveryTypesChange(event: any) {
    const selectedRecoveryType = event.value;
    if (selectedRecoveryType ==='DAYS'){
      this.showToTakeStartDate = true; 
      this.showToTakeEndDate = true; 
      this.showPeriodeToTake = true;
    } else {
      this.showToTakeStartDate = false; 
      this.showToTakeEndDate = false; 
      this.showPeriodeToTake = false;
      //this.itemForm.get('recoveryHours').setValue(null);
    }
    // this.showToTakeStartDate = selectedRecoveryType === 'DAYS';
    // this.showToTakeEndDate = selectedRecoveryType === 'DAYS';
    // this.showPeriodeToTake = selectedRecoveryType === 'DAYS';
  }

 
  recoveryTypeMap = {
    [RecoveryType.DAYS]:'Jour de congé',
    [RecoveryType.MONEY]:'Compensation '
   
  };

  recoveryDaysMap = {
    [RecoveryDay.HOLIDAY]:'Jour férié',
    [RecoveryDay.WEEKEND]:'Weekend',
    [RecoveryDay.OVERTIME]:'Heure supplémentaire'
   
  };
  recoveryHoursMap = {
    [RecoveryHours.HOLIDAY]:'Jour férié',
    [RecoveryHours.WEEKEND]:'Weekend',
    [RecoveryHours.NORMAL_DAYS]:'Jour normal'
   
  };
 


  calculateToTakefPeriod() {
    const toTakeStartDate = moment(this.itemForm.get('toTakeStartDate').value);
    const toTakeEndDate = moment(this.itemForm.get('toTakeEndDate').value);
  
    let periodToTake = 0;
  
    if (toTakeStartDate.isValid() && toTakeEndDate.isValid() && toTakeEndDate.isSameOrAfter(toTakeStartDate)) {
      const duration = toTakeEndDate.diff(toTakeStartDate, 'days') + 1; // Add 1 to include both the start and end dates
      periodToTake = duration;
    }
  
    this.itemForm.get('periodToTake').setValue(periodToTake);
  
    // Add the value change listener for startDate
    this.itemForm.get('toTakeStartDate').valueChanges.subscribe(() => {
      this.calculateToTakefPeriod();
    });
  
    // Add the value change listener for endDate
    this.itemForm.get('toTakeEndDate').valueChanges.subscribe(() => {
      this.calculateToTakefPeriod();
    });
  }
  


  
}
