import { Component, Inject, OnInit } from '@angular/core';
import { Offer } from 'app/shared/models/Offer';
import { OfferService } from '../offer.service';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-offer',
  templateUrl: './view-offer.component.html',
  styleUrls: ['./view-offer.component.scss']
})
export class ViewOfferComponent implements OnInit {

  public offer : Offer;
  public id : number;

  constructor(
    private offerService : OfferService,
    private dialogRef: MatDialogRef<ViewOfferComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.data.offre.id;
    const data = this.data;
    this.offer= data.offre;
  }




  // Fermer la boîte de dialogue
  closeDialog(): void { 
    this.dialogRef.close();
  }
}
