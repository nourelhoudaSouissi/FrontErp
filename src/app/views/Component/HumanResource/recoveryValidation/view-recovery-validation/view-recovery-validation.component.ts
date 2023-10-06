import { Component, Inject, OnInit } from '@angular/core';
import { RecoveryLeave } from 'app/shared/models/recoveryLeave';
import { RecoveryLeaveService } from '../../recoveryLeave/recovery-leave.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-recovery-validation',
  templateUrl: './view-recovery-validation.component.html',
  styleUrls: ['./view-recovery-validation.component.scss']
})
export class ViewRecoveryValidationComponent implements OnInit {
  public recoveryLeave : RecoveryLeave;
  public id : number;
  
  constructor(private recoveryLeaveService :RecoveryLeaveService,
    private dialog: MatDialogRef<ViewRecoveryValidationComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

  ngOnInit(): void {
    const data = this.data;
    this.recoveryLeave= data.recoveryLeave;
   
  }

  closeDialog(): void {
    this.dialog.close();
  }


}
