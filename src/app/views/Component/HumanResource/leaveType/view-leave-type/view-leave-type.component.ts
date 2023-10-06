import { Component, OnInit, Inject } from '@angular/core';
import { LeaveType, TimeOffType } from 'app/shared/models/leaveType';
import { LeaveTypeService } from '../leave-type.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-leave-type',
  templateUrl: './view-leave-type.component.html',
  styleUrls: ['./view-leave-type.component.scss']
})
export class ViewLeaveTypeComponent implements OnInit {
  public leaveType : LeaveType;
  public id : number;
  constructor(
    private leaveTypeService :LeaveTypeService,
    private dialog: MatDialogRef<ViewLeaveTypeComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

    ngOnInit(): void {
      const data = this.data;
    this.leaveType= data.leaveType;
   
    }

    closeDialog(): void {
          this.dialog.close();
    }


    timeOffTypeMap = {
      [TimeOffType.UNPAIED_TIME_OFF]:'Congé sans solde',
      [TimeOffType.PAID_LEAVE]:'Congé payé',
      [TimeOffType.SICKNESS_LEAVE]:'Congé de maladie',
      [TimeOffType.SPECIAL_PAID_LEAVE]:'Congé spécial payé',
      [TimeOffType.OTHER]:'Autre'   
    };
  
}
