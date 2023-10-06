import { Component, Inject, OnInit } from '@angular/core';
import { RecoveryDay, RecoveryHours, RecoveryLeave, RecoveryType } from 'app/shared/models/recoveryLeave';
import { RecoveryLeaveService } from '../recovery-leave.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RequestStatus } from 'app/shared/models/timeOff';

@Component({
  selector: 'app-view-recovery-leace',
  templateUrl: './view-recovery-leace.component.html',
  styleUrls: ['./view-recovery-leace.component.scss']
})
export class ViewRecoveryLeaceComponent implements OnInit {
  public recoveryLeave : RecoveryLeave;
  public id : number;
  constructor(
    private recoveryLeaveService :RecoveryLeaveService,
    private dialog: MatDialogRef<ViewRecoveryLeaceComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

    ngOnInit(): void {
      const data = this.data;
    this.recoveryLeave= data.recoveryLeave;
   
        }

        closeDialog(): void {
          this.dialog.close();
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
        requestStatusMap = {
          [RequestStatus.REJECTED]: 'Refusé',
          [RequestStatus.VALIDATED]: 'Validé',
          [RequestStatus.PENDING]: 'En cours',
  };
  
}
