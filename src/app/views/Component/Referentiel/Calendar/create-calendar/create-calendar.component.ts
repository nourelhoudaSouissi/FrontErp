import { Calendar } from 'app/shared/models/calendar';
import { CalendarMonth } from './../../../../../shared/models/calendarMonth';
import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Holiday } from 'app/shared/models/holiday';
import { WeekendService } from '../../Weekend/weekend.service';
import { DayOfWeek, Weekend } from 'app/shared/models/weekend';
import { WeekendUpdated } from 'app/shared/models/weekendUpdated';

@Component({
  selector: 'app-create-calendar',
  templateUrl: './create-calendar.component.html',
  styleUrls: ['./create-calendar.component.scss']
})
export class CreateCalendarComponent implements OnInit {
  public dataSource: MatTableDataSource<Holiday>;
  formHoliday = new FormGroup({
    name: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    duration: new FormControl('')
  });
  formCalendarMonth = new FormGroup({
    name: new FormControl(''),
    ordre: new FormControl(''),
    duration: new FormControl('')
  });

  Weekend: Weekend[] = [];
  weekendUpdated: WeekendUpdated[] = [];
  public itemForm: FormGroup;
  public myHolidayForm: FormGroup;
  public myCalendarMonthForm: FormGroup;

  holidays: FormArray;
  calendarMonths: FormArray;

  weekendUpdateds:FormArray;
  repeatForm: FormGroup;

  repeatFormMonth: FormGroup;
  repeatFormUpdated: FormGroup;

  public showHolidaysForm: boolean = false;
  public showWeekendsForm: boolean = false;
  public showCalendarMonthsForm: boolean = false;

