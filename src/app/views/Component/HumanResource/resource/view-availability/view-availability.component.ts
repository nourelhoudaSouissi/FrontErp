import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-view-availability',
  templateUrl: './view-availability.component.html',
  styleUrls: ['./view-availability.component.scss']
})
export class ViewAvailabilityComponent implements OnInit {

  dateCourante: Date = new Date();
  evenements: CalendarEvent[] = []; // Vous pouvez définir vos propres événements ici

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ViewAvailabilityComponent>) { 
    
  }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents () {
    
      let event = {
        title: this.data.availability.comment,
        start: new Date(this.data.availability.startDate),
        end: new Date(this.data.availability.endDate),
        color: {primary: '', secondary: ''},
      }
      this.evenements.push(event);

    
  }

}
