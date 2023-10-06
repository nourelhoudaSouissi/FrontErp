import { Component, OnInit } from '@angular/core';
import { RequestStatus, TimeOfTimeType, TimeOff, TimeOffPeriodType } from 'app/shared/models/timeOff';
import { TimeOffService } from '../../simpleTimeOff/time-off.service';
import { ActivatedRoute } from '@angular/router';
import { Employee, Title } from 'app/shared/models/Employee';
import { TimeOffValidationService } from '../time-off-validation.service';
import { LeaveTypeService } from '../../leaveType/leave-type.service';
import { LeaveType } from 'app/shared/models/leaveType';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-time-off-validation',
  templateUrl: './view-time-off-validation.component.html',
  styleUrls: ['./view-time-off-validation.component.scss']
})
export class ViewTimeOffValidationComponent implements OnInit {
  id: number;
  timeOff: TimeOff;
  employee : Employee;
  leaveType: LeaveType;
  leaveBalances: Map<LeaveType, number>;

  leaveTypeDurations: { leaveType: string, totalDuration: number }[] = [];


  currentYear: number = new Date().getFullYear();

  totalSpecialPaidLeaveDuration: number;
  totalDurationSicknessLeave: number;

  sicknessLeaveList: { name: string, duration: number }[] = [];
  specialPaidLeaveList: { name: string, duration: number }[] = [];


  specialPaidLeaveDurationList: { name: string, totalDuration: number }[] = [];
  sicknessLeaveDurationList: { name: string, totalDuration: number }[] = [];

  totalDurationSpecialPaidLeaveConsumed: number;
  totalDurationSichnessLeaveConsumed: number;

  totalDurationPaidLeaveConsumed: number;

  totalDurationUnpaidLeaveConsumed: number;

  
   HALF_DAY = TimeOffPeriodType.HALF_DAY;
   QUARTER_DAY = TimeOffPeriodType.QUARTER_DAY;

  
  constructor(
    private timeOffService: TimeOffValidationService,
    private leaveTypeService : LeaveTypeService,
    
    private route: ActivatedRoute,
   ) { }


 

  ngOnInit(): void {
    console.log("employee");
   
    this.id = this.route.snapshot.params['iiid'];
    this.getTimeOffById();
   
   this.getTotalSpecialPaidLeaveDuration();
   this.getTotalDurationSicknessLeave();

   this.getSicknessLeaveList();
   this.getSpecialPaidLeaveList();

   this.getLeaveTypeDurations(); // Call the new method to fetch leave type durations

   this.getTotalDurationSpecialPaidLeaveByLeaveTypeAndEmployeeId(); 
   this.getTotalDurationSicknessLeaveByLeaveTypeAndEmployeeId();// Call the new method to fetch total special paid leave by leave type and employee ID
   
   this.getTotalDurationSpecialPaidLeaveConsumed();
   this.getTotalDurationSichnessLeaveConsumed();

   this.getTotalDurationPaidLeaveConsumed();
   this.getTotalDurationUnpaidLeaveEmployeeId();
  } 

 
    getEmployee() {
      this.timeOffService.getEmployee(this.id).subscribe(
        (data: Employee) => {
          this.employee = data;
          if (this.employee && this.employee.leaveBalances) {
            // Access the leaveBalances property
            const leaveBalances = this.employee.leaveBalances;
            // Perform further operations with the leaveBalances
          }
        },
        (error: any) => {
          console.error('Error retrieving employee:', error);
          // Display an error message to the user
          // You can show an alert, toast message, or update a variable to display the error in the template
        }
      );
    }
    

   
    
 
  getTimeOffById(): void {
    this.timeOffService.getItem(this.id).subscribe((dataView: any) => {
      this.timeOff = dataView;
      console.log("timeOff", this.timeOff);
      console.log("timeOfffffffffffffffff", this.timeOff.employee.id);
      console.log("leaveTypeeeeeeeeeeee", this.timeOff.leaveType.id);
      console.log("justificationDoc", this.timeOff.justificationDoc);
      this.getTotalDurationSpecialPaidLeaveByLeaveTypeAndEmployeeId();
      this.getTotalDurationSicknessLeaveByLeaveTypeAndEmployeeId();
      this.getTotalDurationSichnessLeaveConsumed();
      this.getTotalDurationSpecialPaidLeaveConsumed();
      this.getTotalDurationPaidLeaveConsumed();
      this.getTotalDurationUnpaidLeaveEmployeeId();

    });
  }

 
 