  dayOfWeek= Object.values(DayOfWeek)

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _formBuilderMonth: FormBuilder,
    private _formBuilderUpdated: FormBuilder,
    private weekendService: WeekendService,
    public dialogRef: MatDialogRef<CreateCalendarComponent>,
    private fb: FormBuilder,
    private fbMonth: FormBuilder,
    private fbWeekend: FormBuilder
  ) { }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
    
      name: [item.name || '', Validators.required],
      reference :[item.reference|| '', Validators.required],
      description: [item.description || '',Validators.required],
      startDate: [item.startDate || '',Validators.required],
      endDate: [item.endDate || '',Validators.required],
      accountingPeriod: [item.accountingPeriod || '',Validators.required],
      holidays: this.fb.array([]),
      calendarMonths: this.fbMonth.array([]), // Initialize holidays as an empty FormArray
      weekendUpdateds: this.fbWeekend.array([])
    });

    const holidaysFormArray = this.itemForm.get('holidays') as FormArray;
    const calendarMonthsFormArray = this.itemForm.get('calendarMonths') as FormArray;
    const weekendsFormArray = this.itemForm.get('weekendUpdateds') as FormArray;
    if (item.holidays && item.holidays.length > 0) {
      item.holidays.forEach((holiday) => {
        holidaysFormArray.push(this.fb.group({
          id: [holiday.id || ''],
          name: [holiday.name || '', Validators.required],
          startDate: [holiday.startDate || '', Validators.required],
          endDate: [holiday.endDate || '',Validators.required],
          duration: [holiday.duration || '',Validators.required]
        }));
      });
    } else {
      holidaysFormArray.push(this.fb.group({
        id: [''],
        name: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['',Validators.required],
        duration: ['',Validators.required]
      }));
    }

    if (item.calendarMonths && item.calendarMonths.length > 0) {
      item.calendarMonths.forEach((calendarMonth) => {
        calendarMonthsFormArray.push(this.fbMonth.group({
          id: [calendarMonth.id || ''],
          name: [calendarMonth.name || '', Validators.required],
          ordre: [calendarMonth.ordre || '', Validators.required],
          duration: [calendarMonth.duration || '',Validators.required]
        }));
      });
    } else {
      calendarMonthsFormArray.push(this.fbMonth.group({
        id: [''],
        name: ['', Validators.required],
        ordre: [1, Validators.required],
        duration: ['',Validators.required]
      }));
    }


    if (item.weekendUpdateds && item.weekendUpdateds.length > 0) {
      item.weekendUpdateds.forEach((weekend) => {
        weekendsFormArray.push(this.fbWeekend.group({
          id: [weekend.id || ''],
          reference: [{ value: weekend.reference || '', disabled: true }],
          name: [weekend.name || ''],
          startDay: [weekend.startDay || ''],
          endDay: [weekend.endDay || ''],
          activationStartDate: [weekend.activationStartDate || ''],
          activationEndDate: [weekend.activationEndDate || ''],
        }));
      });
    } else {
      weekendsFormArray.push(this.fbWeekend.group({
        id: [''],
        reference: ['',Validators.required],
        name: ['',Validators.required],
        startDay: ['',Validators.required],
        endDay: ['',Validators.required],
        activationStartDate: ['',Validators.required],
        activationEndDate: ['',Validators.required]
      }));
    }
  }

  ngOnInit(): void {
    this.myHolidayForm = this._formBuilder.group({
      holidays: this._formBuilder.array([])  // Initialize holidays as an empty FormArray
    });

    this.myCalendarMonthForm = this._formBuilderMonth.group({
      calendarMonths: this._formBuilderMonth.array([])  // Initialize holidays as an empty FormArray
    });

    this.buildItemForm(this.data.payload);

    this.repeatForm = this._formBuilder.group({
      repeatArray: this._formBuilder.array([this.createRepeatForm()])
    });

    this.repeatFormMonth = this._formBuilderMonth.group({
      repeatArray: this._formBuilderMonth.array([this.createRepeatFormMonth()])
    });
/* **************************** Weekend repeat Form ************************** */

    this.weekendService.getItems().subscribe((weekendUpdateds: any[]) => {
      this.weekendUpdated = weekendUpdateds;
    });

    this.getWeekendId();

    this.repeatFormUpdated = this.fb.group({
      repeatArrayUpdated: this.fb.array([this.createRepeatFormUpdated()])
    });

 // Update the validation for unique dates
 const weekendsFormArray = this.itemForm.get('weekendUpdateds') as FormArray;
 weekendsFormArray.setValidators([this.validateUniqueDates.bind(this, weekendsFormArray)]);
 weekendsFormArray.updateValueAndValidity();




 this.itemForm.get('endDate').valueChanges.subscribe(() => {
  this.validateDatesAgainstCalendarEndDate();
});

  }

  get myArrayControls() {
    return (this.myHolidayForm.get('holidays') as FormArray).controls;
  }

  get myArrayControlsMonth() {
    return (this.myCalendarMonthForm.get('calendarMonths') as FormArray).controls;
  }

  createRepeatForm(): FormGroup {
    return this._formBuilder.group({});
  }

  createRepeatFormMonth(): FormGroup {
    return this._formBuilderMonth.group({});
  }


  createRepeatFormUpdated(): FormGroup {
    return this._formBuilderUpdated.group({});
  }

  get repeatFormGroup() {
    return this.repeatForm.get('repeatArray') as FormArray;
  }

    get repeatFormGroupMonth() {
    return this.repeatFormMonth.get('repeatArray') as FormArray;
  }

  handleAddRepeatForm() {
    this.repeatFormGroup.push(this.createRepeatForm());
  }

  handleRemoveRepeatForm(index: number) {
    this.repeatFormGroup.removeAt(index);
    if (index > 0) {
      const repeatArray = this.repeatForm.get('repeatArray') as FormArray;
      repeatArray.removeAt(index);
    }
  }


  handleAddRepeatFormMonth() {
    this.repeatFormGroupMonth.push(this.createRepeatFormMonth());
  }

  handleRemoveRepeatFormMonth(index: number) {
    this.repeatFormGroupMonth.removeAt(index);
    if (index > 0) {
      const repeatArray = this.repeatFormMonth.get('repeatArray') as FormArray;
      repeatArray.removeAt(index);
    }
  }

  getWeekendId(){
    this.weekendService.getItems().subscribe((data :any )=>{
      this.Weekend = data
    });
  }
 /*
      submit() {
        console.log(this.itemForm.value);
        this.dialogRef.close(this.itemForm.value);
      }*/
     submit() {
        this.validateDatesAgainstCalendarEndDate();
    
    
          console.log(this.itemForm.value);
          this.dialogRef.close(this.itemForm.value);
        
      }
      
      addHolidayFormGroup(): void {
        const holidaysFormArray = this.itemForm.get('holidays') as FormArray;
        
        const holidayarticleFormGroup = this.fb.group({
          id: [''],
          name: ['', Validators.required],
          startDate: ['', Validators.required],
          endDate: [''],
          duration: ['']
        });
        holidaysFormArray.push(holidayarticleFormGroup);
      }


      
      removeHolidayFormGroup(index: number): void {
        const holidaysFormArray = this.itemForm.get('holidays') as FormArray;
        holidaysFormArray.removeAt(index);
      }

      toggleHolidaysForm(): void {
        const holidaysFormArray = this.itemForm.get('holidays') as FormArray;
        if (holidaysFormArray.length === 0) {
          this.addHolidayFormGroup();
        }
        this.showHolidaysForm = true; // Always set showHolidaysForm to true
      }


      /* **************************** Month repeat Form add and remove **************************** */


     /* addMonthFormGroup(): void {
        const monthsFormArray = this.itemForm.get('calendarMonths') as FormArray;
        
        const calendarMonthsFormGroup = this.fbMonth.group({
          id: [''],
          name: ['', Validators.required],
          ordre: ['', Validators.required],
          duration: ['']
        });
        monthsFormArray.push(calendarMonthsFormGroup);
      }*/
      addMonthFormGroup(): void {
        const monthsFormArray = this.itemForm.get('calendarMonths') as FormArray;
      
        let nextOrdre = 1;
        const lastMonthGroup = monthsFormArray.at(monthsFormArray.length - 1);
      
        if (lastMonthGroup) {
          const lastOrdre = lastMonthGroup.get('ordre').value;
          nextOrdre = lastOrdre + 1;
        }
      
        const calendarMonthsFormGroup = this.fbMonth.group({
          id: [''],
          name: ['', Validators.required],
          ordre: [nextOrdre, Validators.required],
          duration: ['']
        });
      
        monthsFormArray.push(calendarMonthsFormGroup);
      }
      


      
      removeMonthFormGroup(index: number): void {
        const monthsFormArray = this.itemForm.get('calendarMonths') as FormArray;
        monthsFormArray.removeAt(index);
      }

      toggleMonthsForm(): void {
        const monthsFormArray = this.itemForm.get('calendarMonths') as FormArray;
        if (monthsFormArray.length === 0) {
          this.addMonthFormGroup();
        }
        this.showCalendarMonthsForm = true; // Always set showHolidaysForm to true
      }
  

      /* **************************** Weekend repeat Form add and remove **************************** */

      addWeekendFormGroup(): void {
        const weekendsFormArray = this.itemForm.get('weekendUpdateds') as FormArray;
        weekendsFormArray.push(this.fbWeekend.group({
          id: [''],
          reference: [''],
          name: [''],
          startDay: [''],
          endDay: [''],
          activationStartDate: [''],
          activationEndDate: ['']
        }));
      }
   
      toggleWeekendForm(): void {
        const weekendsFormArray = this.itemForm.get('weekendUpdateds') as FormArray;
        if (weekendsFormArray.length === 0) {
          this.addWeekendFormGroup();
        }
        this.showWeekendsForm = true; // Always set showWeekendsForm to true
      }
      
        
      removeWeekendFormGroup(index: number): void {
        const weekendFormArray = this.itemForm.get('weekendUpdateds') as FormArray;
        weekendFormArray.removeAt(index);
      }

      get myWeekendArrayControls() {
        return (this.myHolidayForm.get('weekendUpdateds') as FormArray).controls;
      }

      dayOfWeekMap = {
        [DayOfWeek.MONDAY]:'Lundi',
        [DayOfWeek.TUESDAY]:'Mardi',
        [DayOfWeek.WEDNESDAY]:'Mercredi',
        [DayOfWeek.THURSDAY]:'Jeudi',
        [DayOfWeek.FRIDAY]:'Vendredi',
        [DayOfWeek.SATURDAY]:'Samedi',
        [DayOfWeek.SUNDAY]:'Dimanche'
        
      };
    
      /* **************************** On select change weekend **************************** */


    onWeekendSelectedChange(value: any, i: number): void {
        const weekendsFormArray = this.itemForm.get('weekendUpdateds') as FormArray;
        const weekendGroup = weekendsFormArray.at(i);
        if (weekendGroup) {
          const reference = weekendGroup.get('reference');
          const name = weekendGroup.get('name');
          const startDay = weekendGroup.get('startDay');
          const endDay = weekendGroup.get('endDay');
          if (reference  && endDay && startDay) {
            const selectedWeekend = this.Weekend.find(weekend => weekend.name === value);
            reference.setValue(selectedWeekend ? selectedWeekend.reference : '');
            startDay.setValue(selectedWeekend ? selectedWeekend.startDay : '');
            endDay.setValue(selectedWeekend ? selectedWeekend.endDay : '');
            name.setValue(selectedWeekend ? selectedWeekend.name : '');
          }
        }
      }
    
      validateUniqueDates(weekendsFormArray: FormArray): { dateRangesIntersect: boolean } | null {
        for (let i = 0; i < weekendsFormArray.length; i++) {
          const currentGroup = weekendsFormArray.at(i);
          const startDate1 = currentGroup.get('activationStartDate').value;
          const endDate1 = currentGroup.get('activationEndDate').value;
      
          for (let j = i + 1; j < weekendsFormArray.length; j++) {
            const otherGroup = weekendsFormArray.at(j);
            const startDate2 = otherGroup.get('activationStartDate').value;
            const endDate2 = otherGroup.get('activationEndDate').value;
      
            if (
              (startDate1 <= endDate2 && endDate1 >= startDate2) ||  // Check for overlap
              (startDate2 <= endDate1 && endDate2 >= startDate1)
            ) {
              currentGroup.setErrors({ dateRangesIntersect: true });
              otherGroup.setErrors({ dateRangesIntersect: true });
            } else {
              currentGroup.setErrors(null);
              otherGroup.setErrors(null);
            }
          }
        }
      
        return null;
      }


/******************************************  Validation date de fin ne dépasse pas date de fin du calendar ***************************************** **/
validateDatesAgainstCalendarEndDate() {
  const endDate = this.itemForm.get('endDate').value;

  const weekendsFormArray = this.itemForm.get('weekendUpdateds') as FormArray;
  weekendsFormArray.controls.forEach((weekendGroup: FormGroup) => {
    const activationEndDate = weekendGroup.get('activationEndDate');
    if (activationEndDate.value > endDate) {
      activationEndDate.setErrors({ invalidDate: true });
    } else {
      activationEndDate.setErrors(null);
    }
  });

  const holidaysFormArray = this.itemForm.get('holidays') as FormArray;
  holidaysFormArray.controls.forEach((holidayGroup: FormGroup) => {
    const endDateControl = holidayGroup.get('endDate');
    if (endDateControl.value && endDateControl.value > endDate) {
      endDateControl.setErrors({ invalidDate: true });
    } else {
      endDateControl.setErrors(null);
    }
  });
}




}
      
      
