import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { entretienRecrutmentService } from '../../entretienRecrutment.service';
import { Interview, InterviewMode, InterviewType, interviewLocation } from 'app/shared/models/Interview';

@Component({
  selector: 'app-interview-details-dialog',
  templateUrl: './interviewDetails-popup.component.html',
  styleUrls :['./interviewDetails-popup.component.scss'] 
})
export class InterviewDetailsDialogComponent implements OnInit {
    interview:Interview;
    id:number;
  constructor(
    private service:entretienRecrutmentService,
    public dialogRef: MatDialogRef<InterviewDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    if (this.data) {
        this.id = this.data.interviewId;
        console.log(this.id) // Update this line
        this.getInterviewDetails(); // Call the method to retrieve the interview details
      } }
      getInterviewDetails() {
        console.log(this.id); // Make sure the id is not undefined
        this.service.getInterview(this.id).subscribe((data: any) => {
          this.interview = data;
          console.log(this.interview); // Check the retrieved data
        });
      }
      


  onCloseClick(): void {
    this.dialogRef.close();
  }
  closeDialog(): void {
    // Fermer la boîte de dialogue
    this.dialogRef.close();
  }


  InterviewModeMap = {
    [InterviewMode.REMOTE]: 'À distance',
    [InterviewMode.ON_SITE]: 'Sur place',
    [InterviewMode.PHONE_INTERVIEW]: 'Téléphonique',
    [InterviewMode.VIDEOCONFERENCE]: 'Visioconférence',
  }
  
  
    InterviewTypeMap = {
    [InterviewType.TECHNICAL_INTERVIEW]: 'Entretien technique',
    [InterviewType.HUMAN_RESOURCE_INTERVIEW]: 'Entretien ressources humaines'
  }
  interviewLocationMap={
    [interviewLocation.INTERNAL]: 'Interne',
    [interviewLocation.EXTERNAL]: 'Externe'
  }
}
