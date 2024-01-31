import { Component, Inject, OnInit } from '@angular/core';
import { ServiceReference } from 'app/shared/models/ServiceReference';
import { ServiceService } from '../service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.scss']
})
export class ViewServiceComponent implements OnInit {

  
  public service : ServiceReference;
  public id : number;

  constructor(
    private serviceService :ServiceService,
    private dialog: MatDialogRef<ViewServiceComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

    ngOnInit(): void {
      const data = this.data;
      this.service= data.service;
    }

    closeDialog(): void {
          this.dialog.close();
    }

}
