import { Component, Inject, OnInit } from '@angular/core';
import { Experience, ProfileReference } from 'app/shared/models/ProfileReference';
import { ProfileService } from '../profile.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  public profile : ProfileReference;
  public id : number;

  constructor(
    private profileService :ProfileService,
    private dialog: MatDialogRef<ViewProfileComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

    ngOnInit(): void {
     
      const data = this.data;
      this.profile= data.profile;

   
    }

    closeDialog(): void {
          this.dialog.close();
    }

    experienceMap = {
      [Experience.JUNIOR]:'Junior',
      [Experience.CONFIRMED]:'Confirmé',
      [Experience.SENIOR]:'Senior',
      [Experience.EXPERT]:'Expert'
      
    };

}
