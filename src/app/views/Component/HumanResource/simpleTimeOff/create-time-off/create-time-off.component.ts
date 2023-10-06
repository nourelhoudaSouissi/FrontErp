import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExternalTimeOffType, TimeOfTimeType, TimeOffPeriodType,  } from 'app/shared/models/timeOff';
import { TimeOffService } from '../time-off.service';
import { LeaveType, TimeOffType } from 'app/shared/models/leaveType';
import * as moment from 'moment';
import { LeaveTypeService } from '../../leaveType/leave-type.service';

@Component({
  selector: 'app-create-time-off',
  templateUrl: './create-time-off.component.html',
  styleUrls: ['./create-time-off.component.scss']
})
export class CreateTimeOffComponent implements OnInit {
  private leaveTypeNum : number
  private employeeNum : number 
  listLeaveTypes : LeaveType[] = []
  public itemForm: FormGroup
  externalTimeOffType = Object.values(ExternalTimeOffType)
  timeOffPeriodType = Object.values(TimeOffPeriodType)
  timeOfTimeType = Object.values(TimeOfTimeType)
  timeOffTypes= Object.values(TimeOffType)
  selectedLeaveType: LeaveType;

  showTimeOfTimeType = false;
  



  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateTimeOffComponent>,
    private fb: FormBuilder, 
    private timeOffService: TimeOffService,
    private leaveTypeService: LeaveTypeService,
  ) { }


  getLeaveTypes(){
    this.leaveTypeService.getItems().subscribe((data :any )=>{
      this.listLeaveTypes = data
    });
  }
   
  
  buildItemForm(item){
    this.itemForm = this.fb.group({
     // description : [item.description || '', Validators.required],
      justificationDoc : [item.justificationDoc || '',],
      timeOffType : [item.timeOffType || '', Validators.required],
      startDate : [item.startDate || '', Validators.required],
      endDate : [item.endDate || '', Validators.required],
      timeOffPeriod :'',
      comment : [item.comment || '',],
      leaveTypeNum: [this.data.leaveTypeNum || null, Validators.required],
      employeeNum : [1],
      timeOffPeriodType: [item.timeOffPeriodType || '', Validators.required],
      timeOfTimeType: [item.timeOfTimeType || '',Validators.required]
    })
    this.itemForm.get('leaveTypeNum').valueChanges.subscribe((leaveTypeNum) => {
      this.selectedLeaveType = this.listLeaveTypes.find((leaveType) => leaveType.id === leaveTypeNum);
      this.calculateTimeOffPeriod();
    });

    // Add the value change listener for startDate
    this.itemForm.get('startDate').valueChanges.subscribe(() => {
      this.calculateTimeOffPeriod();
    });

    // Add the value change listener for endDate
    this.itemForm.get('endDate').valueChanges.subscribe(() => {
      this.calculateTimeOffPeriod();
    });

    this.itemForm.get('startDate').valueChanges.subscribe((value) => {
      // If startDate is set, update the endDate control to disable all dates before the selected startDate
      if (value) {
        this.itemForm.get('endDate').enable();
        this.itemForm.get('endDate').setValidators([Validators.required, this.endDateValidator(value)]);
        this.itemForm.get('endDate').updateValueAndValidity();
      }
    });
  }

 
  
  ngOnInit() {
    this.buildItemForm(this.data.payload)
    this.getLeaveTypes()
    this.leaveTypeNum = this.data.leaveTypeNum;

    this.itemForm.get('startDate').valueChanges.subscribe((startDate) => {
      if (startDate && (this.itemForm.get('timeOffPeriodType').value === TimeOffPeriodType.HALF_DAY || this.itemForm.get('timeOffPeriodType').value === TimeOffPeriodType.QUARTER_DAY)) {
        this.itemForm.get('endDate').setValue(startDate);
      }
    });
  }

  submit() {
    console.log(this.itemForm.value)
    this.dialogRef.close(this.itemForm.value)
  }


  
   // Custom validator for endDate to ensure it is after startDate
   endDateValidator(startDate: Date) {
    return (endDateControl) => {
      const endDate = new Date(endDateControl.value);
      if (endDate < startDate) {
        return { 'min': true };
      }
      return null;
    };
  }



 /*calculateTimeOffPeriod() {
    const startDate = moment(this.itemForm.get('startDate').value);
    const endDate = moment(this.itemForm.get('endDate').value);
  
    if (startDate.isValid() && endDate.isValid() && endDate.isSameOrAfter(startDate)) {
      const duration = endDate.diff(startDate, 'days') + 1; // Ajoute 1 pour inclure à la fois la date de début et la date de fin
      this.itemForm.get('timeOffPeriod').setValue(duration);
  
      if (this.selectedLeaveType && duration > this.selectedLeaveType.duration) {
        this.itemForm.get('timeOffPeriod').setErrors({ exceedsDuration: true });
      } else {
        this.itemForm.get('timeOffPeriod').setErrors(null);
      }
    } else {
      this.itemForm.get('timeOffPeriod').setValue('');
    }
  }*/

  calculateTimeOffPeriod() {
    const startDate = moment(this.itemForm.get('startDate').value);
    const endDate = moment(this.itemForm.get('endDate').value);
  
    if (startDate.isValid() && endDate.isValid() && endDate.isSameOrAfter(startDate)) {
      let duration = endDate.diff(startDate, 'days') + 1;
      const timeOffPeriodType = this.itemForm.get('timeOffPeriodType').value;
    
      if (timeOffPeriodType === TimeOffPeriodType.HALF_DAY) {
        duration = 0.5;
      } else if (timeOffPeriodType === TimeOffPeriodType.QUARTER_DAY) {
        duration = 0.25;
      }
    
      this.itemForm.get('timeOffPeriod').setValue(duration);
    
      if (this.selectedLeaveType && duration > this.selectedLeaveType.duration) {
        this.itemForm.get('timeOffPeriod').setErrors({ exceedsDuration: true });
      } else {
        this.itemForm.get('timeOffPeriod').setErrors(null);
      }
    } else {
      this.itemForm.get('timeOffPeriod').setValue('');
    }
    
  }
  

  /*onFileSelected(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log("reader.result",reader.result)
        this.itemForm.patchValue({
          justificationDoc: reader.result
        });
        console.log(this.itemForm.value)
      };
    }
  }*/

  
  onFileSelected(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log("reader.result",reader.result)
        this.itemForm.patchValue({
          justificationDoc: reader.result
        });
        console.log(this.itemForm.value)
      };
    }
  }

 /* onTimeOffPeriodTypeChange(event: any) {
    const selectedTimeOffPeriodType = event.value;
    if (selectedTimeOffPeriodType === 'QUARTER_DAY' || selectedTimeOffPeriodType === 'HALF_DAY') {
      this.showTimeOfTimeType = true;
    } else {
      this.showTimeOfTimeType = false;
    }
  }*/
 

  onTimeOffPeriodTypeChange(event: any) {
  const selectedTimeOffPeriodType = event.value;

  if (selectedTimeOffPeriodType === TimeOffPeriodType.HALF_DAY || selectedTimeOffPeriodType === TimeOffPeriodType.QUARTER_DAY) {
    this.showTimeOfTimeType = true;
    const startDate = this.itemForm.get('startDate').value;
    this.itemForm.get('endDate').setValue(startDate);
  } else {
    this.showTimeOfTimeType = false;
    // Reset the value of timeOfTimeType when it's not required
    this.itemForm.get('timeOfTimeType').setValue(null);
  }
}

  

   timeOffPeriodTypeMap = {
    [TimeOffPeriodType.QUARTER_DAY]:'Quart de jour',
    [TimeOffPeriodType.HALF_DAY]:'Demi journée',
    [TimeOffPeriodType.FULL_DAY]:'Jours'
    
  };

  
  timeOfTimeTypeMap = {
    [TimeOfTimeType.MORNING]:'Matin',
    [TimeOfTimeType.AFTERNOON]:'Aprés midi'
    
  };


}