  getTotalSpecialPaidLeaveDuration(): void {
    this.leaveTypeService.getTotalDurationSpecialPaidLeave().subscribe(
      (duration: number) => {
        this.totalSpecialPaidLeaveDuration = duration;
        console.log('Total Special Paid Leave Duration:', duration);
      },
      (error: any) => {
        console.error('Error retrieving total special paid leave duration:', error);
      }
    );
  }
  
  getTotalDurationSicknessLeave(): void {
    this.leaveTypeService.getTotalDurationSicknessLeave().subscribe(
      (duration: number) => {
        this.totalDurationSicknessLeave = duration;
        console.log('Total Sickness Paid Leave Duration:', duration);
      },
      (error: any) => {
        console.error('Error retrieving total Sickness paid leave duration:', error);
      }
    );
  }



  getSicknessLeaveList(): void {
    this.leaveTypeService.getSicknessLeaveList().subscribe(
      (list: { name: string, duration: number }[]) => {
        this.sicknessLeaveList = list;
      },
      (error: any) => {
        console.error('Error retrieving sickness Leave list:', error);
      }
    );
  }


  getSpecialPaidLeaveList(): void {
    this.leaveTypeService.getSpecialPaidLeaveList().subscribe(
      (list: { name: string, duration: number }[]) => {
        this.specialPaidLeaveList = list;
      },
      (error: any) => {
        console.error('Error retrieving Special Paid Leave list:', error);
      }
    );
  }

  getLeaveTypeDurations(): void {
    this.timeOffService.getLeaveTypeDurationsByEmployee(this.employee.id).subscribe(
      (data: { leaveType: string, totalDuration: number }[]) => {
        this.leaveTypeDurations = data;
      },
      (error: any) => {
        console.error('Error retrieving leave type durations:', error);
      }
    );
  }
  getAccumulatedDuration(leaveType: string): number {
    // Find the leave type in the leaveTypeDurations array
    const leaveTypeDuration = this.leaveTypeDurations.find(item => item.leaveType === leaveType);
  
    // If the leave type duration is found, return the accumulated duration
    if (leaveTypeDuration) {
      return leaveTypeDuration.totalDuration;
    }
  
    // If the leave type is not found or the accumulated duration is not available, return 0
    return 0;
  }

 
  getTotalDurationSpecialPaidLeaveByLeaveTypeAndEmployeeId(): void {
    if (this.timeOff && this.timeOff.employee) {
      console.log("employee", this.timeOff.employee.id);
      this.timeOffService.getTotalDurationSpecialPaidLeaveByLeaveTypeAndEmployeeId(this.timeOff.employee.id).subscribe(
        (list: { name: string, totalDuration: number }[]) => {
          this.specialPaidLeaveDurationList = list;
        },
        (error: any) => {
          console.error('Error retrieving total duration for special paid leave:', error);
        }
      );
    }
  }

  getTotalDurationSicknessLeaveByLeaveTypeAndEmployeeId(): void {
    if (this.timeOff && this.timeOff.employee) {
      console.log("employee", this.timeOff.employee.id);
      this.timeOffService.getTotalDurationSicknessLeaveByLeaveTypeAndEmployeeId(this.timeOff.employee.id).subscribe(
        (list: { name: string, totalDuration: number }[]) => {
          this.sicknessLeaveDurationList = list;
        },
        (error: any) => {
          console.error('Error retrieving total duration for sickness leave:', error);
        }
      );
    }
  }
 
  
  getTotalDurationSpecialPaidLeaveConsumed(): void {
    if (this.timeOff && this.timeOff.employee) {
      console.log("employee getTotalDurationSpecialPaidLeaveConsumed", this.timeOff.employee.id);
    this.timeOffService.getTotalDurationSpecialPaidLeaveConsumed(this.timeOff.employee.id).subscribe(
      (duration: number) => {
        this.totalDurationSpecialPaidLeaveConsumed = duration;
        console.log('Total Special Paid Leave Duration Consumed:', duration);
      },
      (error: any) => {
        console.error('Error retrieving total special paid leave duration consumed:', error);
      }
    );
    }
  }
  
