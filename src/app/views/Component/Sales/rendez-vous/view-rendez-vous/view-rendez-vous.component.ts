import { Component, OnInit, Inject } from '@angular/core';
import { RendezVous } from 'app/shared/models/rendez-vous';
import { RendezVousService } from '../rendez-vous.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-view-rendez-vous',
  templateUrl: './view-rendez-vous.component.html',
  styleUrls: ['./view-rendez-vous.component.scss']
})
export class ViewRendezVousComponent implements OnInit {
  public rendezVous : RendezVous;
  public id : number;
  constructor(
    private redezVousService :RendezVousService,
    private dialog: MatDialogRef<ViewRendezVousComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

  ngOnInit(): void {
    const data = this.data;
    this.rendezVous= data.rendezVous;
  }

  closeDialog(): void {
    this.dialog.close();
}

}
