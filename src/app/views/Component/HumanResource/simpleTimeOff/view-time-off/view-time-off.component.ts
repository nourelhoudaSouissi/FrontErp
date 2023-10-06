import { Component, Inject, OnInit } from '@angular/core';
import { TimeOffService } from '../time-off.service';
import { RequestStatus, TimeOff } from 'app/shared/models/timeOff';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-time-off',
  templateUrl: './view-time-off.component.html',
  styleUrls: ['./view-time-off.component.scss']
})
export class ViewTimeOffComponent implements OnInit {
  id: number;
  timeOff: TimeOff;

  constructor(
    private timeOffService: TimeOffService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['iiid'];
    this.getTimeOffById();
  }

  getTimeOffById(): void {
    this.timeOffService.getItem(this.id).subscribe((dataView: any) => {
      this.timeOff = dataView;
      console.log("timeOff", this.timeOff);
      console.log("justificationDoc", this.timeOff.justificationDoc);
    });
  }

StatusMap = {
    [RequestStatus.PENDING]: 'En cours',
    [RequestStatus.VALIDATED]: 'Validé',
    [RequestStatus.REJECTED]: 'Refusé'
  };

  
}