  getTotalDurationSichnessLeaveConsumed(): void {
    if (this.timeOff && this.timeOff.employee) {
      console.log("employee getTotalDurationSpecialPaidLeaveConsumed", this.timeOff.employee.id);
    this.timeOffService.getTotalDurationSicknessLeaveConsumed(this.timeOff.employee.id).subscribe(
      (duration: number) => {
        this.totalDurationSichnessLeaveConsumed = duration;
        console.log('Total Sickness Leave Duration Consumed:', duration);
      },
      (error: any) => {
        console.error('Error retrieving total sickness leave duration consumed:', error);
      }
    );
    }
  }

  getTotalDurationPaidLeaveConsumed(): void {
    if (this.timeOff && this.timeOff.employee) {
      console.log("employee getTotalDurationPaidLeaveConsumed", this.timeOff.employee.id);
    this.timeOffService.getTotalDurationPaidLeaveEmployeeId(this.timeOff.employee.id).subscribe(
      (duration: number) => {
        this.totalDurationPaidLeaveConsumed = duration;
        console.log('Total Paid Leave Duration Consumed:', duration);
      },
      (error: any) => {
        console.error('Error retrieving total paid leave duration consumed:', error);
      }
    );
    }
  }
  
  getTotalDurationUnpaidLeaveEmployeeId(): void {
    if (this.timeOff && this.timeOff.employee) {
      console.log("employee getTotalDurationUnpaidLeaveEmployeeId", this.timeOff.employee.id);
    this.timeOffService.getTotalDurationUnpaidLeaveEmployeeId(this.timeOff.employee.id).subscribe(
      (duration: number) => {
        this.totalDurationUnpaidLeaveConsumed = duration;
        console.log('Total Unpaid Leave Duration Consumed:', duration);
      },
      (error: any) => {
        console.error('Error retrieving total Unpaid leave duration consumed:', error);
      }
    );
    }
  }

  
  
  
  
  employeeTitleMap = {
    [Title.FRONT_END_DEVELOPER]: 'Développeur Front-End',
    [Title.BACK_END_DEVELOPER]: 'Développeur Back-End',
    [Title.FULLSTACK_DEVELOPER]: 'Développeur Full-Stack',
    [Title.CRM]: 'CRM',
    [Title.HUMAN_RESOURCE_MANAGER]: 'Responsable Ressources Humaines',
    [Title.HUMAN_RESOURCE]: 'Ressources Humaines',
    [Title.PROJECT_MANAGER]: 'Chef de Projet',
    [Title.TECH_LEAD]: 'Chef de Projet',
    [Title.UI_UX_DESIGNER]: 'Concepteur UI/UX',
    [Title.QA_ENGINEER]: 'Ingénieur QA',
    [Title.DEVOPS_ENGINEER]: 'Ingénieur DevOps',
    [Title.WEB_DEVELOPER]: 'Développeur Web',
    [Title.OFFICE_MANAGER]: 'Responsable d Agence',
    [Title.ACCOUNTANT]: 'Comptable',
    [Title.SALES_REPRESENTATIVE]: 'Représentant Commercial',
    [Title.CUSTOMER_SUPPORT_SPECIALIST]: 'Spécialiste du Support Client',
    [Title.MARKETING_COORDINATOR]: 'Coordinateur Marketing'
  };

  
  requestStatusMap = {
    [RequestStatus.REJECTED]: 'Refusé',
    [RequestStatus.VALIDATED]: 'Validé',
    [RequestStatus.PENDING]: 'En cours',
   
  };

  timeOffPeriodTypeMap = {
    [TimeOffPeriodType.QUARTER_DAY]:'Quart de jour',
    [TimeOffPeriodType.HALF_DAY]:'Demi journée',
    [TimeOffPeriodType.FULL_DAY]:'Jours'
    
  };

  
  timeOfTimeTypeMap = {
    [TimeOfTimeType.MORNING]:'Matin',
    [TimeOfTimeType.AFTERNOON]:'Aprés midi'
    
  };


  isHalfDayOrQuarterDay(timeOffPeriodType: TimeOffPeriodType): boolean {
    return timeOffPeriodType === TimeOffPeriodType.HALF_DAY || timeOffPeriodType === TimeOffPeriodType.QUARTER_DAY;
  }
  

}

