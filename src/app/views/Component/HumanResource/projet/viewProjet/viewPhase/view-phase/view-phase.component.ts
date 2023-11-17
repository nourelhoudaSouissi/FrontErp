import { Component, OnInit, Inject } from '@angular/core';
import { ProjetService } from '../../../projet.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-view-phase',
  templateUrl: './view-phase.component.html',
  styleUrls: ['./view-phase.component.scss']
})
export class ViewPhaseComponent implements OnInit {
  public phase : any;
  public id : number;
  constructor(
    private projectService :ProjetService,
    private dialog: MatDialogRef<ViewPhaseComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

  ngOnInit(): void {
    const data = this.data;
    this.phase= data.phase;
  }
  closeDialog(): void {
    this.dialog.close();
}

}
