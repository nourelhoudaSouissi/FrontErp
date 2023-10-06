import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { EgretCalendarEvent } from 'app/shared/models/event.model';



interface DialogData {
  event?: CalendarEvent,
  action?: string,
  date?: Date
}

@Component({
  selector: 'app-calendar-form-dialog',
  templateUrl: './calendar-form-dialog.component.html',
  styleUrls: ['./calendar-form-dialog.component.scss']
})
export class CalendarFormDialogComponent implements OnInit {
  editorData = `<h1>Egret | Angular material admin</h1>
  <p><a href="http://devegret.com" target="_blank"><strong>DevEgret</strong></a></p>
  <p><br></p><p><strong >Lorem Ipsum</strong>
  <span>&nbsp;is simply dummy text of the printing and typesetting industry. 
  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a 
  galley of type and scrambled it to make a type specimen book. It has survived not only five centuries</span></p>`;
  event: CalendarEvent;
  dialogTitle: string;
  eventForm: UntypedFormGroup;
  action: string;
  constructor(
    public dialogRef: MatDialogRef<CalendarFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private formBuilder: UntypedFormBuilder
  ) {
    this.event = data.event;
    this.action = data.action;
    
    if (this.action === 'edit') {
      this.dialogTitle = this.event.title;
    } else {
      this.dialogTitle = 'Ajouter Absence';
      this.event = new EgretCalendarEvent({
        start: data.date,
        end: data.date
      });
    }
    // console.log(data);
    this.eventForm = this.buildEventForm(this.event);
  }

  ngOnInit() {
  }

  buildEventForm(event: EgretCalendarEvent) {
    return new UntypedFormGroup({
      _id: new UntypedFormControl(event._id),
      start: new UntypedFormControl(event.start),
      end: new UntypedFormControl(event.end),
      allDay: new UntypedFormControl(event.allDay),
      color: this.formBuilder.group({
        primary: new UntypedFormControl(event.color.primary),
        secondary: new UntypedFormControl(event.color.secondary)
      }),
      meta: this.formBuilder.group({
        location: new UntypedFormControl(event.meta.location),
        notes: new UntypedFormControl(event.meta.notes)
      })
    });
  }

}
